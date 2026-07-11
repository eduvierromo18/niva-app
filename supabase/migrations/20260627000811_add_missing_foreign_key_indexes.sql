create index if not exists monthly_budgets_category_idx on public.monthly_budgets(category_id);
create index if not exists savings_goals_account_idx on public.savings_goals(account_id);
create index if not exists liabilities_account_idx on public.liabilities(account_id);
