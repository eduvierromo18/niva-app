-- Finanzas Personales - Supabase schema
-- Ejecutar en el SQL editor de Supabase o convertir en migracion.

create extension if not exists pgcrypto;

create schema if not exists private;

create type public.account_type as enum (
  'cash',
  'checking',
  'savings',
  'credit_card',
  'loan',
  'investment',
  'other'
);

create type public.category_type as enum ('income', 'expense');
create type public.movement_type as enum ('income', 'expense', 'transfer');
create type public.goal_status as enum ('active', 'paused', 'completed', 'cancelled');
create type public.liability_type as enum ('credit_card', 'loan', 'personal_debt', 'other');
create type public.liability_status as enum ('active', 'paid', 'closed');
create type public.invitation_status as enum ('created', 'revoked');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  currency_code char(3) not null default 'MXN',
  locale text not null default 'es-MX',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  alias text,
  type public.account_type not null,
  currency_code char(3) not null default 'MXN',
  initial_balance numeric(14,2) not null default 0,
  bank_name text,
  bank_custom_name text,
  statement_closing_day smallint,
  payment_due_day smallint,
  credit_limit numeric(14,2),
  color text,
  icon text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accounts_name_not_empty check (length(trim(name)) > 0),
  constraint accounts_closing_day_valid check (statement_closing_day is null or statement_closing_day between 1 and 31),
  constraint accounts_due_day_valid check (payment_due_day is null or payment_due_day between 1 and 31),
  constraint accounts_credit_limit_nonnegative check (credit_limit is null or credit_limit >= 0)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  type public.category_type not null,
  color text,
  icon text,
  sort_order integer not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_not_empty check (length(trim(name)) > 0),
  constraint categories_unique_name_per_type unique (user_id, type, name)
);

create table public.movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.movement_type not null,
  account_id uuid references public.accounts(id) on delete restrict,
  from_account_id uuid references public.accounts(id) on delete restrict,
  to_account_id uuid references public.accounts(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric(14,2) not null,
  occurred_on date not null default current_date,
  description text,
  notes text,
  merchant text,
  is_recurring boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint movements_amount_positive check (amount > 0),
  constraint movements_shape check (
    (
      type in ('income', 'expense')
      and account_id is not null
      and from_account_id is null
      and to_account_id is null
    )
    or
    (
      type = 'transfer'
      and account_id is null
      and category_id is null
      and from_account_id is not null
      and to_account_id is not null
      and from_account_id <> to_account_id
    )
  )
);

create table public.monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month date not null,
  amount numeric(14,2) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint monthly_budgets_amount_nonnegative check (amount >= 0),
  constraint monthly_budgets_month_first_day check (date_trunc('month', month)::date = month),
  constraint monthly_budgets_unique unique (user_id, category_id, month)
);

create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  name text not null,
  target_amount numeric(14,2) not null,
  current_amount numeric(14,2) not null default 0,
  target_date date,
  status public.goal_status not null default 'active',
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint savings_goals_name_not_empty check (length(trim(name)) > 0),
  constraint savings_goals_target_positive check (target_amount > 0),
  constraint savings_goals_current_nonnegative check (current_amount >= 0)
);

create table public.liabilities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  name text not null,
  type public.liability_type not null,
  status public.liability_status not null default 'active',
  principal_amount numeric(14,2) not null default 0,
  credit_limit numeric(14,2),
  apr numeric(6,3),
  statement_closing_day smallint,
  payment_due_day smallint,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint liabilities_name_not_empty check (length(trim(name)) > 0),
  constraint liabilities_principal_nonnegative check (principal_amount >= 0),
  constraint liabilities_credit_limit_nonnegative check (credit_limit is null or credit_limit >= 0),
  constraint liabilities_apr_nonnegative check (apr is null or apr >= 0),
  constraint liabilities_closing_day_valid check (statement_closing_day is null or statement_closing_day between 1 and 31),
  constraint liabilities_due_day_valid check (payment_due_day is null or payment_due_day between 1 and 31)
);

create table public.user_invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  invited_user_id uuid references public.profiles(id) on delete set null,
  invited_email text not null,
  invited_name text not null,
  role text not null default 'Invitado',
  status public.invitation_status not null default 'created',
  created_at timestamptz not null default now(),
  constraint user_invitations_name_not_empty check (length(trim(invited_name)) > 0)
);

create table public.scheduled_transactions (
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
  constraint scheduled_transactions_amount_positive check (amount > 0),
  constraint scheduled_transactions_type_valid check (type in ('expense', 'income', 'transfer', 'debt_payment', 'subscription')),
  constraint scheduled_transactions_frequency_valid check (frequency in ('weekly', 'biweekly', 'monthly', 'yearly', 'custom')),
  constraint scheduled_transactions_status_valid check (status in ('active', 'paused', 'finished'))
);

