-- Add 'manual' to provider check constraint for QRIS manual payment
alter table arisan_orders drop constraint if exists arisan_orders_provider_check;
alter table arisan_orders add constraint arisan_orders_provider_check check (provider in ('simulated', 'doku', 'manual'));
