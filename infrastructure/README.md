# Infrastructure as Code - Terraform

Esta carpeta contiene la configuración de infraestructura como código (IaC) para el proyecto A4CO DDD Microservices.

## 📁 Estructura

```
infrastructure/
├── main.tf          # Configuración principal de Terraform
├── variables.tf     # Definición de variables
├── outputs.tf       # Outputs del módulo (si es necesario)
├── terraform.tfvars # Valores específicos de variables (no versionado)
└── README.md        # Esta documentación
```

## 🚀 Primeros Pasos

### 1. Instalar Terraform

```bash
# macOS con Homebrew
brew install terraform

# O descarga desde: https://www.terraform.io/downloads
terraform --version
```

### 2. Configurar Terraform Cloud

1. Ve a [Terraform Cloud](https://app.terraform.io)
2. Crea una organización llamada `a4co-ddd-microservices`
3. Crea un workspace llamado `a4co-production`
4. Configura las variables de entorno en el workspace

### 3. Autenticación

La autenticación se maneja automáticamente en GitHub Actions usando el token `TF_API_TOKEN`.

Para desarrollo local:

```bash
# Login a Terraform Cloud
terraform login

# O configura el token manualmente
export TF_TOKEN="tu-token-aqui"
```

### 4. Inicializar y Planificar

```bash
# Cambiar al directorio de infraestructura
cd infrastructure

# Inicializar Terraform
terraform init

# Ver el plan de cambios
terraform plan

# Aplicar los cambios (solo en desarrollo local)
terraform apply
```

## 🔧 Configuración

### Variables Requeridas

| Variable       | Descripción         | Default                  |
| -------------- | ------------------- | ------------------------ |
| `aws_region`   | Región de AWS       | `us-east-1`              |
| `environment`  | Entorno             | `production`             |
| `project_name` | Nombre del proyecto | `a4co-ddd-microservices` |

### Variables Opcionales

| Variable          | Descripción             | Default       |
| ----------------- | ----------------------- | ------------- |
| `vpc_cidr`        | CIDR del VPC            | `10.0.0.0/16` |
| `ecs_task_cpu`    | CPU para tareas ECS     | `512`         |
| `ecs_task_memory` | Memoria para tareas ECS | `1024`        |

## 🏗️ Recursos Creados

- **VPC**: Red privada para los servicios
- **ECS Cluster**: Cluster para ejecutar contenedores
- **ECR Repositories**: Registros para imágenes Docker
- **Security Groups**: Grupos de seguridad
- **IAM Roles**: Roles para servicios

## 🔒 Seguridad

- Todos los recursos incluyen tags apropiados
- CloudTrail habilitado para auditoría
- AWS Config para compliance
- Backups automáticos configurados

## 🚀 Despliegue

El despliegue se maneja automáticamente a través de GitHub Actions:

1. **Push a main**: Ejecuta `terraform plan`
2. **Commit con "[terraform apply]"**: Ejecuta `terraform apply`
3. **Terraform Cloud Agent**: Maneja despliegues avanzados

## 📊 Monitoreo

- CloudWatch para métricas y logs
- CloudTrail para auditoría
- AWS Config para compliance
- Alertas configuradas para recursos críticos

## 🔧 Troubleshooting

### Error: "terraform command not found"

```bash
# Instala Terraform
brew install terraform
```

### Error: "Authentication failed"

```bash
# Verifica tu token de Terraform Cloud
terraform login
```

### Error: "Workspace not found"

- Asegúrate de crear el workspace `a4co-production` en Terraform Cloud
- Verifica que el nombre de la organización sea correcto

## 📞 Soporte

Para problemas con la infraestructura:

1. Revisa los logs en Terraform Cloud
2. Verifica el estado de los recursos en AWS Console
3. Contacta al equipo de DevOps

## 🔄 Actualizaciones

Para actualizar la infraestructura:

1. Modifica los archivos `.tf`
2. Ejecuta `terraform plan` para ver cambios
3. Si todo se ve bien, ejecuta `terraform apply`
4. Confirma los cambios en Git

