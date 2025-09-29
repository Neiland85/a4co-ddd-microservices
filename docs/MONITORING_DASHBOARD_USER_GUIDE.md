# Guía de Usuario - A4CO Monitoring Dashboard

## 🎯 Inicio Rápido

### Acceso al Dashboard
1. **Iniciar el Servidor**
   ```bash
   cd scripts
   node simple-monitoring-server.js
   ```

2. **Abrir en el Navegador**
   - Navega a: `http://localhost:3003`
   - El dashboard se carga automáticamente con los datos actuales

3. **Verificación Inicial**
   - Confirma que las métricas se muestran correctamente
   - Verifica que el auto-refresh funciona (cada 30 segundos)

---

## 📊 Panel Principal

### Métricas Clave
El dashboard muestra las siguientes métricas principales:

- **🎯 Adopción de Features**: Porcentaje de usuarios que han adoptado las nuevas funcionalidades
- **⚠️ Tasa de Error**: Porcentaje de errores en el sistema
- **😊 Satisfacción del Usuario**: Puntuación promedio de satisfacción (escala 1-5)
- **⚡ Performance**: Tiempo de respuesta promedio del sistema

### Estados de Servicios
Indicadores visuales del estado de servicios críticos:

- **🟢 Operational**: Servicio funcionando correctamente (>99% uptime)
- **🟡 Degraded**: Servicio con problemas menores (95-99% uptime)
- **🔴 Down**: Servicio no disponible (<95% uptime)

### Alertas Activas
Lista de alertas actuales con niveles de severidad:

- **ℹ️ Info**: Información general, no requiere acción inmediata
- **⚠️ Warning**: Requiere atención, posible impacto en usuarios
- **🚨 Critical**: Requiere acción inmediata, impacto significativo

---

## 📈 Métricas Detalladas

### Acceso a Métricas Detalladas
1. Haz clic en **"Ver Métricas Detalladas"** desde el panel principal
2. O navega directamente a: `http://localhost:3003/metrics`

### Secciones Disponibles

#### Phase 1 - Internal Beta
- **Configuración del Rollout**: Usuarios objetivo y features desplegadas
- **Métricas Diarias**: Evolución día a día durante los 3 días de prueba
- **Resultados Finales**: KPIs alcanzados y recomendaciones

#### Phase 2 - External Beta (25%)
- **Estado Actual**: Progreso del rollout externo
- **Métricas en Tiempo Real**: Datos actualizados automáticamente
- **Alertas y Problemas**: Issues detectados y acciones tomadas

#### Comparación de Fases
- **Métricas Paralelas**: Phase 1 vs Phase 2
- **Tendencias**: Evolución de métricas clave
- **Insights**: Patrones identificados y recomendaciones

---

## 🚨 Gestión de Alertas

### Tipos de Alertas

#### Alertas Automáticas
- **Tasa de Error > 2%**: Impacto crítico en experiencia de usuario
- **Adopción < 70%**: Posible problema de aceptación
- **Performance > 2000ms**: Degradación de rendimiento
- **Satisfacción < 4.0**: Problemas de usabilidad

#### Alertas Manuales
- **Mantenimiento Programado**: Notificación de downtime planeado
- **Actualizaciones de Features**: Nuevas funcionalidades disponibles
- **Cambios de Configuración**: Modificaciones en el sistema

### Respuesta a Alertas

#### Para Alertas Críticas
1. **Evaluar Impacto**: Determinar alcance del problema
2. **Activar Protocolo**: Notificar al equipo de respuesta
3. **Implementar Solución**: Aplicar fix o rollback según sea necesario
4. **Comunicar**: Informar a usuarios afectados

#### Para Alertas de Warning
1. **Monitorear**: Seguir evolución de la métrica
2. **Investigar**: Identificar causa raíz
3. **Planificar**: Definir acciones correctivas
4. **Documentar**: Registrar hallazgos para futuro

---

## 📱 Uso en Dispositivos Móviles

### Características Responsive
- **Adaptación Automática**: El dashboard se ajusta al tamaño de pantalla
- **Navegación Táctil**: Optimizado para interacción táctil
- **Lectura Fluida**: Texto y gráficos legibles en pantallas pequeñas

### Limitaciones Móviles
- **Gráficos Complejos**: Algunos diagramas pueden requerir zoom
- **Navegación Profunda**: Múltiples clics para acceder a secciones detalladas
- **Actualizaciones**: Auto-refresh puede consumir más batería

### Recomendaciones
- Usa WiFi para mejor rendimiento
- Cierra otras aplicaciones para optimizar batería
- Considera acceso desktop para análisis detallados

---

## 🔧 Solución de Problemas

### Dashboard No Carga

#### Síntomas
- Página en blanco o error de conexión
- Mensaje "ERR_CONNECTION_REFUSED"

