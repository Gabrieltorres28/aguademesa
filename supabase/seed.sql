insert into public.brands (name, phone, notes) values
  ('Aguita', null, 'Revendedor: trae bidones propios para lavado, desinfección y llenado.'),
  ('Azulitas', null, 'Cliente de llenado por unidad.'),
  ('Cuatro Hermanitos', null, 'Marca externa, no usa bidones de Dos Hermanas.'),
  ('Dos Hermanas', null, 'Operación propia')
on conflict do nothing;

insert into public.stock_items (name, category, current_stock, min_stock, unit) values
  ('Bidón 20L lleno', 'Bidones propios', 145, 50, 'unidad'),
  ('Bidón 20L vacío', 'Bidones propios', 35, 30, 'unidad'),
  ('Tapas', 'Insumos', 250, 100, 'unidad'),
  ('Etiquetas', 'Insumos', 45, 100, 'unidad'),
  ('Sal', 'Insumos', 5, 10, 'bolsa'),
  ('Insumos de limpieza', 'Planta', 12, 10, 'kit')
on conflict do nothing;

insert into public.own_clients (name, phone, address, bottles_in_street, balance) values
  ('Familia Rodríguez', null, null, 2, 4500),
  ('Oficina Central', null, null, 5, 12000)
on conflict do nothing;

insert into public.settings (business_name, default_filling_price, default_delivery_price)
select 'Agua de Mesa Dos Hermanas', 700, 0
where not exists (select 1 from public.settings);

-- Categorías sugeridas para caja:
-- Llenado, Reparto propio, Combustible, Insumos, Impuestos, Mantenimiento, Sueldos, Otros
