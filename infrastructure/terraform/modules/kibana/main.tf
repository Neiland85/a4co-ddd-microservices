# Módulo de Kibana para el stack ELK
# Este módulo despliega Kibana en ECS para visualización de logs

# Security Group para Kibana
resource "aws_security_group" "kibana" {
  name_prefix = "${var.environment}-kibana-sg"
  vpc_id      = var.vpc_id

  # Permitir tráfico HTTP desde ALB o servicios externos
  ingress {
    from_port       = 5601
    to_port         = 5601
    protocol        = "tcp"
    cidr_blocks     = var.allowed_source_cidrs
    description     = "HTTP desde fuentes autorizadas"
  }

  # Permitir tráfico hacia Elasticsearch
  egress {
    from_port       = 9200
    to_port         = 9200
    protocol        = "tcp"
    security_groups = [var.elasticsearch_security_group_id]
    description     = "HTTP hacia Elasticsearch"
  }

  # Permitir tráfico general saliente
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(var.tags, {
    Name = "${var.environment}-kibana-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Task Definition para Kibana
resource "aws_ecs_task_definition" "kibana" {
  family                   = "${var.environment}-kibana"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name  = "kibana"
      image = "${var.kibana_image}:${var.kibana_version}"

      portMappings = [
        {
          containerPort = 5601
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "ELASTICSEARCH_HOSTS"
          value = var.elasticsearch_endpoint
        },
        {
          name  = "SERVER_NAME"
          value = "kibana.${var.environment}.local"
        },
        {
          name  = "SERVER_HOST"
          value = "0.0.0.0"
        },
        {
          name  = "SERVER_PORT"
          value = "5601"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.kibana.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "kibana"
        }
      }

      mountPoints = []
      volumes     = []
    }
  ])

  tags = var.tags
}

# Service de ECS para Kibana
resource "aws_ecs_service" "kibana" {
  name            = "${var.environment}-kibana"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.kibana.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.kibana.id]
    assign_public_ip = false
  }

  depends_on = [aws_ecs_task_definition.kibana]

  tags = var.tags
}

# CloudWatch Log Group para Kibana
resource "aws_cloudwatch_log_group" "kibana" {
  name              = "/ecs/${var.environment}-kibana"
  retention_in_days = var.log_retention_days

  tags = var.tags
}

# CloudWatch Alarms para Kibana
resource "aws_cloudwatch_metric_alarm" "kibana_cpu" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-kibana-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "CPU utilization for Kibana service"
  alarm_actions       = var.alarm_actions

  dimensions = {
    ServiceName = aws_ecs_service.kibana.name
    ClusterName = var.cluster_id
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "kibana_memory" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-kibana-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Memory utilization for Kibana service"
  alarm_actions       = var.alarm_actions

  dimensions = {
    ServiceName = aws_ecs_service.kibana.name
    ClusterName = var.cluster_id
  }

  tags = var.tags
}

# Data source para la región actual
data "aws_region" "current" {}
