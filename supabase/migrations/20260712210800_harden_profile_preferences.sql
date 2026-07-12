alter table public.profiles
  add constraint profiles_currency_code_format
  check (currency_code ~ '^[A-Z]{3}$') not valid,
  add constraint profiles_locale_format
  check (locale ~ '^[a-z]{2}-[A-Z]{2}$') not valid,
  add constraint profiles_full_name_length
  check (full_name is null or char_length(btrim(full_name)) between 1 and 120) not valid;

alter table public.profiles validate constraint profiles_currency_code_format;
alter table public.profiles validate constraint profiles_locale_format;
alter table public.profiles validate constraint profiles_full_name_length;

