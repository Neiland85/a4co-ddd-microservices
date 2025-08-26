# Configuración del proveedor AWS
# Nota: Para Terraform Cloud, usar terraform-cloud.tf
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "a4co-ddd-microservices"
      Environment = var.environment
      ManagedBy   = "terraform"
      Owner       = "devops-team"
    }
  }
}

# Módulo de VPC
module "vpc" {
  source = "./modules/vpc"

  environment     = var.environment
  vpc_cidr        = var.vpc_cidr
  azs             = var.availability_zones
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = var.single_nat_gateway
  enable_vpn_gateway = var.enable_vpn_gateway

  tags = local.common_tags
}

# Módulo de ECS Cluster
module "ecs_cluster" {
  source = "./modules/ecs-cluster"

  environment     = var.environment
  cluster_name    = var.cluster_name
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets

  enable_container_insights = var.enable_container_insights
  enable_execute_command    = var.enable_execute_command

  tags = local.common_tags
}

# Módulo de Application Load Balancer
module "alb" {
  source = "./modules/alb"

  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  public_subnets  = module.vpc.public_subnets
  private_subnets = module.vpc.private_subnets

  alb_name                   = var.alb_name
  enable_deletion_protection = var.environment == "production"

  tags = local.common_tags
}

# Módulo de Auth Service
module "auth_service" {
  source = "./modules/ecs-service"

  environment     = var.environment
  service_name    = "auth-service"
  cluster_id      = module.ecs_cluster.cluster_id
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets

  # Configuración del servicio
  desired_count  = var.auth_service_desired_count
  task_cpu       = var.auth_service_task_cpu
  task_memory    = var.auth_service_task_memory
  container_port = var.auth_service_port

  # Configuración de la imagen
  image_repository = var.auth_service_image_repository
  image_tag        = var.auth_service_image_tag

  # Configuración del ALB
  target_group_arn = module.alb.target_group_arns["auth-service"]
  listener_arn     = module.alb.listener_arn

  # Configuración de autoscaling
  enable_autoscaling = var.auth_service_enable_autoscaling
  min_capacity       = var.auth_service_min_capacity
  max_capacity       = var.auth_service_max_capacity

  # Configuración de blue/green
  enable_blue_green = var.auth_service_enable_blue_green
  blue_green_config = var.auth_service_blue_green_config

  tags = local.common_tags
}

# Módulo de Product Service
module "product_service" {
  source = "./modules/ecs-service"

  environment     = var.environment
  service_name    = "product-service"
  cluster_id      = module.ecs_cluster.cluster_id
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets

  # Configuración del servicio
  desired_count  = var.product_service_desired_count
  task_cpu       = var.product_service_task_cpu
  task_memory    = var.product_service_task_memory
  container_port = var.product_service_port

  # Configuración de la imagen
  image_repository = var.product_service_image_repository
  image_tag        = var.product_service_image_tag

  # Configuración del ALB
  target_group_arn = module.alb.target_group_arns["product-service"]
  listener_arn     = module.alb.listener_arn

  # Configuración de autoscaling
  enable_autoscaling = var.product_service_enable_autoscaling
  min_capacity       = var.product_service_min_capacity
  max_capacity       = var.product_service_max_capacity

  # Configuración de blue/green
  enable_blue_green = var.product_service_enable_blue_green
  blue_green_config = var.product_service_blue_green_config

  tags = local.common_tags
}

# Módulo de RDS (PostgreSQL)
module "rds" {
  source = "./modules/rds"

  environment = var.environment
  vpc_id      = module.vpc.vpc_id

  # Configuración de la base de datos
  instance_class        = var.rds_instance_class
  allocated_storage     = var.rds_allocated_storage
  max_allocated_storage = var.rds_max_allocated_storage

  # Configuración de seguridad
  database_name         = var.rds_database_name
  database_username     = var.rds_database_username
  database_password     = var.rds_database_password
  ecs_security_group_id = module.ecs_cluster.security_group_id
  private_subnet_ids    = module.vpc.private_subnets

  # Configuración del motor
  engine_version = var.rds_engine_version

  # Configuración de backup
  backup_retention_period = var.rds_backup_retention_period

  # Configuración de KMS
  kms_key_id = var.rds_kms_key_id

  tags = local.common_tags
}

# Módulo de Redis (ElastiCache)
module "redis" {
  source = "./modules/redis"

  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets

  # Configuración del cluster
  node_type            = var.redis_node_type
  num_cache_nodes      = var.redis_num_cache_nodes
  parameter_group_name = var.redis_parameter_group_name

  # Configuración de seguridad
  port = var.redis_port

  tags = local.common_tags
}

# Módulo de CloudWatch
module "cloudwatch" {
  source = "./modules/cloudwatch"

  environment = var.environment

  # Configuración de logs
  log_retention_days = var.cloudwatch_log_retention_days

  # Configuración de alarmas
  enable_alarms = var.cloudwatch_enable_alarms

  tags = local.common_tags
}

# Módulo de IAM
module "iam" {
  source = "./modules/iam"

  environment = var.environment

  # Configuración de roles
  enable_ecs_task_execution_role = true
  enable_ecs_task_role           = true

  tags = local.common_tags
}

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