create index accounts_user_id_idx on public.accounts(user_id);
create index accounts_user_active_idx on public.accounts(user_id, is_archived);
create index categories_user_type_idx on public.categories(user_id, type);
create index categories_parent_id_idx on public.categories(parent_id);
create index movements_user_date_idx on public.movements(user_id, occurred_on desc);
create index movements_account_idx on public.movements(account_id);
create index movements_from_account_idx on public.movements(from_account_id);
create index movements_to_account_idx on public.movements(to_account_id);
create index movements_category_idx on public.movements(category_id);
create index monthly_budgets_user_month_idx on public.monthly_budgets(user_id, month);
create index monthly_budgets_category_idx on public.monthly_budgets(category_id);
create index savings_goals_user_status_idx on public.savings_goals(user_id, status);
create index savings_goals_account_idx on public.savings_goals(account_id);
create index liabilities_user_status_idx on public.liabilities(user_id, status);
create index liabilities_account_idx on public.liabilities(account_id);
create index user_invitations_owner_idx on public.user_invitations(owner_id);
create index user_invitations_invited_user_idx on public.user_invitations(invited_user_id);
create index scheduled_transactions_user_id_idx on public.scheduled_transactions(user_id);
create index scheduled_transactions_next_due_date_idx on public.scheduled_transactions(next_due_date);
create index scheduled_transactions_status_idx on public.scheduled_transactions(status);
create index scheduled_transactions_type_idx on public.scheduled_transactions(type);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger set_accounts_updated_at before update on public.accounts
for each row execute function public.set_updated_at();
create trigger set_categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger set_movements_updated_at before update on public.movements
for each row execute function public.set_updated_at();
create trigger set_monthly_budgets_updated_at before update on public.monthly_budgets
for each row execute function public.set_updated_at();
create trigger set_savings_goals_updated_at before update on public.savings_goals
for each row execute function public.set_updated_at();
create trigger set_liabilities_updated_at before update on public.liabilities
for each row execute function public.set_updated_at();
create trigger set_scheduled_transactions_updated_at before update on public.scheduled_transactions
for each row execute function public.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.movements enable row level security;
alter table public.monthly_budgets enable row level security;
alter table public.savings_goals enable row level security;
alter table public.liabilities enable row level security;
alter table public.user_invitations enable row level security;
alter table public.scheduled_transactions enable row level security;

create policy "profiles_select_own" on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "accounts_crud_own" on public.accounts
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "categories_crud_own" on public.categories
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "movements_crud_own" on public.movements
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "monthly_budgets_crud_own" on public.monthly_budgets
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "savings_goals_crud_own" on public.savings_goals
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "liabilities_crud_own" on public.liabilities
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "user_invitations_owner_crud" on public.user_invitations
for all to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "scheduled_transactions_crud_own" on public.scheduled_transactions
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant usage on type public.account_type to authenticated;
grant usage on type public.category_type to authenticated;
grant usage on type public.movement_type to authenticated;
grant usage on type public.goal_status to authenticated;
grant usage on type public.liability_type to authenticated;
grant usage on type public.liability_status to authenticated;
grant usage on type public.invitation_status to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.accounts to authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.movements to authenticated;
grant select, insert, update, delete on public.monthly_budgets to authenticated;
grant select, insert, update, delete on public.savings_goals to authenticated;
grant select, insert, update, delete on public.liabilities to authenticated;
grant select, insert, update, delete on public.user_invitations to authenticated;
grant select, insert, update, delete on public.scheduled_transactions to authenticated;

create or replace view public.monthly_financial_summary
with (security_invoker = true)
as
select
  user_id,
  date_trunc('month', occurred_on)::date as month,
  coalesce(sum(amount) filter (where type = 'income'), 0)::numeric(14,2) as income,
  coalesce(sum(amount) filter (where type = 'expense'), 0)::numeric(14,2) as expenses,
  (
    coalesce(sum(amount) filter (where type = 'income'), 0)
    - coalesce(sum(amount) filter (where type = 'expense'), 0)
  )::numeric(14,2) as savings,
  count(*) filter (where type <> 'transfer') as movement_count
from public.movements
group by user_id, date_trunc('month', occurred_on)::date;

create or replace view public.category_spending_summary
with (security_invoker = true)
as
select
  m.user_id,
  date_trunc('month', m.occurred_on)::date as month,
  m.category_id,
  c.name as category_name,
  c.color as category_color,
  sum(m.amount)::numeric(14,2) as amount
from public.movements m
join public.categories c on c.id = m.category_id
where m.type = 'expense'
group by m.user_id, date_trunc('month', m.occurred_on)::date, m.category_id, c.name, c.color;

grant select on public.monthly_financial_summary to authenticated;
grant select on public.category_spending_summary to authenticated;
