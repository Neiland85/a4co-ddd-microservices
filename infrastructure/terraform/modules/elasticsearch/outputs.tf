# Outputs para el módulo de Elasticsearch

output "elasticsearch_service_name" {
  description = "Nombre del servicio de Elasticsearch"
  value       = aws_ecs_service.elasticsearch.name
}

output "elasticsearch_service_arn" {
  description = "ARN del servicio de Elasticsearch"
  value       = aws_ecs_service.elasticsearch.id
}

output "elasticsearch_task_definition_arn" {
  description = "ARN de la definición de tarea de Elasticsearch"
  value       = aws_ecs_task_definition.elasticsearch.arn
}

output "elasticsearch_security_group_id" {
  description = "ID del security group de Elasticsearch"
  value       = aws_security_group.elasticsearch.id
}

output "elasticsearch_security_group_arn" {
  description = "ARN del security group de Elasticsearch"
  value       = aws_security_group.elasticsearch.arn
}

output "elasticsearch_log_group_name" {
  description = "Nombre del grupo de logs de CloudWatch"
  value       = aws_cloudwatch_log_group.elasticsearch.name
}

output "elasticsearch_log_group_arn" {
  description = "ARN del grupo de logs de CloudWatch"
  value       = aws_cloudwatch_log_group.elasticsearch.arn
}

output "elasticsearch_endpoint" {
  description = "Endpoint interno de Elasticsearch (para uso interno)"
  value       = "http://${aws_ecs_service.elasticsearch.name}.${var.environment}.internal:9200"
}

output "elasticsearch_transport_endpoint" {
  description = "Endpoint de transporte de Elasticsearch (para comunicación entre nodos)"
  value       = "http://${aws_ecs_service.elasticsearch.name}.${var.environment}.internal:9300"
}

output "elasticsearch_cluster_name" {
  description = "Nombre del cluster de Elasticsearch"
  value       = "${var.environment}-elasticsearch-cluster"
}

output "elasticsearch_node_name" {
  description = "Nombre del nodo de Elasticsearch"
  value       = "elasticsearch-node-1"
}

output "elasticsearch_health_check_url" {
  description = "URL para verificar el estado de salud de Elasticsearch"
  value       = "http://${aws_ecs_service.elasticsearch.name}.${var.environment}.internal:9200/_cluster/health"
}

output "elasticsearch_cloudwatch_alarms" {
  description = "ARNs de las alarmas de CloudWatch configuradas"
  value = {
    cpu_alarm    = var.enable_cloudwatch_alarms ? aws_cloudwatch_metric_alarm.elasticsearch_cpu[0].arn : null
    memory_alarm = var.enable_cloudwatch_alarms ? aws_cloudwatch_metric_alarm.elasticsearch_memory[0].arn : null
  }
}
