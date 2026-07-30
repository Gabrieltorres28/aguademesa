-- Perfil ampliado de clientes propios.
-- Migración incremental: no elimina ni reemplaza datos existentes.

alter table public.own_clients
  add column if not exists sector text not null default 'Otros',
  add column if not exists delivery_group text,
  add column if not exists habitual_days text[] not null default '{}'::text[],
  add column if not exists client_type text not null default 'fijo';
