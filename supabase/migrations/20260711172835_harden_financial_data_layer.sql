-- Enforce tenant ownership through composite foreign keys and add account balances.

alter table public.accounts
  add constraint accounts_id_user_key unique (id, user_id);

alter table public.categories
  add constraint categories_id_user_key unique (id, user_id);

alter table public.categories drop constraint categories_parent_id_fkey;
alter table public.categories
  add constraint categories_parent_owner_fkey
  foreign key (parent_id, user_id) references public.categories(id, user_id)
  on delete set null (parent_id);

alter table public.movements drop constraint movements_account_id_fkey;
alter table public.movements drop constraint movements_from_account_id_fkey;
alter table public.movements drop constraint movements_to_account_id_fkey;
alter table public.movements drop constraint movements_category_id_fkey;
alter table public.movements
  add constraint movements_account_owner_fkey
  foreign key (account_id, user_id) references public.accounts(id, user_id) on delete restrict;
alter table public.movements
  add constraint movements_from_account_owner_fkey
  foreign key (from_account_id, user_id) references public.accounts(id, user_id) on delete restrict;
alter table public.movements
  add constraint movements_to_account_owner_fkey
  foreign key (to_account_id, user_id) references public.accounts(id, user_id) on delete restrict;
alter table public.movements
  add constraint movements_category_owner_fkey
  foreign key (category_id, user_id) references public.categories(id, user_id) on delete set null (category_id);

alter table public.monthly_budgets drop constraint monthly_budgets_category_id_fkey;
alter table public.monthly_budgets
  add constraint monthly_budgets_category_owner_fkey
  foreign key (category_id, user_id) references public.categories(id, user_id) on delete cascade;

alter table public.savings_goals drop constraint savings_goals_account_id_fkey;
alter table public.savings_goals
  add constraint savings_goals_account_owner_fkey
  foreign key (account_id, user_id) references public.accounts(id, user_id) on delete set null (account_id);

alter table public.liabilities drop constraint liabilities_account_id_fkey;
alter table public.liabilities
  add constraint liabilities_account_owner_fkey
  foreign key (account_id, user_id) references public.accounts(id, user_id) on delete set null (account_id);

alter table public.scheduled_transactions drop constraint scheduled_transactions_account_id_fkey;
alter table public.scheduled_transactions drop constraint scheduled_transactions_destination_account_id_fkey;
alter table public.scheduled_transactions drop constraint scheduled_transactions_category_id_fkey;
alter table public.scheduled_transactions
  add constraint scheduled_transactions_account_owner_fkey
  foreign key (account_id, user_id) references public.accounts(id, user_id) on delete set null (account_id);
alter table public.scheduled_transactions
  add constraint scheduled_transactions_destination_account_owner_fkey
  foreign key (destination_account_id, user_id) references public.accounts(id, user_id) on delete set null (destination_account_id);
alter table public.scheduled_transactions
  add constraint scheduled_transactions_category_owner_fkey
  foreign key (category_id, user_id) references public.categories(id, user_id) on delete set null (category_id);

create index scheduled_transactions_account_idx on public.scheduled_transactions(account_id);
create index scheduled_transactions_destination_account_idx on public.scheduled_transactions(destination_account_id);
create index scheduled_transactions_category_idx on public.scheduled_transactions(category_id);

create or replace view public.account_balances
with (security_invoker = true)
as
select
  a.id,
  a.user_id,
  a.name,
  a.alias,
  a.type,
  a.currency_code,
  a.initial_balance,
  (
    a.initial_balance
    + coalesce(sum(case
        when m.type = 'income' and m.account_id = a.id then m.amount
        when m.type = 'expense' and m.account_id = a.id then -m.amount
        when m.type = 'transfer' and m.to_account_id = a.id then m.amount
        when m.type = 'transfer' and m.from_account_id = a.id then -m.amount
        else 0
      end), 0)
  )::numeric(14,2) as balance,
  a.bank_name,
  a.bank_custom_name,
  a.color,
  a.icon,
  a.is_archived,
  a.created_at,
  a.updated_at
from public.accounts a
left join public.movements m
  on m.user_id = a.user_id
  and (m.account_id = a.id or m.from_account_id = a.id or m.to_account_id = a.id)
group by a.id;

grant select on public.account_balances to authenticated;
