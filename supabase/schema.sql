-- Terminal Bloomberg — esquema de datos en Supabase
-- Correr una sola vez en el SQL Editor de Supabase (Project → SQL Editor → New query).
-- Reemplaza los archivos estáticos en /public/data por estas tablas.

create table if not exists paises (
  id text primary key,
  nombre text not null,
  codigo text,
  region text,
  gdp bigint,
  poblacion bigint,
  industrias_clave jsonb not null default '[]',
  embargo_status text,
  coordenadas jsonb not null default '{}'
);

create table if not exists empresas (
  id text primary key,
  nombre text not null,
  ticker text,
  pais_id text references paises(id),
  sector text,
  subsector text,
  cap_mercado double precision,
  ubicacion_hq jsonb not null default '{}',
  resumen_trimestral jsonb not null default '{}',
  estado_geopolitico text,
  descripcion text
);
create index if not exists empresas_pais_id_idx on empresas(pais_id);

create table if not exists dependencias (
  id text primary key,
  empresa_a text references empresas(id),
  empresa_b text references empresas(id),
  tipo text,
  porcentaje_suministro double precision,
  es_critica boolean default false,
  descripcion text
);
create index if not exists dependencias_empresa_a_idx on dependencias(empresa_a);
create index if not exists dependencias_empresa_b_idx on dependencias(empresa_b);

create table if not exists recursos_criticos (
  id text primary key,
  nombre text not null,
  tipo text,
  descripcion text,
  principales_productores jsonb not null default '[]',
  dependencia_global double precision,
  precio_actual double precision,
  volatilidad text
);

create table if not exists recursos_empresa (
  id text primary key,
  empresa_id text references empresas(id),
  recurso_id text references recursos_criticos(id),
  tipo text,
  volumen_anual double precision,
  porcentaje_produccion_global double precision,
  descripcion text
);
create index if not exists recursos_empresa_empresa_id_idx on recursos_empresa(empresa_id);
create index if not exists recursos_empresa_recurso_id_idx on recursos_empresa(recurso_id);

create table if not exists cuellos_botella (
  id text primary key,
  nombre text not null,
  pais text,
  latitud double precision,
  longitud double precision,
  tipo text,
  criticidad text,
  porcentaje_global double precision,
  impacto_sectores jsonb not null default '[]',
  descripcion text,
  vulnerabilidades jsonb not null default '[]',
  empresas_afectadas jsonb not null default '[]',
  consecuencias_si_falla text,
  color text
);

-- RLS: datos públicos de solo lectura (sin autenticación, es un dashboard
-- abierto). Se habilita RLS y se agrega una policy de SELECT para el rol
-- anon; sin esto, Supabase bloquea todo acceso por defecto.
alter table paises enable row level security;
alter table empresas enable row level security;
alter table dependencias enable row level security;
alter table recursos_criticos enable row level security;
alter table recursos_empresa enable row level security;
alter table cuellos_botella enable row level security;

drop policy if exists "Lectura pública" on paises;
create policy "Lectura pública" on paises for select using (true);

drop policy if exists "Lectura pública" on empresas;
create policy "Lectura pública" on empresas for select using (true);

drop policy if exists "Lectura pública" on dependencias;
create policy "Lectura pública" on dependencias for select using (true);

drop policy if exists "Lectura pública" on recursos_criticos;
create policy "Lectura pública" on recursos_criticos for select using (true);

drop policy if exists "Lectura pública" on recursos_empresa;
create policy "Lectura pública" on recursos_empresa for select using (true);

drop policy if exists "Lectura pública" on cuellos_botella;
create policy "Lectura pública" on cuellos_botella for select using (true);
