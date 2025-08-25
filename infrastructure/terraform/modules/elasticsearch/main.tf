# Módulo de Elasticsearch para el stack ELK
# Este módulo despliega un cluster de Elasticsearch en ECS

# Security Group para Elasticsearch
resource "aws_security_group" "elasticsearch" {
  name_prefix = "${var.environment}-elasticsearch-sg"
  vpc_id      = var.vpc_id

  # Permitir tráfico HTTP desde Logstash y Kibana
  ingress {
    from_port       = 9200
    to_port         = 9200
    protocol        = "tcp"
    security_groups = [var.logstash_security_group_id, var.kibana_security_group_id]
    description     = "HTTP desde Logstash y Kibana"
  }

  # Permitir tráfico de transporte entre nodos
  ingress {
    from_port       = 9300
    to_port         = 9300
    protocol        = "tcp"
    self            = true
    description     = "Transport entre nodos Elasticsearch"
  }

  # Permitir tráfico desde bastion host si existe
  dynamic "ingress" {
    for_each = var.bastion_security_group_id != null ? [1] : []
    content {
      from_port       = 9200
      to_port         = 9200
      protocol        = "tcp"
      security_groups = [var.bastion_security_group_id]
      description     = "HTTP desde bastion host"
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(var.tags, {
    Name = "${var.environment}-elasticsearch-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Task Definition para Elasticsearch
resource "aws_ecs_task_definition" "elasticsearch" {
  family                   = "${var.environment}-elasticsearch"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name  = "elasticsearch"
      image = "${var.elasticsearch_image}:${var.elasticsearch_version}"

      portMappings = [
        {
          containerPort = 9200
          protocol      = "tcp"
        },
        {
          containerPort = 9300
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "cluster.name"
          value = "${var.environment}-elasticsearch-cluster"
        },
        {
          name  = "node.name"
          value = "elasticsearch-node-1"
        },
        {
          name  = "discovery.type"
          value = "single-node"
        },
        {
          name  = "bootstrap.memory_lock"
          value = "true"
        },
        {
          name  = "ES_JAVA_OPTS"
          value = "-Xms${var.heap_size}m -Xmx${var.heap_size}m"
        },
        {
          name  = "xpack.security.enabled"
          value = "false"
        },
        {
          name  = "xpack.monitoring.enabled"
          value = "true"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.elasticsearch.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "elasticsearch"
        }
      }

      mountPoints = []
      volumes     = []
    }
  ])

  tags = var.tags
}

# Service de ECS para Elasticsearch
resource "aws_ecs_service" "elasticsearch" {
  name            = "${var.environment}-elasticsearch"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.elasticsearch.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.elasticsearch.id]
    assign_public_ip = false
  }

  depends_on = [aws_ecs_task_definition.elasticsearch]

  tags = var.tags
}

# CloudWatch Log Group para Elasticsearch
resource "aws_cloudwatch_log_group" "elasticsearch" {
  name              = "/ecs/${var.environment}-elasticsearch"
  retention_in_days = var.log_retention_days

  tags = var.tags
}

# CloudWatch Alarms para Elasticsearch
resource "aws_cloudwatch_metric_alarm" "elasticsearch_cpu" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-elasticsearch-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "CPU utilization for Elasticsearch service"
  alarm_actions       = var.alarm_actions

  dimensions = {
    ServiceName = aws_ecs_service.elasticsearch.name
    ClusterName = var.cluster_id
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "elasticsearch_memory" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-elasticsearch-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Memory utilization for Elasticsearch service"
  alarm_actions       = var.alarm_actions

  dimensions = {
    ServiceName = aws_ecs_service.elasticsearch.name
    ClusterName = var.cluster_id
  }

  tags = var.tags
}

# Data source para la región actual
data "aws_region" "current" {}
