create table lesions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  zone        text,
  color       text default '#3266ad',
  is_active   boolean default true,
  created_at  timestamptz default now()
);

alter table lesions enable row level security;
create policy "Users manage own lesions" on lesions for all using (auth.uid() = user_id);

create table sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  lesion_id   uuid references lesions(id) on delete cascade not null,
  date        date not null,
  pain_level  smallint not null check (pain_level between 1 and 10),
  exercises   text,
  notes       text,
  created_at  timestamptz default now()
);

alter table sessions enable row level security;
create policy "Users manage own sessions" on sessions for all using (auth.uid() = user_id);

create table session_photos (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid references sessions(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  storage_path text not null,
  created_at  timestamptz default now()
);

alter table session_photos enable row level security;
create policy "Users manage own photos" on session_photos for all using (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('session-photos', 'session-photos', false);

create policy "Users upload own photos"
  on storage.objects for insert
  with check (bucket_id = 'session-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users read own photos"
  on storage.objects for select
  using (bucket_id = 'session-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users delete own photos"
  on storage.objects for delete
  using (bucket_id = 'session-photos' and auth.uid()::text = (storage.foldername(name))[1]);
