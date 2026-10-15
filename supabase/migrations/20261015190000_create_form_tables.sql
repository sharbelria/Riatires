-- Riatires: tables for website form submissions (no authentication).
-- Access model: anyone using the publishable key may INSERT rows; nobody may
-- read, update or delete through the public API. View data in the Supabase dashboard.

-- ---------- callback requests (home / contact page form) ----------
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 9 and 20),
  details text check (char_length(details) <= 300),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

-- ---------- orders ----------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique check (order_number ~ '^RT[0-9]{6}-[A-Z0-9]{4}$'),
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 2 and 80),
  phone text not null check (char_length(phone) between 9 and 20),
  city text not null check (char_length(city) between 2 and 60),
  email text check (char_length(email) <= 120),
  notes text check (char_length(notes) <= 500),
  payment_method text not null check (payment_method in ('card', 'cash', 'email')),
  total integer not null check (total > 0),
  status text not null default 'new' check (status in ('new', 'confirmed', 'installed', 'cancelled'))
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_number text not null references public.orders (order_number) on delete cascade,
  tire_id text not null check (char_length(tire_id) <= 100),
  brand text not null,
  model text not null,
  size text not null,
  qty integer not null check (qty between 1 and 8),
  unit_price integer not null check (unit_price > 0),
  line_total integer not null check (line_total = unit_price * qty)
);
create index order_items_order_number_idx on public.order_items (order_number);

-- ---------- confirmed card payments (written by the payment webhook) ----------
create table public.order_payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_number text not null references public.orders (order_number) on delete cascade,
  amount integer not null check (amount > 0),
  provider text not null check (provider in ('cardcom', 'mock')),
  transaction_id text check (char_length(transaction_id) <= 100)
);
create index order_payments_order_number_idx on public.order_payments (order_number);

-- ---------- privileges: least privilege, insert-only for anonymous visitors ----------
revoke all on public.contact_requests, public.orders, public.order_items, public.order_payments
  from anon, authenticated;
grant insert on public.contact_requests, public.orders, public.order_items, public.order_payments
  to anon;

-- ---------- row level security ----------
alter table public.contact_requests enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_payments enable row level security;

-- Visitors can submit, but cannot choose the internal status of what they submit.
create policy "Anyone can submit a callback request"
  on public.contact_requests for insert to anon
  with check (status = 'new');

create policy "Anyone can place an order"
  on public.orders for insert to anon
  with check (status = 'new');

create policy "Anyone can add items to an order"
  on public.order_items for insert to anon
  with check (qty between 1 and 8);

create policy "Payment confirmations can be recorded"
  on public.order_payments for insert to anon
  with check (amount > 0);
