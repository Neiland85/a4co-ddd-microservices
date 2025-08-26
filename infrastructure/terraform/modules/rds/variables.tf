# Variables para el módulo RDS PostgreSQL

# Variables de entorno y configuración general
variable "environment" {
  description = "Entorno de despliegue (dev, staging, production)"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Tags comunes para todos los recursos"
  type        = map(string)
  default     = {}
}

# Variables de red
variable "vpc_id" {
  description = "ID de la VPC donde se desplegará la base de datos"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs de las subnets privadas para el grupo de subnets de RDS"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "ID del security group de ECS para permitir conexiones a la base de datos"
  type        = string
}

variable "bastion_security_group_id" {
  description = "ID del security group del bastion host (opcional)"
  type        = string
  default     = null
}

# Variables de KMS y encriptación
variable "kms_key_id" {
  description = "ID de la clave KMS para encriptar la base de datos y secretos"
  type        = string
}

# Variables de la base de datos
variable "database_name" {
  description = "Nombre de la base de datos a crear"
  type        = string
  default     = "order_service"
}

variable "database_username" {
  description = "Nombre de usuario para la base de datos"
  type        = string
  default     = "postgres"
}

variable "database_password" {
  description = "Contraseña para la base de datos"
  type        = string
  sensitive   = true
}

# Variables del motor de base de datos
variable "engine_version" {
  description = "Versión completa del motor PostgreSQL"
  type        = string
  default     = "15.4"
}

variable "engine_version_major" {
  description = "Versión mayor del motor PostgreSQL (para family)"
  type        = string
  default     = "15"
}

variable "instance_class" {
  description = "Clase de instancia RDS"
  type        = string
  default     = "db.t3.micro"
}

# Variables de almacenamiento
variable "allocated_storage" {
  description = "Almacenamiento inicial asignado en GB"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Almacenamiento máximo asignado en GB"
  type        = number
  default     = 100
}

# Variables de backup y mantenimiento
variable "backup_retention_period" {
  description = "Período de retención de backups en días"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Ventana de tiempo para backups (UTC)"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Ventana de tiempo para mantenimiento (UTC)"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

# Variables de monitoreo
variable "monitoring_role_arn" {
  description = "ARN del rol IAM para monitoreo de RDS"
  type        = string
  default     = null
}

# Variables de CloudWatch
variable "enable_cloudwatch_alarms" {
  description = "Habilitar alarmas de CloudWatch para la base de datos"
  type        = bool
  default     = true
}

variable "alarm_actions" {
  description = "ARNs de las acciones de alarma (SNS topics, etc.)"
  type        = list(string)
  default     = []
}
