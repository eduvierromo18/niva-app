-- Meses Sin Intereses (MSI) support, part 3/3: atomic creation.
--
-- Supabase's JS client cannot wrap "insert movement + insert N schedule
-- rows" in a single DB transaction across separate .insert() calls, so this
-- has to be a plpgsql function: one movement (the full amount, raising the
-- card balance right away) plus N informational scheduled_transactions rows
-- (the billing reminders), all committed together or not at all.
--
-- Rounding: the last installment absorbs whatever the equal split truncates
-- away, matching how card issuers actually bill MSI (every month but the
-- last is identical; the remainder always lands on the final statement).

create or replace function public.create_msi_expense(
  p_account_id uuid,
  p_category_id uuid,
  p_amount numeric,
  p_occurred_on date,
  p_description text,
  p_installments smallint,
  p_notes text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_account_type public.account_type;
  v_movement_id uuid := gen_random_uuid();
  v_base numeric(14,2);
  v_last numeric(14,2);
begin
  if p_installments not in (3, 6, 9, 12, 18, 24) then
    raise exception 'Plazo de MSI no soportado: %', p_installments;
  end if;
  if p_amount <= 0 then
    raise exception 'El monto debe ser mayor a cero';
  end if;

  select type into v_account_type from public.accounts where id = p_account_id and user_id = v_user_id;
  if v_account_type is null then
    raise exception 'Cuenta no encontrada';
  elsif v_account_type <> 'credit_card' then
    raise exception 'Meses sin intereses solo aplica a cuentas de tipo tarjeta de credito';
  end if;

  v_base := trunc(p_amount / p_installments, 2);
  v_last := p_amount - v_base * (p_installments - 1);
  if v_base <= 0 then
    raise exception 'El monto es demasiado bajo para % meses sin intereses', p_installments;
  end if;

  insert into public.movements
    (id, user_id, type, account_id, category_id, amount, occurred_on, description, notes)
  values
    (v_movement_id, v_user_id, 'expense', p_account_id, p_category_id, p_amount, p_occurred_on, p_description, p_notes);

  insert into public.scheduled_transactions
    (user_id, name, type, amount, account_id, category_id, frequency, start_date, next_due_date,
     status, is_informational, movement_id, total_installments, installment_number, notes)
  select
    v_user_id,
    p_description || ' — Cuota ' || gs || '/' || p_installments,
    'msi_installment',
    case when gs = p_installments then v_last else v_base end,
    p_account_id,
    p_category_id,
    'monthly',
    p_occurred_on,
    (p_occurred_on + (gs || ' months')::interval)::date,
    'active',
    true,
    v_movement_id,
    p_installments,
    gs,
    p_notes
  from generate_series(1, p_installments) as gs;

  return v_movement_id;
end;
$$;

revoke all on function public.create_msi_expense(uuid, uuid, numeric, date, text, smallint, text) from public, anon;
grant execute on function public.create_msi_expense(uuid, uuid, numeric, date, text, smallint, text) to authenticated;
