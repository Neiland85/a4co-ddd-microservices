# Variables para el módulo de Elasticsearch

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
  description = "ID de la VPC donde se desplegará Elasticsearch"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs de las subnets privadas para el servicio"
  type        = list(string)
}

variable "logstash_security_group_id" {
  description = "ID del security group de Logstash"
  type        = string
}

variable "kibana_security_group_id" {
  description = "ID del security group de Kibana"
  type        = string
}

variable "bastion_security_group_id" {
  description = "ID del security group del bastion host (opcional)"
  type        = string
  default     = null
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
  default     = 1024
}

variable "task_memory" {
  description = "Memoria para la tarea (MB)"
  type        = number
  default     = 2048
}

# Variables de Elasticsearch
variable "elasticsearch_image" {
  description = "Imagen de Docker para Elasticsearch"
  type        = string
  default     = "docker.elastic.co/elasticsearch/elasticsearch"
}

variable "elasticsearch_version" {
  description = "Versión de Elasticsearch"
  type        = string
  default     = "8.11.0"
}

variable "heap_size" {
  description = "Tamaño del heap de Java para Elasticsearch (MB)"
  type        = number
  default     = 1024
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
