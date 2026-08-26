-- Vacía las tablas antes de recargar con el nuevo dataset de empresas
-- reales. Los IDs cambiaron por completo (antes tickers aleatorios como
-- "SS3957", ahora tickers reales como "NVDA"), así que hay que limpiar
-- antes de correr los archivos de supabase/seed/ de nuevo.
--
-- Corre esto PRIMERO, en el SQL Editor de Supabase. paises.json y
-- recursos_criticos.json no cambiaron, así que esas dos tablas se dejan
-- intactas (truncarlas de todos modos no hace daño si prefieres limpiar
-- todo).

truncate table recursos_empresa;
truncate table dependencias;
truncate table empresas;
