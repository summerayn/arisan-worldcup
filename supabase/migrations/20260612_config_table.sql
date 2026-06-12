-- Config table for admin settings (DOKU, payment modes, QRIS)
create table if not exists arisan_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Seed defaults
insert into arisan_config (key, value)
values
  ('doku_enabled', 'false'),
  ('manual_enabled', 'true'),
  ('doku_client_id', ''),
  ('doku_secret_key', ''),
  ('doku_base_url', 'https://api-sandbox.doku.com'),
  ('qris_url', '/qris.svg'),
  ('manual_instructions', 'Scan QRIS pakai app banking/e-wallet kamu, transfer tepat Rp100.000, lalu tunggu konfirmasi admin.')
on conflict (key) do nothing;
