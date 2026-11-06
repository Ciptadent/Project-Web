create table orders (
  id bigserial primary key,
  invoice text unique not null,
  game text not null, sku text not null, item_label text,
  user_game_id text not null, server text default '', contact text default '',
  total integer not null,
  status text not null default 'PENDING', -- PENDING, PAID, SUCCESS, FAILED
  created_at timestamptz default now()
);
alter table orders enable row level security; -- akses hanya lewat service key di server
