-- Sprint 2.1 / 2.6 - Bancos y Programados
-- Ejecutar en Supabase SQL Editor.

alter table public.accounts
  add column if not exists alias text,
  add column if not exists bank_name text,
  add column if not exists bank_custom_name text;

create table if not exists public.scheduled_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  amount numeric(14,2) not null,
  account_id uuid references public.accounts(id) on delete set null,
  destination_account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  frequency text not null,
  start_date date not null,
  next_due_date date not null,
  end_date date,
  status text not null default 'active',
  notes text,
  auto_create boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scheduled_transactions_name_not_empty check (length(trim(name)) > 0),
  constraint scheduled_transactions_amount_nonnegative check (amount >= 0),
  constraint scheduled_transactions_type_valid check (type in ('expense', 'income', 'transfer', 'debt_payment', 'subscription')),
  constraint scheduled_transactions_frequency_valid check (frequency in ('weekly', 'biweekly', 'monthly', 'yearly', 'custom')),
  constraint scheduled_transactions_status_valid check (status in ('active', 'paused', 'finished'))
);

create index if not exists scheduled_transactions_user_id_idx on public.scheduled_transactions(user_id);
create index if not exists scheduled_transactions_next_due_date_idx on public.scheduled_transactions(next_due_date);
create index if not exists scheduled_transactions_status_idx on public.scheduled_transactions(status);
create index if not exists scheduled_transactions_type_idx on public.scheduled_transactions(type);

alter table public.scheduled_transactions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'scheduled_transactions'
      and policyname = 'scheduled_transactions_crud_own'
  ) then
    create policy "scheduled_transactions_crud_own" on public.scheduled_transactions
    for all to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_scheduled_transactions_updated_at'
  ) then
    create trigger set_scheduled_transactions_updated_at
    before update on public.scheduled_transactions
    for each row execute function public.set_updated_at();
  end if;
end $$;

grant select, insert, update, delete on public.scheduled_transactions to authenticated;
