alter table public.liabilities
  add constraint liabilities_account_id_unique unique (account_id);
