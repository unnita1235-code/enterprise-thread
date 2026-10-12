-- Core identity, workspaces, memberships, and audit events for Context Synthesizer.

create type public.workspace_role as enum ('owner', 'admin', 'analyst', 'viewer');

-- Profiles: user-facing fields only, no roles here.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Workspaces (tenants).
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.workspaces to authenticated;
grant all on public.workspaces to service_role;

alter table public.workspaces enable row level security;

-- Memberships: roles live here, never on profiles.
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'viewer',
  invited_by uuid,
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index workspace_members_user_idx on public.workspace_members (user_id);
create index workspace_members_workspace_idx on public.workspace_members (workspace_id);

grant select, insert, update, delete on public.workspace_members to authenticated;
grant all on public.workspace_members to service_role;

alter table public.workspace_members enable row level security;

-- Security-definer helpers to avoid recursive RLS.
create or replace function public.is_workspace_member(_workspace_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = _workspace_id and user_id = _user_id
  )
$$;

create or replace function public.has_workspace_role(_workspace_id uuid, _user_id uuid, _roles public.workspace_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = _workspace_id
      and user_id = _user_id
      and role = any(_roles)
  )
$$;

-- Workspace policies.
create policy "Members can read their workspaces"
  on public.workspaces for select to authenticated
  using (public.is_workspace_member(id, auth.uid()));

create policy "Authenticated users can create workspaces"
  on public.workspaces for insert to authenticated
  with check (created_by = auth.uid());

create policy "Owners and admins can update workspaces"
  on public.workspaces for update to authenticated
  using (public.has_workspace_role(id, auth.uid(), array['owner', 'admin']::public.workspace_role[]));

-- Membership policies.
create policy "Members can read memberships of their workspaces"
  on public.workspace_members for select to authenticated
  using (public.is_workspace_member(workspace_id, auth.uid()));

create policy "Workspace creator can add first membership"
  on public.workspace_members for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.workspaces w
      where w.id = workspace_id and w.created_by = auth.uid()
    )
  );

create policy "Owners and admins can manage memberships"
  on public.workspace_members for update to authenticated
  using (public.has_workspace_role(workspace_id, auth.uid(), array['owner', 'admin']::public.workspace_role[]));

create policy "Owners and admins can remove memberships"
  on public.workspace_members for delete to authenticated
  using (
    public.has_workspace_role(workspace_id, auth.uid(), array['owner', 'admin']::public.workspace_role[])
    or user_id = auth.uid()
  );

-- Audit events: append-only, workspace-scoped.
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  actor_id uuid,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_events_workspace_idx on public.audit_events (workspace_id, created_at desc);

grant select, insert on public.audit_events to authenticated;
grant all on public.audit_events to service_role;

alter table public.audit_events enable row level security;

create policy "Members can read audit events of their workspaces"
  on public.audit_events for select to authenticated
  using (public.is_workspace_member(workspace_id, auth.uid()));

create policy "Members can append audit events to their workspaces"
  on public.audit_events for insert to authenticated
  with check (
    actor_id = auth.uid()
    and (workspace_id is null or public.is_workspace_member(workspace_id, auth.uid()))
  );

-- Profile creation on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();