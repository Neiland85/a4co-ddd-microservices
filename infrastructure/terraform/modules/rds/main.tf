# Módulo RDS PostgreSQL para order-service
resource "aws_db_subnet_group" "order_service_db" {
  name       = "${var.environment}-order-service-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = merge(var.tags, {
    Name = "${var.environment}-order-service-db-subnet-group"
  })
}

resource "aws_security_group" "order_service_db" {
  name_prefix = "${var.environment}-order-service-db-sg"
  vpc_id      = var.vpc_id

  # Permitir tráfico desde ECS en subnets privadas
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.ecs_security_group_id]
    description     = "PostgreSQL desde ECS"
  }

  # Permitir tráfico desde bastion host si existe
  dynamic "ingress" {
    for_each = var.bastion_security_group_id != null ? [1] : []
    content {
      from_port       = 5432
      to_port         = 5432
      protocol        = "tcp"
      security_groups = [var.bastion_security_group_id]
      description     = "PostgreSQL desde bastion host"
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
    Name = "${var.environment}-order-service-db-sg"
  })

  lifecycle {
    create_before_destroy = true
  }
}

# Crear secret en AWS Secrets Manager
resource "aws_secretsmanager_secret" "order_service_db" {
  name        = "${var.environment}/order-service/database"
  description = "Credenciales de base de datos para order-service"
  kms_key_id  = var.kms_key_id

  tags = merge(var.tags, {
    Name = "${var.environment}-order-service-db-secret"
  })
}

resource "aws_secretsmanager_secret_version" "order_service_db" {
  secret_id = aws_secretsmanager_secret.order_service_db.id
  
  secret_string = jsonencode({
    username = var.database_username
    password = var.database_password
    host     = "PLACEHOLDER_HOST"
    port     = 5432
    database = var.database_name
    ssl_mode = "require"
    
    # URL de conexión completa para aplicaciones
    connection_string = "postgresql://${var.database_username}:${var.database_password}@PLACEHOLDER_HOST:5432/${var.database_name}?sslmode=require"
    
    # Variables de entorno para Docker
    environment_variables = {
      DB_HOST     = "PLACEHOLDER_HOST"
      DB_PORT     = 5432
      DB_NAME     = var.database_name
      DB_USER     = var.database_username
      DB_PASSWORD = var.database_password
      DB_SSL_MODE = "require"
    }
  })
}

# Instancia RDS PostgreSQL
resource "aws_db_instance" "order_service_db" {
  identifier = "${var.environment}-order-service-db"

  # Configuración del motor
  engine         = "postgres"
  engine_version = var.engine_version
  instance_class = var.instance_class

  # Configuración de almacenamiento
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id           = var.kms_key_id

  # Configuración de la base de datos
  db_name  = var.database_name
  username = var.database_username
  password = var.database_password
  port     = 5432

  # Configuración de red
  vpc_security_group_ids = [aws_security_group.order_service_db.id]
  db_subnet_group_name   = aws_db_subnet_group.order_service_db.name
  publicly_accessible    = false
  multi_az               = var.environment == "production"

  # Configuración de backup
  backup_retention_period = var.backup_retention_period
  backup_window          = var.backup_window
  maintenance_window     = var.maintenance_window
  copy_tags_to_snapshot = true

  # Configuración de monitoreo
  monitoring_interval = 60
  monitoring_role_arn = var.monitoring_role_arn

  # Configuración de logs
  enabled_cloudwatch_logs_exports = ["postgresql"]

  # Configuración de parámetros
  parameter_group_name = aws_db_parameter_group.order_service_db.name

  # Configuración de opciones
  option_group_name = aws_db_option_group.order_service_db.name

  # Configuración de seguridad
  deletion_protection = var.environment == "production"
  skip_final_snapshot = var.environment != "production"

  tags = merge(var.tags, {
    Name = "${var.environment}-order-service-db"
  })

  depends_on = [
    aws_secretsmanager_secret_version.order_service_db
  ]
}

# Actualizar el secreto con la información real de la base de datos
resource "aws_secretsmanager_secret_version" "order_service_db_updated" {
  secret_id = aws_secretsmanager_secret.order_service_db.id
  
  secret_string = jsonencode({
    username = var.database_username
    password = var.database_password
    host     = aws_db_instance.order_service_db.endpoint
    port     = aws_db_instance.order_service_db.port
    database = var.database_name
    ssl_mode = "require"
    
    # URL de conexión completa para aplicaciones
    connection_string = "postgresql://${var.database_username}:${var.database_password}@${aws_db_instance.order_service_db.endpoint}:${aws_db_instance.order_service_db.port}/${var.database_name}?sslmode=require"
    
    # Variables de entorno para Docker
    environment_variables = {
      DB_HOST     = aws_db_instance.order_service_db.endpoint
      DB_PORT     = aws_db_instance.order_service_db.port
      DB_NAME     = var.database_name
      DB_USER     = var.database_username
      DB_PASSWORD = var.database_password
      DB_SSL_MODE = "require"
    }
  })

  depends_on = [aws_db_instance.order_service_db]
}

# Grupo de parámetros personalizado
resource "aws_db_parameter_group" "order_service_db" {
  name   = "${var.environment}-order-service-db-params"
  family = "postgres${var.engine_version_major}"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }

  parameter {
    name  = "pg_stat_statements.track"
    value = "all"
  }

  tags = merge(var.tags, {
    Name = "${var.environment}-order-service-db-params"
  })
}

# Grupo de opciones
resource "aws_db_option_group" "order_service_db" {
  name                     = "${var.environment}-order-service-db-options"
  engine_name              = "postgres"
  major_engine_version     = var.engine_version_major

  tags = merge(var.tags, {
    Name = "${var.environment}-order-service-db-options"
  })
}

# CloudWatch Alarms para monitoreo
resource "aws_cloudwatch_metric_alarm" "order_service_db_cpu" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-order-service-db-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "CPU utilization for order-service database"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.order_service_db.id
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "order_service_db_connections" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-order-service-db-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Database connections for order-service database"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.order_service_db.id
  }

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "order_service_db_free_storage" {
  count               = var.enable_cloudwatch_alarms ? 1 : 0
  alarm_name          = "${var.environment}-order-service-db-free-storage"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "1000000000" # 1GB en bytes
  alarm_description   = "Free storage space for order-service database"
  alarm_actions       = var.alarm_actions

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.order_service_db.id
  }

  tags = var.tags
}
