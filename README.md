# Agua de Mesa Dos Hermanas

Sistema de gestión para llenados a revendedores, repartos propios, stock y caja.

## Configuración local

1. Crear un proyecto en Supabase.
2. En Supabase SQL Editor, ejecutar `supabase/schema.sql`.
3. Crear al menos un usuario desde Supabase Auth con email y contraseña.
4. Ejecutar `supabase/seed.sql` para cargar marcas e items iniciales.
5. Copiar `.env.example` a `.env.local` y completar:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

6. Instalar dependencias:

```bash
npm install
```

7. Correr desarrollo:

```bash
npm run dev
```

## Roles

La tabla `profiles` se crea automáticamente al registrarse un usuario. Por defecto el rol es `OPERATOR`.

Para convertir un usuario en administrador:

```sql
update public.profiles
set role = 'ADMIN'
where id = 'USER_UUID';
```

## Deploy en Vercel

1. Importar el repo en Vercel.
2. Configurar las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Deployar.

No se usa service role key en la app.
