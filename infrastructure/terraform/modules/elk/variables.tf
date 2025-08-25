# Variables para el módulo principal de ELK Stack

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
  description = "ID de la VPC donde se desplegará el stack ELK"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs de las subnets privadas para los servicios"
  type        = list(string)
}

variable "allowed_source_cidrs" {
  description = "CIDRs permitidos para acceder al stack ELK"
  type        = list(string)
  default     = ["10.0.0.0/16", "0.0.0.0/0"]
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

# Variables de Elasticsearch
variable "elasticsearch_desired_count" {
  description = "Número deseado de tareas de Elasticsearch"
  type        = number
  default     = 1
}

variable "elasticsearch_task_cpu" {
  description = "CPU units para tareas de Elasticsearch"
  type        = number
  default     = 1024
}

variable "elasticsearch_task_memory" {
  description = "Memoria para tareas de Elasticsearch (MB)"
  type        = number
  default     = 2048
}

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

variable "elasticsearch_heap_size" {
  description = "Tamaño del heap de Java para Elasticsearch (MB)"
  type        = number
  default     = 1024
}

# Variables de Logstash
variable "logstash_desired_count" {
  description = "Número deseado de tareas de Logstash"
  type        = number
  default     = 1
}

variable "logstash_task_cpu" {
  description = "CPU units para tareas de Logstash"
  type        = number
  default     = 512
}

variable "logstash_task_memory" {
  description = "Memoria para tareas de Logstash (MB)"
  type        = number
  default     = 1024
}

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

variable "logstash_heap_size" {
  description = "Tamaño del heap de Java para Logstash (MB)"
  type        = number
  default     = 512
}

# Variables de Kibana
variable "kibana_desired_count" {
  description = "Número deseado de tareas de Kibana"
  type        = number
  default     = 1
}

variable "kibana_task_cpu" {
  description = "CPU units para tareas de Kibana"
  type        = number
  default     = 512
}

variable "kibana_task_memory" {
  description = "Memoria para tareas de Kibana (MB)"
  type        = number
  default     = 1024
}

variable "kibana_image" {
  description = "Imagen de Docker para Kibana"
  type        = string
  default     = "docker.elastic.co/kibana/kibana"
}

variable "kibana_version" {
  description = "Versión de Kibana"
  type        = string
  default     = "8.11.0"
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

variable "enable_cloudwatch_dashboard" {
  description = "Habilitar dashboard de CloudWatch"
  type        = bool
  default     = true
}

variable "alarm_actions" {
  description = "ARNs de las acciones de alarma (SNS topics, etc.)"
  type        = list(string)
  default     = []
}
