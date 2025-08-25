# Variables para el módulo de Logstash

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
  description = "ID de la VPC donde se desplegará Logstash"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs de las subnets privadas para el servicio"
  type        = list(string)
}

variable "allowed_source_cidrs" {
  description = "CIDRs permitidos para enviar logs a Logstash"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "elasticsearch_security_group_id" {
  description = "ID del security group de Elasticsearch"
  type        = string
}

# Variables de ECS
variable "cluster_id" {
  description = "ID del cluster ECS"
  type        = string
}

variable "execution_role_arn" {
  description = "ARN del rol de ejecución de ECS"
  type        = string
}

variable "task_role_arn" {
  description = "ARN del rol de tarea de ECS"
  type        = string
}

# Variables de configuración del servicio
variable "desired_count" {
  description = "Número deseado de tareas"
  type        = number
  default     = 1
}

variable "task_cpu" {
  description = "CPU units para la tarea"
  type        = number
  default     = 512
}

variable "task_memory" {
  description = "Memoria para la tarea (MB)"
  type        = number
  default     = 1024
}

# Variables de Logstash
variable "logstash_image" {
  description = "Imagen de Docker para Logstash"
  type        = string
  default     = "docker.elastic.co/logstash/logstash"
}

variable "logstash_version" {
  description = "Versión de Logstash"
  type        = string
  default     = "8.11.0"
}

variable "heap_size" {
  description = "Tamaño del heap de Java para Logstash (MB)"
  type        = number
  default     = 512
}

# Variables de CloudWatch
variable "log_retention_days" {
  description = "Días de retención de logs en CloudWatch"
  type        = number
  default     = 30
}

variable "enable_cloudwatch_alarms" {
  description = "Habilitar alarmas de CloudWatch"
  type        = bool
  default     = true
}

variable "alarm_actions" {
  description = "ARNs de las acciones de alarma (SNS topics, etc.)"
  type        = list(string)
  default     = []
}