#### Soluciones
1. **Verificar Servidor**
   ```bash
   # Verificar que el proceso esté ejecutándose
   ps aux | grep simple-monitoring-server.js
   ```

2. **Reiniciar Servidor**
   ```bash
   # Detener proceso existente
   pkill -f simple-monitoring-server.js

   # Reiniciar servidor
   cd scripts
   node simple-monitoring-server.js
   ```

3. **Verificar Puerto**
   ```bash
   # Verificar que el puerto 3003 esté disponible
   lsof -i :3003
   ```

### Datos No Se Actualizan

#### Síntomas
- Métricas permanecen estáticas
- Auto-refresh no funciona

#### Soluciones
1. **Forzar Refresh Manual**
   - Presiona `F5` o `Ctrl+R`
   - Limpia cache del navegador

2. **Verificar Archivos de Datos**
   ```bash
   # Verificar que los archivos JSON existan y sean válidos
   ls -la data/*.json
   cat data/phase1-metrics.json | jq .  # Si tienes jq instalado
   ```

3. **Revisar Logs del Servidor**
   ```bash
   # Ver logs en tiempo real
   tail -f logs/server.log
   ```

### Errores de Conexión

#### Síntomas
- "Failed to fetch" en consola del navegador
- Datos no se cargan

#### Soluciones
1. **Verificar CORS**
   - Asegúrate de que el servidor permite conexiones locales
   - Revisa configuración de CORS en el código del servidor

2. **Firewall/Antivirus**
   - Desactiva temporalmente firewall
   - Verifica que no bloquee conexiones locales

3. **Configuración de Red**
   - Verifica configuración de proxy
   - Intenta con diferentes navegadores

---

## 📋 Glosario de Términos

### Métricas Principales

- **Adopción de Features**: Porcentaje de usuarios que utilizan las nuevas funcionalidades
- **Tasa de Error**: Porcentaje de operaciones que resultan en error
- **Satisfacción del Usuario**: Puntuación promedio de experiencia de usuario (1-5)
- **Performance**: Tiempo promedio de respuesta del sistema en milisegundos

### Estados del Sistema

- **Operational**: Funcionando correctamente, uptime >99%
- **Degraded**: Con problemas menores, uptime 95-99%
- **Down**: No disponible, uptime <95%

### Tipos de Rollout

- **Phase 1 - Internal Beta**: Prueba interna con 100% del equipo
- **Phase 2 - External Beta**: Rollout externo al 25% de usuarios
- **Phase 3 - Full Release**: Lanzamiento completo a todos los usuarios

### Niveles de Severidad

- **Info**: Información general, no requiere acción
- **Warning**: Requiere atención, posible impacto
- **Critical**: Requiere acción inmediata, impacto significativo

---

## 📞 Soporte y Contacto

### Canales de Soporte

#### Para Problemas Técnicos
- **Email**: devops@a4co.com
- **Slack**: #monitoring-support
- **Issues**: GitHub repository issues

#### Para Preguntas de Negocio
- **Email**: product@a4co.com
- **Slack**: #product-team

### Información de Contacto

- **Equipo de Desarrollo**: dev-team@a4co.com
- **Soporte 24/7**: support@a4co.com
- **Documentación**: docs.a4co.com/monitoring

### Horarios de Soporte

- **Desarrollo**: Lunes a Viernes, 9:00 - 18:00 CET
- **Soporte Técnico**: 24/7 para issues críticos
- **Soporte General**: Lunes a Viernes, 8:00 - 20:00 CET

---

## 🔄 Actualizaciones y Mantenimiento

### Actualizaciones del Dashboard

#### Versiones
- **v1.0.0**: Versión inicial con funcionalidades básicas
- **v1.1.0**: Agregado soporte móvil y alertas avanzadas
- **v1.2.0**: Integración con herramientas externas

#### Proceso de Actualización
1. **Backup de Configuración**
   ```bash
   cp config/dashboard-config.json config/dashboard-config.json.backup
   ```

2. **Actualizar Código**
   ```bash
   git pull origin main
   npm install
   ```

3. **Migrar Configuración**
   - Comparar archivos de configuración
   - Aplicar cambios necesarios
   - Probar funcionalidad

4. **Reiniciar Servicios**
   ```bash
   npm restart
   ```

### Mantenimiento Programado

#### Tareas Diarias
- [ ] Verificar estado de servicios
- [ ] Revisar logs por errores
- [ ] Actualizar datos de métricas

#### Tareas Semanales
- [ ] Backup de configuración y datos
- [ ] Actualizar dependencias
- [ ] Revisar configuración de alertas

#### Tareas Mensuales
- [ ] Auditoría de seguridad
- [ ] Optimización de performance
- [ ] Revisión de documentación

---

*Guía de Usuario - A4CO Monitoring Dashboard v1.0*</content>
<parameter name="filePath">/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices/docs/MONITORING_DASHBOARD_USER_GUIDE.md