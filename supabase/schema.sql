create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'OPERATOR' check (role in ('ADMIN', 'OPERATOR')),
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.fillings (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete restrict,
  filling_date date not null,
  received_qty integer not null default 0 check (received_qty >= 0),
  filled_qty integer not null default 0 check (filled_qty >= 0),
  withdrawn_qty integer not null default 0 check (withdrawn_qty >= 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  total_amount numeric(12,2) generated always as (filled_qty * unit_price) stored,
  paid_amount numeric(12,2) not null default 0 check (paid_amount >= 0),
  payment_status text not null default 'PENDIENTE' check (payment_status in ('PAGADO', 'PENDIENTE', 'PARCIAL')),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.own_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  bottles_in_street integer not null default 0 check (bottles_in_street >= 0),
  balance numeric(12,2) not null default 0,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.own_clients
add column if not exists is_active boolean not null default true;

create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.own_clients(id) on delete restrict,
  delivery_date date not null,
  product text not null default 'Bidón 20L',
  delivered_qty integer not null default 0 check (delivered_qty >= 0),
  returned_empty_qty integer not null default 0 check (returned_empty_qty >= 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  total_amount numeric(12,2) generated always as (delivered_qty * unit_price) stored,
  paid_amount numeric(12,2) not null default 0 check (paid_amount >= 0),
  payment_status text not null default 'PENDIENTE' check (payment_status in ('PAGADO', 'PENDIENTE', 'PARCIAL')),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  current_stock integer not null default 0,
  min_stock integer not null default 0,
  unit text default 'unidad',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cash_movements (
  id uuid primary key default gen_random_uuid(),
  movement_date date not null,
  type text not null check (type in ('INGRESO', 'EGRESO')),
  category text not null,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  related_brand_id uuid references public.brands(id),
  related_client_id uuid references public.own_clients(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Agua de Mesa Dos Hermanas',
  default_filling_price numeric(12,2) not null default 700,
  default_delivery_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_fillings_updated_at on public.fillings;
create trigger set_fillings_updated_at
before update on public.fillings
for each row execute function public.set_updated_at();

drop trigger if exists set_deliveries_updated_at on public.deliveries;
create trigger set_deliveries_updated_at
before update on public.deliveries
for each row execute function public.set_updated_at();

drop trigger if exists set_stock_items_updated_at on public.stock_items;
create trigger set_stock_items_updated_at
before update on public.stock_items
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'OPERATOR')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.fillings enable row level security;
alter table public.own_clients enable row level security;
alter table public.deliveries enable row level security;
alter table public.stock_items enable row level security;
alter table public.cash_movements enable row level security;
alter table public.settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN'
  );
$$;

create policy "authenticated select profiles" on public.profiles for select to authenticated using (true);
create policy "authenticated update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "authenticated read brands" on public.brands for select to authenticated using (true);
create policy "authenticated write brands" on public.brands for insert to authenticated with check (true);
create policy "authenticated update brands" on public.brands for update to authenticated using (true) with check (true);
create policy "admin delete brands" on public.brands for delete to authenticated using (public.is_admin());

create policy "authenticated read fillings" on public.fillings for select to authenticated using (true);
create policy "authenticated write fillings" on public.fillings for insert to authenticated with check (true);
create policy "authenticated update fillings" on public.fillings for update to authenticated using (true) with check (true);
create policy "admin delete fillings" on public.fillings for delete to authenticated using (public.is_admin());

create policy "authenticated read own_clients" on public.own_clients for select to authenticated using (true);
create policy "authenticated write own_clients" on public.own_clients for insert to authenticated with check (true);
create policy "authenticated update own_clients" on public.own_clients for update to authenticated using (true) with check (true);
create policy "admin delete own_clients" on public.own_clients for delete to authenticated using (public.is_admin());

create policy "authenticated read deliveries" on public.deliveries for select to authenticated using (true);
create policy "authenticated write deliveries" on public.deliveries for insert to authenticated with check (true);
create policy "authenticated update deliveries" on public.deliveries for update to authenticated using (true) with check (true);
create policy "admin delete deliveries" on public.deliveries for delete to authenticated using (public.is_admin());

create policy "authenticated read stock_items" on public.stock_items for select to authenticated using (true);
create policy "authenticated write stock_items" on public.stock_items for insert to authenticated with check (true);
create policy "authenticated update stock_items" on public.stock_items for update to authenticated using (true) with check (true);
create policy "admin delete stock_items" on public.stock_items for delete to authenticated using (public.is_admin());

create policy "authenticated read cash_movements" on public.cash_movements for select to authenticated using (true);
create policy "authenticated write cash_movements" on public.cash_movements for insert to authenticated with check (true);
create policy "authenticated update cash_movements" on public.cash_movements for update to authenticated using (true) with check (true);
create policy "admin delete cash_movements" on public.cash_movements for delete to authenticated using (public.is_admin());

create policy "authenticated read settings" on public.settings for select to authenticated using (true);
create policy "authenticated write settings" on public.settings for insert to authenticated with check (true);
create policy "authenticated update settings" on public.settings for update to authenticated using (true) with check (true);
