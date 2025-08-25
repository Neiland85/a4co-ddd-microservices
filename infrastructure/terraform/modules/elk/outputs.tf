# Outputs para el módulo principal de ELK Stack

# Outputs de Elasticsearch
output "elasticsearch_service_name" {
  description = "Nombre del servicio de Elasticsearch"
  value       = module.elasticsearch.elasticsearch_service_name
}

output "elasticsearch_endpoint" {
  description = "Endpoint interno de Elasticsearch"
  value       = module.elasticsearch.elasticsearch_endpoint
}

output "elasticsearch_security_group_id" {
  description = "ID del security group de Elasticsearch"
  value       = module.elasticsearch.elasticsearch_security_group_id
}

# Outputs de Logstash
output "logstash_service_name" {
  description = "Nombre del servicio de Logstash"
  value       = module.logstash.logstash_service_name
}

output "logstash_security_group_id" {
  description = "ID del security group de Logstash"
  value       = module.logstash.logstash_security_group_id
}

# Outputs de Kibana
output "kibana_service_name" {
  description = "Nombre del servicio de Kibana"
  value       = module.kibana.kibana_service_name
}

output "kibana_security_group_id" {
  description = "ID del security group de Kibana"
  value       = module.kibana.kibana_security_group_id
}

# Outputs del stack completo
output "elk_stack_security_group_id" {
  description = "ID del security group del stack ELK completo"
  value       = aws_security_group.elk_stack.id
}

output "elk_stack_security_group_arn" {
  description = "ARN del security group del stack ELK completo"
  value       = aws_security_group.elk_stack.arn
}

output "elk_stack_dashboard_name" {
  description = "Nombre del dashboard de CloudWatch del stack ELK"
  value       = var.enable_cloudwatch_dashboard ? aws_cloudwatch_dashboard.elk_stack[0].dashboard_name : null
}

# Outputs de configuración
output "elk_stack_configuration" {
  description = "Configuración completa del stack ELK"
  value = {
    environment = var.environment
    elasticsearch = {
      service_name = module.elasticsearch.elasticsearch_service_name
      endpoint     = module.elasticsearch.elasticsearch_endpoint
      cluster_name = module.elasticsearch.elasticsearch_cluster_name
      node_name    = module.elasticsearch.elasticsearch_node_name
    }
    logstash = {
      service_name = module.logstash.logstash_service_name
      ports        = [5044, 8080]
    }
    kibana = {
      service_name = module.kibana.kibana_service_name
      port         = 5601
    }
    security_groups = {
      elasticsearch = module.elasticsearch.elasticsearch_security_group_id
      logstash      = module.logstash.logstash_security_group_id
      kibana        = module.kibana.kibana_security_group_id
      stack         = aws_security_group.elk_stack.id
    }
  }
}

# Outputs de monitoreo
output "elk_stack_monitoring" {
  description = "Información de monitoreo del stack ELK"
  value = {
    cloudwatch_logs = {
      elasticsearch = module.elasticsearch.elasticsearch_log_group_name
      logstash      = module.logstash.logstash_log_group_name
      kibana        = module.kibana.kibana_log_group_name
    }
    cloudwatch_alarms = {
      elasticsearch = module.elasticsearch.elasticsearch_cloudwatch_alarms
      logstash      = module.logstash.logstash_cloudwatch_alarms
      kibana        = module.kibana.kibana_cloudwatch_alarms
    }
    dashboard = var.enable_cloudwatch_dashboard ? aws_cloudwatch_dashboard.elk_stack[0].dashboard_name : null
  }
}

# Outputs de conectividad
output "elk_stack_connectivity" {
  description = "Información de conectividad del stack ELK"
  value = {
    elasticsearch_health_check = module.elasticsearch.elasticsearch_health_check_url
    kibana_access = "http://${module.kibana.kibana_service_name}.${var.environment}.internal:5601"
    logstash_beats_input = "tcp://${module.logstash.logstash_service_name}.${var.environment}.internal:5044"
    logstash_http_input = "http://${module.logstash.logstash_service_name}.${var.environment}.internal:8080"
  }
}
