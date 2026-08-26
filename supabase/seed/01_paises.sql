-- paises: filas 1-21 de 21
insert into paises (id, nombre, codigo, region, gdp, poblacion, industrias_clave, embargo_status, coordenadas) values
  ('US', 'Estados Unidos', 'US', 'Americas', 27360700000000, 338290000, '["Tecnología","Semiconductores","Financiero","Energía"]'::jsonb, 'none', '{"lat":37.0902,"lon":-95.7129}'::jsonb),
  ('CN', 'China', 'CN', 'Asia', 17734120000000, 1425887337, '["Manufactura","Tecnología","Energía","Minerales"]'::jsonb, 'partial', '{"lat":35.8617,"lon":104.1954}'::jsonb),
  ('GB', 'Reino Unido', 'GB', 'Europa', 3099100000000, 67736802, '["Financiero","Tecnología","Energía"]'::jsonb, 'none', '{"lat":55.3781,"lon":-3.436}'::jsonb),
  ('DE', 'Alemania', 'DE', 'Europa', 4311700000000, 84482200, '["Manufactura","Automotriz","Tecnología","Energía"]'::jsonb, 'none', '{"lat":51.1657,"lon":10.4515}'::jsonb),
  ('JP', 'Japón', 'JP', 'Asia', 4230900000000, 123294513, '["Semiconductores","Automotriz","Electrónica","Manufactura"]'::jsonb, 'none', '{"lat":36.2048,"lon":138.2529}'::jsonb),
  ('KR', 'Corea del Sur', 'KR', 'Asia', 1642383000000, 51780579, '["Semiconductores","Electrónica","Automotriz"]'::jsonb, 'none', '{"lat":35.9078,"lon":127.7669}'::jsonb),
  ('TW', 'Taiwán', 'TW', 'Asia', 768995000000, 23899908, '["Semiconductores","Electrónica","Manufactura"]'::jsonb, 'none', '{"lat":23.6978,"lon":120.9605}'::jsonb),
  ('NL', 'Países Bajos', 'NL', 'Europa', 1386400000000, 17530620, '["Tecnología","Manufactura de equipos","Energía"]'::jsonb, 'none', '{"lat":52.1326,"lon":5.2913}'::jsonb),
  ('CA', 'Canadá', 'CA', 'Americas', 2176451000000, 39742830, '["Energía","Minerales","Tecnología","Manufactura"]'::jsonb, 'none', '{"lat":56.1304,"lon":-106.3468}'::jsonb),
  ('AU', 'Australia', 'AU', 'Oceanía', 1376437000000, 26505810, '["Minería","Energía","Agricultura"]'::jsonb, 'none', '{"lat":-25.2744,"lon":133.7751}'::jsonb),
  ('IR', 'Irán', 'IR', 'Asia', 432686000000, 90503784, '["Petróleo","Gas","Manufactura"]'::jsonb, 'complete', '{"lat":32.4279,"lon":53.688}'::jsonb),
  ('SG', 'Singapur', 'SG', 'Asia', 525230000000, 5975000, '["Tecnología","Financiero","Manufactura","Logística"]'::jsonb, 'none', '{"lat":1.3521,"lon":103.8198}'::jsonb),
  ('FR', 'Francia', 'FR', 'Europa', 3030000000000, 68170000, '["Aeroespacial","Lujo","Energía","Tecnología"]'::jsonb, 'none', '{"lat":46.2276,"lon":2.2137}'::jsonb),
  ('SE', 'Suecia', 'SE', 'Europa', 593000000000, 10540000, '["Telecomunicaciones","Manufactura","Tecnología"]'::jsonb, 'none', '{"lat":60.1282,"lon":18.6435}'::jsonb),
  ('CH', 'Suiza', 'CH', 'Europa', 905684000000, 8900000, '["Financiero","Farmacéutica","Manufactura de precisión"]'::jsonb, 'none', '{"lat":46.8182,"lon":8.2275}'::jsonb),
  ('IL', 'Israel', 'IL', 'Asia', 525000000000, 9800000, '["Tecnología","Ciberseguridad","Semiconductores"]'::jsonb, 'none', '{"lat":31.0461,"lon":34.8516}'::jsonb),
  ('IN', 'India', 'IN', 'Asia', 3730000000000, 1441720000, '["Tecnología","Software","Manufactura","Farmacéutica"]'::jsonb, 'none', '{"lat":20.5937,"lon":78.9629}'::jsonb),
  ('BR', 'Brasil', 'BR', 'Americas', 2170000000000, 216422000, '["Agricultura","Minería","Energía","Manufactura"]'::jsonb, 'none', '{"lat":-14.235,"lon":-51.9253}'::jsonb),
  ('MX', 'México', 'MX', 'Americas', 1850000000000, 128455000, '["Manufactura","Automotriz","Electrónica","Energía"]'::jsonb, 'none', '{"lat":23.6345,"lon":-102.5528}'::jsonb),
  ('NZ', 'Nueva Zelanda', 'NZ', 'Oceanía', 253000000000, 5223000, '["Agricultura","Turismo","Tecnología"]'::jsonb, 'none', '{"lat":-40.9006,"lon":174.886}'::jsonb),
  ('TH', 'Tailandia', 'TH', 'Asia', 528000000000, 71801000, '["Manufactura","Automotriz","Electrónica","Turismo"]'::jsonb, 'none', '{"lat":15.87,"lon":100.9925}'::jsonb)
on conflict (id) do nothing;
