# Configuración NGINX para Producción

Este archivo contiene la configuración del reverse proxy NGINX para el sistema multi-aplicación en producción.

## Estructura

- **Frontend (Vite)**: Disponible en `/` → `frontend-prod:80`
- **Dashboard (Next.js 16)**: Disponible en `/dashboard` → `dashboard-prod:3001`

## Características

### 1. Proxy para Frontend Vite (`/`)
- Proxy a `frontend-prod:80`
- Soporte para WebSocket (HMR de Vite)
- Headers de seguridad configurados
- Compresión Gzip habilitada

### 2. Proxy para Dashboard Next.js (`/dashboard`)
- Proxy a `dashboard-prod:3001`
- Rewrite para remover el prefijo `/dashboard` antes de enviar a Next.js
- Soporte para WebSocket (HMR de Next.js)
- Headers necesarios para Next.js configurados

### 3. Assets Estáticos de Next.js (`/_next/static/*`)
- Proxy directo a `dashboard-prod:3001`
- Cache de 1 año para assets estáticos
- Headers de cache correctos

## Validación

Para validar la sintaxis de NGINX:

```bash
# Opción 1: Usar el script de validación
./infra/docker/validate-nginx.sh

# Opción 2: Validar manualmente con Docker
docker run --rm \
  -v "$(pwd)/infra/docker/nginx.prod.conf:/etc/nginx/nginx.conf:ro" \
  nginx:alpine \
  nginx -t
```

## Uso en Docker Compose

Para usar esta configuración en un servicio NGINX de Docker:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./infra/docker/nginx.prod.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - frontend-prod
    - dashboard-prod
  networks:
    - a4co-network
```

## Notas Importantes

1. **Orden de los location blocks**: Los blocks más específicos deben ir antes de los genéricos
2. **Assets de Next.js**: El block `/_next/static/` debe estar antes de `/dashboard/` para que funcione correctamente
3. **Rewrite con break**: El rewrite en `/dashboard/` remueve el prefijo antes de proxear a Next.js
4. **Redirect**: `/dashboard` (sin trailing slash) redirige a `/dashboard/`

## Pruebas

Después de implementar, verificar:

1. ✅ `http://localhost/` → Frontend Vite funciona
2. ✅ `http://localhost/dashboard` → Dashboard Next.js funciona (redirige a `/dashboard/`)
3. ✅ `http://localhost/dashboard/` → Dashboard Next.js renderiza correctamente
4. ✅ `http://localhost/_next/static/...` → Assets estáticos se cargan correctamente
5. ✅ CSS y JS del dashboard se cargan sin 404s

## Troubleshooting

### Problema: 404 en assets de Next.js
- Verificar que el block `/_next/static/` esté antes de `/dashboard/`
- Verificar que Next.js esté configurado correctamente (puede necesitar `basePath` en `next.config.js`)

### Problema: Dashboard no carga CSS/JS
- Verificar que los headers `X-Forwarded-*` estén configurados
- Verificar que Next.js esté escuchando en el puerto 3001
- Verificar que el contenedor `dashboard-prod` esté corriendo

### Problema: Frontend no carga
- Verificar que `frontend-prod` esté escuchando en el puerto 80
- Verificar que el contenedor `frontend-prod` esté corriendo
