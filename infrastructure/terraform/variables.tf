# Variables de entorno y región
variable "aws_region" {
  description = "Región de AWS donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente de despliegue (dev, staging, production)"
  type        = string
  default     = "dev"
}

# Variables de VPC
variable "vpc_cidr" {
  description = "CIDR block para la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Zonas de disponibilidad a usar"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks para subnets privadas"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks para subnets públicas"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "enable_nat_gateway" {
  description = "Habilitar NAT Gateway para subnets privadas"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Usar un solo NAT Gateway para todas las AZs"
  type        = bool
  default     = true
}

# Variables de ECS Cluster
variable "cluster_name" {
  description = "Nombre del cluster ECS"
  type        = string
  default     = "a4co-cluster"
}

variable "enable_container_insights" {
  description = "Habilitar Container Insights para monitoreo"
  type        = bool
  default     = true
}

# Variables de Application Load Balancer
variable "alb_name" {
  description = "Nombre del Application Load Balancer"
  type        = string
  default     = "a4co-alb"
}

# Variables de Auth Service
variable "auth_service_desired_count" {
  description = "Número deseado de tareas para Auth Service"
  type        = number
  default     = 2
}

variable "auth_service_task_cpu" {
  description = "CPU units para tareas de Auth Service"
  type        = number
  default     = 512
}

variable "auth_service_task_memory" {
  description = "Memoria para tareas de Auth Service (MB)"
  type        = number
  default     = 1024
}

variable "auth_service_port" {
  description = "Puerto del contenedor Auth Service"
  type        = number
  default     = 3000
}

variable "auth_service_image_repository" {
  description = "URI del repositorio de imagen para Auth Service"
  type        = string
  default     = "123456789012.dkr.ecr.us-east-1.amazonaws.com/auth-service"
}

variable "auth_service_image_tag" {
  description = "Tag de la imagen para Auth Service"
  type        = string
  default     = "latest"
}

variable "auth_service_enable_autoscaling" {
  description = "Habilitar autoscaling para Auth Service"
  type        = bool
  default     = true
}

variable "auth_service_min_capacity" {
  description = "Capacidad mínima para Auth Service"
  type        = number
  default     = 2
}

variable "auth_service_max_capacity" {
  description = "Capacidad máxima para Auth Service"
  type        = number
  default     = 10
}

variable "auth_service_enable_blue_green" {
  description = "Habilitar despliegue blue/green para Auth Service"
  type        = bool
  default     = true
}

# Variables de Product Service
variable "product_service_desired_count" {
  description = "Número deseado de tareas para Product Service"
  type        = number
  default     = 2
}

variable "product_service_task_cpu" {
  description = "CPU units para tareas de Product Service"
  type        = number
  default     = 512
}

variable "product_service_task_memory" {
  description = "Memoria para tareas de Product Service (MB)"
  type        = number
  default     = 1024
}

variable "product_service_port" {
  description = "Puerto del contenedor Product Service"
  type        = number
  default     = 3001
}

variable "product_service_image_repository" {
  description = "URI del repositorio de imagen para Product Service"
  type        = string
  default     = "123456789012.dkr.ecr.us-east-1.amazonaws.com/product-service"
}

variable "product_service_image_tag" {
  description = "Tag de la imagen para Product Service"
  type        = string
  default     = "latest"
}

variable "product_service_enable_autoscaling" {
  description = "Habilitar autoscaling para Product Service"
  type        = bool
  default     = true
}

variable "product_service_min_capacity" {
  description = "Capacidad mínima para Product Service"
  type        = number
  default     = 2
}

variable "product_service_max_capacity" {
  description = "Capacidad máxima para Product Service"
  type        = number
  default     = 10
}

variable "product_service_enable_blue_green" {
  description = "Habilitar despliegue blue/green para Product Service"
  type        = bool
  default     = true
}

# Variables de RDS
variable "rds_instance_class" {
  description = "Clase de instancia RDS"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "Almacenamiento asignado para RDS (GB)"
  type        = number
  default     = 20
}

variable "rds_max_allocated_storage" {
  description = "Almacenamiento máximo asignado para RDS (GB)"
  type        = number
  default     = 100
}

variable "rds_database_name" {
  description = "Nombre de la base de datos"
  type        = string
  default     = "a4co_db"
}

variable "rds_master_username" {
  description = "Usuario master de la base de datos"
  type        = string
  default     = "admin"
}

variable "rds_master_password" {
  description = "Contraseña master de la base de datos"
  type        = string
  sensitive   = true
}

variable "rds_backup_retention_period" {
  description = "Período de retención de backups (días)"
  type        = number
  default     = 7
}

variable "rds_backup_window" {
  description = "Ventana de tiempo para backups (UTC)"
  type        = string
  default     = "03:00-04:00"
}

variable "rds_maintenance_window" {
  description = "Ventana de tiempo para mantenimiento (UTC)"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

variable "rds_kms_key_id" {
  description = "ID de la clave KMS para encriptar RDS"
  type        = string
  default     = null
}

variable "rds_ecs_security_group_id" {
  description = "ID del security group de ECS para RDS"
  type        = string
  default     = null
}

# Variables de Redis
variable "redis_node_type" {
  description = "Tipo de nodo para Redis"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Número de nodos de cache"
  type        = number
  default     = 1
}

variable "redis_port" {
  description = "Puerto de Redis"
  type        = number
  default     = 6379
}

# Variables de CloudWatch
variable "cloudwatch_log_retention_days" {
  description = "Días de retención de logs en CloudWatch"
  type        = number
  default     = 30
}

variable "cloudwatch_enable_alarms" {
  description = "Habilitar alarmas de CloudWatch"
  type        = bool
  default     = true
}
