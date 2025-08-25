# Módulo de Logstash para el stack ELK
# Este módulo despliega Logstash en ECS para procesar logs

# Security Group para Logstash
resource "aws_security_group" "logstash" {
  name_prefix = "${var.environment}-logstash-sg"
  vpc_id      = var.vpc_id

  # Permitir tráfico HTTP desde servicios de aplicación
  ingress {
    from_port       = 5044
    to_port         = 5044
    protocol        = "tcp"
    cidr_blocks     = var.allowed_source_cidrs
    description     = "Beats input desde servicios de aplicación"
  }

  # Permitir tráfico HTTP desde servicios de aplicación
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    cidr_blocks     = var.allowed_source_cidrs
    description     = "HTTP input desde servicios de aplicación"
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
    Name = "${var.environment}-logstash-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Task Definition para Logstash
resource "aws_ecs_task_definition" "logstash" {
  family                   = "${var.environment}-logstash"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name  = "logstash"
      image = "${var.logstash_image}:${var.logstash_version}"

      portMappings = [
        {
          containerPort = 5044
          protocol      = "tcp"
        },
        {
          containerPort = 8080
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "LS_JAVA_OPTS"
          value = "-Xms${var.heap_size}m -Xmx${var.heap_size}m"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.logstash.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "logstash"
        }
      }

      mountPoints = []
      volumes     = []
    }
  ])

  tags = var.tags
}

# Service de ECS para Logstash
resource "aws_ecs_service" "logstash" {
  name            = "${var.environment}-logstash"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.logstash.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.logstash.id]
    assign_public_ip = false
  }

  depends_on = [aws_ecs_task_definition.logstash]

  tags = var.tags
}

# CloudWatch Log Group para Logstash
resource "aws_cloudwatch_log_group" "logstash" {
  name              = "/ecs/${var.environment}-logstash"
  retention_in_days = var.log_retention_days

  tags = var.tags
}

# CloudWatch Alarms para Logstash
resource "aws_cloudwatch_metric_alarm" "logstash_cpu" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-logstash-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "CPU utilization for Logstash service"
  alarm_actions       = var.alarm_actions

  dimensions = {
    ServiceName = aws_ecs_service.logstash.name
    ClusterName = var.cluster_id
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "logstash_memory" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-logstash-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Memory utilization for Logstash service"
  alarm_actions       = var.alarm_actions

  dimensions = {
    ServiceName = aws_ecs_service.logstash.name
    ClusterName = var.cluster_id
  }

  tags = var.tags
}

# Data source para la región actual
data "aws_region" "current" {}
