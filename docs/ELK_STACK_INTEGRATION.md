# Integración del Stack ELK (Elasticsearch, Logstash, Kibana)

## 🎯 Descripción General

Este documento describe la integración del stack ELK (Elasticsearch, Logstash, Kibana) en el proyecto A4CO DDD Microservices. El stack ELK proporciona capacidades completas de logging, búsqueda y visualización de datos.

## 🏗️ Arquitectura del Stack ELK

### Componentes Principales

1. **Elasticsearch**: Motor de búsqueda y almacenamiento distribuido
2. **Logstash**: Procesamiento y enriquecimiento de logs
3. **Kibana**: Interfaz de visualización y análisis de datos
4. **Filebeat**: Agente de recolección de logs (opcional)

### Flujo de Datos

```
[Servicios de Aplicación] → [Logstash] → [Elasticsearch] → [Kibana]
                                    ↓
                              [CloudWatch Logs]
```

## 🚀 Despliegue

### Opción 1: Despliegue Local con Docker Compose

```bash
# Iniciar el stack ELK completo
docker-compose -f docker-compose.elk.yml up -d

# Verificar el estado de los servicios
docker-compose -f docker-compose.elk.yml ps

# Ver logs de un servicio específico
docker-compose -f docker-compose.elk.yml logs elasticsearch
```

### Opción 2: Despliegue en AWS con Terraform

```bash
# Navegar al directorio de Terraform
cd infrastructure/terraform

# Inicializar Terraform
terraform init

# Planificar el despliegue
terraform plan

# Aplicar la configuración
terraform apply
```

## 📊 Configuración de Servicios

### Elasticsearch

- **Puerto**: 9200 (HTTP), 9300 (Transport)
- **Memoria**: 1GB heap por defecto
- **Configuración**: Single-node para desarrollo, multi-node para producción
- **Seguridad**: X-Pack deshabilitado en desarrollo

### Logstash

- **Puerto**: 5044 (Beats), 8080 (HTTP)
- **Memoria**: 512MB heap por defecto
- **Inputs**: Filebeat, HTTP, TCP
- **Outputs**: Elasticsearch

### Kibana

- **Puerto**: 5601
- **Configuración**: Conecta automáticamente a Elasticsearch
- **Dashboards**: Pre-configurados para monitoreo de microservicios

## 🔧 Configuración de Microservicios

### Integración con Logstash

Los microservicios pueden enviar logs a Logstash de dos formas:

#### 1. HTTP Input (Recomendado)

```typescript
// Ejemplo de envío de logs a Logstash
const logToLogstash = async (level: string, message: string, metadata: any) => {
  try {
    await fetch('http://logstash:8080/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        service: 'auth-service',
        ...metadata
      })
    });
  } catch (error) {
    console.error('Error sending log to Logstash:', error);
  }
};
```

#### 2. Filebeat Input

```yaml
# filebeat.yml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/app/*.log
  fields:
    service: auth-service
    environment: development

output.logstash:
  hosts: ["logstash:5044"]
```

### Configuración de Winston para Node.js

```typescript
import winston from 'winston';

const logstashTransport = new winston.transports.Http({
  host: process.env.LOGSTASH_HOST || 'localhost',
  port: process.env.LOGSTASH_PORT || 8080,
  path: '/log',
  format: winston.format.json()
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    logstashTransport
  ]
});
```

## 📈 Monitoreo y Alertas

### CloudWatch Integration

- **Log Groups**: Automáticamente creados para cada servicio
- **Métricas**: CPU, memoria, logs por minuto
- **Dashboards**: Pre-configurados para el stack ELK
- **Alertas**: Configurables para umbrales de recursos

### Métricas Disponibles

- **Elasticsearch**: Índices, documentos, consultas por segundo
- **Logstash**: Eventos procesados, latencia de pipeline
- **Kibana**: Usuarios activos, consultas por minuto

## 🔒 Seguridad

### Network Security

- **Security Groups**: Configurados para permitir solo tráfico necesario
- **Subnets Privadas**: Todos los servicios en subnets privadas
- **VPC**: Aislado del internet público

### Access Control

- **IAM Roles**: Roles específicos para cada servicio
- **KMS**: Encriptación de datos en reposo
- **CloudTrail**: Auditoría de acceso a recursos

## 🧪 Testing y Desarrollo

