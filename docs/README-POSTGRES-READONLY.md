# PostgreSQL Read-Only User Configuration

## 1) Formato exacto de la URL de conexión

```
postgres://<usuario>:<contraseña>@<host>:<puerto>/<basedatos>?sslmode=require
```

## 2) URL lista para usar con el usuario readonly creado

```
postgres://readonly_user:X9v%247kP%23b2Q%21r8Zt@localhost:5432/a4co_db?sslmode=require
```

### Desglose de la URL:

- **Usuario**: readonly_user
- **Contraseña**: X9v$7kP#b2Q!r8Zt (URL-encoded: X9v%247kP%23b2Q%21r8Zt)
- **Host**: localhost (cambiar por tu host real)
- **Puerto**: 5432
- **Base de datos**: a4co_db
- **SSL Mode**: require (fuerza TLS)

## 3) Ejemplos para diferentes entornos

### Desarrollo local:

```
postgres://readonly_user:X9v%247kP%23b2Q%21r8Zt@localhost:5432/a4co_db?sslmode=require
```

### AWS RDS:

```
postgres://readonly_user:X9v%247kP%23b2Q%21r8Zt@a4co-db-prod.eu-west-1.rds.amazonaws.com:5432/a4co_db?sslmode=require
```

### Con IPv6:

```
postgres://readonly_user:X9v%247kP%23b2Q%21r8Zt@[2001:0db8:85a3::8a2e:0370:7334]:5432/a4co_db?sslmode=require
```

### Con verificación SSL completa (si tienes CA):

```
postgres://readonly_user:X9v%247kP%23b2Q%21r8Zt@db.example.com:5432/a4co_db?sslmode=verify-full&sslrootcert=/path/to/ca.pem
```

## 4) Cómo probar la conexión

### Con psql:

```bash
PGSSLMODE=require psql "postgres://readonly_user:X9v\$7kP#b2Q!r8Zt@localhost:5432/a4co_db" -c "SELECT now();"
```

### Con Node.js (para verificar):

```javascript
const { Client } = require('pg');
const client = new Client({
  connectionString:
    'postgres://readonly_user:X9v%247kP%23b2Q%21r8Zt@localhost:5432/a4co_db?sslmode=require',
});
await client.connect();
const result = await client.query('SELECT count(*) FROM products LIMIT 1');
console.log('Conexión exitosa:', result.rows);
```

## 5) Comandos para ejecutar el script SQL

### Si PostgreSQL está corriendo en Docker:

```bash
# Ejecutar el script
docker exec -i a4co-postgres psql -U postgres -d postgres < scripts/create-readonly-user.sql
```

### Si PostgreSQL está corriendo localmente:

```bash
# Ejecutar el script
psql -U postgres -h localhost -d postgres < scripts/create-readonly-user.sql
```

### Manualmente en psql:

```bash
psql -U postgres -h localhost -d postgres
\i scripts/create-readonly-user.sql
```

## 6) Verificación de permisos

Después de crear el usuario, verifica los permisos:

```sql
-- Conectar como readonly_user
psql "postgres://readonly_user:X9v\$7kP#b2Q!r8Zt@localhost:5432/a4co_db"

-- Verificar permisos
SELECT schemaname, tablename, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'readonly_user';

-- Probar una consulta de solo lectura
SELECT count(*) FROM products;
```

## 7) Recomendaciones de seguridad

- ✅ Usa `sslmode=require` para forzar TLS
- ✅ El usuario tiene solo permisos SELECT
- ✅ No tiene permisos CREATE/INSERT/UPDATE/DELETE
- ✅ Configura `ALTER DEFAULT PRIVILEGES` para tablas futuras
- ✅ Limita el acceso por IP en producción
- ✅ Rota la contraseña periódicamente
- ✅ Monitorea consultas inusuales

## 8) Variables de entorno recomendadas

Para usar en aplicaciones:

```bash
# En .env
DATABASE_READONLY_URL="postgres://readonly_user:X9v%247kP%23b2Q%21r8Zt@localhost:5432/a4co_db?sslmode=require"

# En GitHub Secrets (producción)
POSTGRES_READONLY_URL="postgres://readonly_user:X9v%247kP%23b2Q%21r8Zt@db-prod.example.com:5432/a4co_db?sslmode=require"
```
