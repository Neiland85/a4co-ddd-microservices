# Módulo principal de ELK Stack
# Este módulo orquesta Elasticsearch, Logstash y Kibana

# Módulo de Elasticsearch
module "elasticsearch" {
  source = "../elasticsearch"

  environment     = var.environment
  vpc_id          = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  
  # Configuración de ECS
  cluster_id      = var.cluster_id
  execution_role_arn = var.execution_role_arn
  task_role_arn   = var.task_role_arn
  
  # Configuración del servicio
  desired_count   = var.elasticsearch_desired_count
  task_cpu        = var.elasticsearch_task_cpu
  task_memory     = var.elasticsearch_task_memory
  
  # Configuración de Elasticsearch
  elasticsearch_image = var.elasticsearch_image
  elasticsearch_version = var.elasticsearch_version
  heap_size        = var.elasticsearch_heap_size
  
  # Configuración de CloudWatch
  log_retention_days = var.log_retention_days
  enable_cloudwatch_alarms = var.enable_cloudwatch_alarms
  alarm_actions    = var.alarm_actions
  
  # Security Groups (se configurarán después de crear los módulos)
  logstash_security_group_id = module.logstash.logstash_security_group_id
  kibana_security_group_id = module.kibana.kibana_security_group_id
  bastion_security_group_id = var.bastion_security_group_id
  
  tags = var.tags
}

# Módulo de Logstash
module "logstash" {
  source = "../logstash"

  environment     = var.environment
  vpc_id          = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  
  # Configuración de ECS
  cluster_id      = var.cluster_id
  execution_role_arn = var.execution_role_arn
  task_role_arn   = var.task_role_arn
  
  # Configuración del servicio
  desired_count   = var.logstash_desired_count
  task_cpu        = var.logstash_task_cpu
  task_memory     = var.logstash_task_memory
  
  # Configuración de Logstash
  logstash_image = var.logstash_image
  logstash_version = var.logstash_version
  heap_size      = var.logstash_heap_size
  
  # Configuración de red
  allowed_source_cidrs = var.allowed_source_cidrs
  elasticsearch_security_group_id = module.elasticsearch.elasticsearch_security_group_id
  
  # Configuración de CloudWatch
  log_retention_days = var.log_retention_days
  enable_cloudwatch_alarms = var.enable_cloudwatch_alarms
  alarm_actions    = var.alarm_actions
  
  tags = var.tags
}

# Módulo de Kibana
module "kibana" {
  source = "../kibana"

  environment     = var.environment
  vpc_id          = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  
  # Configuración de ECS
  cluster_id      = var.cluster_id
  execution_role_arn = var.execution_role_arn
  task_role_arn   = var.task_role_arn
  
  # Configuración del servicio
  desired_count   = var.kibana_desired_count
  task_cpu        = var.kibana_task_cpu
  task_memory     = var.kibana_task_memory
  
  # Configuración de Kibana
  kibana_image   = var.kibana_image
  kibana_version = var.kibana_version
  
  # Configuración de red
  allowed_source_cidrs = var.allowed_source_cidrs
  elasticsearch_security_group_id = module.elasticsearch.elasticsearch_security_group_id
  elasticsearch_endpoint = module.elasticsearch.elasticsearch_endpoint
  
  # Configuración de CloudWatch
  log_retention_days = var.log_retention_days
  enable_cloudwatch_alarms = var.enable_cloudwatch_alarms
  alarm_actions    = var.alarm_actions
  
  tags = var.tags
}

# Security Group para el stack ELK completo
resource "aws_security_group" "elk_stack" {
  name_prefix = "${var.environment}-elk-stack-sg"
  vpc_id      = var.vpc_id

  # Permitir tráfico HTTP desde fuentes autorizadas
  ingress {
    from_port       = 5601
    to_port         = 5601
    protocol        = "tcp"
    cidr_blocks     = var.allowed_source_cidrs
    description     = "Kibana desde fuentes autorizadas"
  }

  # Permitir tráfico de logs desde servicios de aplicación
  ingress {
    from_port       = 5044
    to_port         = 5044
    protocol        = "tcp"
    cidr_blocks     = var.allowed_source_cidrs
    description     = "Logstash Beats input desde servicios"
  }

  # Permitir tráfico HTTP desde servicios de aplicación
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    cidr_blocks     = var.allowed_source_cidrs
    description     = "Logstash HTTP input desde servicios"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(var.tags, {
    Name = "${var.environment}-elk-stack-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# CloudWatch Dashboard para el stack ELK
resource "aws_cloudwatch_dashboard" "elk_stack" {
  count          = var.enable_cloudwatch_dashboard ? 1 : 0
  dashboard_name = "${var.environment}-elk-stack-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", module.elasticsearch.elasticsearch_service_name, "ClusterName", var.cluster_id],
            [".", "CPUUtilization", ".", module.logstash.logstash_service_name, ".", "."],
            [".", "CPUUtilization", ".", module.kibana.kibana_service_name, ".", "."]
          ]
          period = 300
          stat   = "Average"
          region = data.aws_region.current.name
          title  = "ELK Stack CPU Utilization"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "MemoryUtilization", "ServiceName", module.elasticsearch.elasticsearch_service_name, "ClusterName", var.cluster_id],
            [".", "MemoryUtilization", ".", module.logstash.logstash_service_name, ".", "."],
            [".", "MemoryUtilization", ".", module.kibana.kibana_service_name, ".", "."]
          ]
          period = 300
          stat   = "Average"
          region = data.aws_region.current.name
          title  = "ELK Stack Memory Utilization"
        }
      }
    ]
  })

  tags = var.tags
}

# Data source para la región actual
data "aws_region" "current" {}
