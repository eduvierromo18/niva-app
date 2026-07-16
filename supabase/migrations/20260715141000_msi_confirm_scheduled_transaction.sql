-- Meses Sin Intereses (MSI) support, part 2/3: teach
-- confirm_scheduled_transaction() to recognize informational rows.
--
-- Every schedule type that existed before this migration has
-- is_informational = false (see previous migration's default), so this
-- change is a no-op for them: the branch added below only ever triggers for
-- MSI installment rows, and the existing movement-creation / recurrence
-- logic below it is untouched, byte-for-byte.

create or replace function public.confirm_scheduled_transaction(p_scheduled_id uuid)
returns uuid language plpgsql security invoker set search_path = public as $$
declare item public.scheduled_transactions%rowtype; movement_id uuid := gen_random_uuid(); next_date date;
begin
select * into item from public.scheduled_transactions where id = p_scheduled_id and user_id = (select auth.uid()) and status = 'active' for update;
if not found then raise exception 'Programado no encontrado o inactivo'; end if;
if item.is_informational then
  -- One-shot billing reminder: the movement was already created in full when
  -- the MSI purchase was made. Mark this installment done, nothing else.
  update public.scheduled_transactions set status = 'finished' where id = item.id;
  return null;
end if;
if item.type in ('transfer','debt_payment') then
insert into public.movements (id,user_id,type,from_account_id,to_account_id,amount,occurred_on,description,notes,is_recurring)
values (movement_id,item.user_id,'transfer',item.account_id,item.destination_account_id,item.amount,current_date,item.name,item.notes,true);
else
insert into public.movements (id,user_id,type,account_id,category_id,amount,occurred_on,description,notes,is_recurring)
values (movement_id,item.user_id,case when item.type='income' then 'income'::public.movement_type else 'expense'::public.movement_type end,item.account_id,item.category_id,item.amount,current_date,item.name,item.notes,true);
end if;
next_date := case item.frequency when 'weekly' then item.next_due_date + 7 when 'biweekly' then item.next_due_date + 14 when 'yearly' then (item.next_due_date + interval '1 year')::date else (item.next_due_date + interval '1 month')::date end;
update public.scheduled_transactions set next_due_date=next_date,status=case when item.end_date is not null and next_date>item.end_date then 'finished' else item.status end where id=item.id;
return movement_id;
end; $$;
revoke all on function public.confirm_scheduled_transaction(uuid) from public, anon;
grant execute on function public.confirm_scheduled_transaction(uuid) to authenticated;
