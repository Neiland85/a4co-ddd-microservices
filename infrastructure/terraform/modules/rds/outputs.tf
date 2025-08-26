# Outputs del módulo RDS PostgreSQL

# Información de la instancia de base de datos
output "db_instance_id" {
  description = "ID de la instancia RDS"
  value       = aws_db_instance.order_service_db.id
}

output "db_instance_endpoint" {
  description = "Endpoint de conexión a la base de datos"
  value       = aws_db_instance.order_service_db.endpoint
}

output "db_instance_port" {
  description = "Puerto de la base de datos"
  value       = aws_db_instance.order_service_db.port
}

output "db_instance_arn" {
  description = "ARN de la instancia RDS"
  value       = aws_db_instance.order_service_db.arn
}

# Información del grupo de subnets
output "db_subnet_group_id" {
  description = "ID del grupo de subnets de la base de datos"
  value       = aws_db_subnet_group.order_service_db.id
}

output "db_subnet_group_name" {
  description = "Nombre del grupo de subnets de la base de datos"
  value       = aws_db_subnet_group.order_service_db.name
}

# Información del security group
output "db_security_group_id" {
  description = "ID del security group de la base de datos"
  value       = aws_security_group.order_service_db.id
}

output "db_security_group_name" {
  description = "Nombre del security group de la base de datos"
  value       = aws_security_group.order_service_db.name
}

# Información del secret
output "db_secret_id" {
  description = "ID del secret en AWS Secrets Manager"
  value       = aws_secretsmanager_secret.order_service_db.id
}

output "db_secret_arn" {
  description = "ARN del secret en AWS Secrets Manager"
  value       = aws_secretsmanager_secret.order_service_db.arn
}

# Información del grupo de parámetros
output "db_parameter_group_id" {
  description = "ID del grupo de parámetros de la base de datos"
  value       = aws_db_parameter_group.order_service_db.id
}

output "db_parameter_group_name" {
  description = "Nombre del grupo de parámetros de la base de datos"
  value       = aws_db_parameter_group.order_service_db.name
}

# Información del grupo de opciones
output "db_option_group_id" {
  description = "ID del grupo de opciones de la base de datos"
  value       = aws_db_option_group.order_service_db.id
}

output "db_option_group_name" {
  description = "Nombre del grupo de opciones de la base de datos"
  value       = aws_db_option_group.order_service_db.name
}

# Información de las alarmas de CloudWatch
output "cloudwatch_alarm_ids" {
  description = "IDs de las alarmas de CloudWatch creadas"
  value       = var.enable_cloudwatch_alarms ? [
    aws_cloudwatch_metric_alarm.order_service_db_cpu[0].id,
    aws_cloudwatch_metric_alarm.order_service_db_connections[0].id,
    aws_cloudwatch_metric_alarm.order_service_db_free_storage[0].id
  ] : []
}

# URL de conexión (sin contraseña por seguridad)
output "connection_string_template" {
  description = "Template de la cadena de conexión (reemplazar PASSWORD)"
  value       = "postgresql://${var.database_username}:PASSWORD@${aws_db_instance.order_service_db.endpoint}:${aws_db_instance.order_service_db.port}/${var.database_name}?sslmode=require"
  sensitive   = false
}
