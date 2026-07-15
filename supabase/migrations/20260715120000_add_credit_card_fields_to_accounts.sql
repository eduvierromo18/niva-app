alter table public.accounts
  add column statement_closing_day smallint,
  add column payment_due_day smallint,
  add column credit_limit numeric(14,2);

alter table public.accounts
  add constraint accounts_closing_day_valid check (statement_closing_day is null or statement_closing_day between 1 and 31),
  add constraint accounts_due_day_valid check (payment_due_day is null or payment_due_day between 1 and 31),
  add constraint accounts_credit_limit_nonnegative check (credit_limit is null or credit_limit >= 0);

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
  a.statement_closing_day,
  a.payment_due_day,
  a.credit_limit,
  a.color,
  a.icon,
  a.is_archived,
  a.created_at,
  a.updated_at
from public.accounts a
left join public.movements m
  on m.user_id = a.user_id
  and (m.account_id = a.id or m.to_account_id = a.id or m.from_account_id = a.id)
group by a.id;

grant select on public.account_balances to authenticated;