### Scripts de Prueba

```bash
# Verificar salud de Elasticsearch
curl -X GET "localhost:9200/_cluster/health?pretty"

# Verificar estado de Logstash
curl -X GET "localhost:8080"

# Verificar estado de Kibana
curl -X GET "localhost:5601/api/status"
```

### Datos de Prueba

```bash
# Crear índice de prueba
curl -X PUT "localhost:9200/test-index"

# Insertar documento de prueba
curl -X POST "localhost:9200/test-index/_doc" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test log entry", "timestamp": "2024-01-01T00:00:00Z"}'

# Buscar documentos
curl -X GET "localhost:9200/test-index/_search?q=message:test"
```

## 📚 Dashboards de Kibana

### Dashboards Pre-configurados

1. **Microservices Overview**: Vista general de todos los servicios
2. **Error Analysis**: Análisis de errores y excepciones
3. **Performance Metrics**: Métricas de rendimiento y latencia
4. **User Activity**: Actividad de usuarios y autenticación
5. **System Health**: Estado de salud del sistema

### Creación de Dashboards Personalizados

```json
{
  "title": "Custom Microservice Dashboard",
  "panels": [
    {
      "type": "visualization",
      "title": "Request Count by Service",
      "visState": {
        "type": "histogram",
        "params": {
          "field": "service.name",
          "interval": "1h"
        }
      }
    }
  ]
}
```

## 🚨 Troubleshooting

### Problemas Comunes

#### Elasticsearch no inicia

```bash
# Verificar logs
docker-compose -f docker-compose.elk.yml logs elasticsearch

# Verificar recursos del sistema
docker stats a4co-elasticsearch

# Verificar permisos de volumen
ls -la elk/elasticsearch/data/
```

#### Logstash no procesa logs

```bash
# Verificar conectividad con Elasticsearch
curl -X GET "elasticsearch:9200/_cluster/health"

# Verificar configuración de pipeline
docker exec a4co-logstash cat /usr/share/logstash/pipeline/logstash.conf

# Verificar logs de Logstash
docker-compose -f docker-compose.elk.yml logs logstash
```

#### Kibana no se conecta a Elasticsearch

```bash
# Verificar variables de entorno
docker exec a4co-kibana env | grep ELASTICSEARCH

# Verificar conectividad de red
docker exec a4co-kibana ping elasticsearch

# Verificar logs de Kibana
docker-compose -f docker-compose.elk.yml logs kibana
```

## 🔄 Mantenimiento

### Backup y Restore

```bash
# Crear snapshot de Elasticsearch
curl -X PUT "localhost:9200/_snapshot/backup_repo/snapshot_1"

# Restaurar snapshot
curl -X POST "localhost:9200/_snapshot/backup_repo/snapshot_1/_restore"
```

### Actualizaciones

```bash
# Actualizar versión de Elasticsearch
docker-compose -f docker-compose.elk.yml pull elasticsearch
docker-compose -f docker-compose.elk.yml up -d elasticsearch

# Verificar compatibilidad antes de actualizar
curl -X GET "localhost:9200/_cat/indices?v"
```

## 📋 Checklist de Implementación

- [ ] Desplegar stack ELK con Docker Compose
- [ ] Configurar microservicios para enviar logs a Logstash
- [ ] Verificar conectividad entre componentes
- [ ] Configurar dashboards de Kibana
- [ ] Implementar alertas de CloudWatch
- [ ] Configurar backup y retención de logs
- [ ] Documentar procedimientos de mantenimiento
- [ ] Realizar pruebas de carga y recuperación

## 🔗 Enlaces Útiles

- [Documentación oficial de Elasticsearch](https://www.elastic.co/guide/index.html)
- [Guía de Logstash](https://www.elastic.co/guide/en/logstash/current/index.html)
- [Manual de Kibana](https://www.elastic.co/guide/en/kibana/current/index.html)
- [Filebeat Reference](https://www.elastic.co/guide/en/beats/filebeat/current/index.html)
- [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación del stack ELK:

1. Revisar logs de los servicios
2. Consultar la documentación oficial
3. Verificar configuración de red y seguridad
4. Contactar al equipo de DevOps

---

**Nota**: Este stack ELK está configurado para desarrollo y staging. Para producción, considerar configuraciones adicionales de seguridad, escalabilidad y monitoreo.
