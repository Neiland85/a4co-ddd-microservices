# Configuración principal de Terraform
# Los proveedores están configurados en providers.tf

# Variables locales para configuración
locals {
  # IDs temporales para desarrollo (en producción se usarían valores reales)
  vpc_id = "vpc-temp-dev"
  private_subnets = ["subnet-temp-1", "subnet-temp-2"]
  kms_key_id = "kms-temp-dev"
  ecs_security_group_id = "sg-temp-dev"
}

# Módulo de RDS (PostgreSQL)
module "rds" {
  source = "./modules/rds"

  environment     = var.environment
  vpc_id          = local.vpc_id
  private_subnet_ids = local.private_subnets
  
  # Configuración de la base de datos
  instance_class      = var.rds_instance_class
  allocated_storage   = var.rds_allocated_storage
  max_allocated_storage = var.rds_max_allocated_storage
  
  # Configuración de seguridad
  database_name     = var.rds_database_name
  database_username = var.rds_master_username
  database_password = var.rds_master_password
  
  # Configuración de backup
  backup_retention_period = var.rds_backup_retention_period
  backup_window          = var.rds_backup_window
  maintenance_window     = var.rds_maintenance_window
  
  # Configuración adicional requerida
  kms_key_id = local.kms_key_id
  ecs_security_group_id = local.ecs_security_group_id
  
  tags = local.common_tags
}

# Nota: Los módulos Redis, CloudWatch e IAM están comentados
# hasta que se implementen los módulos correspondientes

# Locals para tags comunes
locals {
  common_tags = {
    Project     = "a4co-ddd-microservices"
    Environment = var.environment
    ManagedBy   = "terraform"
    Owner       = "devops-team"
    CostCenter  = "engineering"
  }
}
