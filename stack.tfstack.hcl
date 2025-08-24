# Terraform Stack Configuration for A4CO DDD Microservices
# This configuration defines the overall stack architecture

required_providers {
  aws = {
    source  = "hashicorp/aws"
    version = "~> 5.0"
  }
  random = {
    source  = "hashicorp/random"
    version = "~> 3.0"
  }
}

# Define the component that contains our infrastructure
component "infrastructure" {
  source = "./components/infrastructure"
  
  inputs = {
    environment = var.environment
    project_name = var.project_name
    aws_region = var.aws_region
  }
}

# Stack-level variables
variable "environment" {
  type        = string
  description = "Environment name (development, staging, production)"
  default     = "development"
}

variable "project_name" {
  type        = string
  description = "Project name for resource naming"
  default     = "a4co-ddd-microservices"
}

variable "aws_region" {
  type        = string
  description = "AWS region for resources"
  default     = "us-east-1"
}

# Stack outputs
output "bucket_name" {
  type  = string
  value = component.infrastructure.bucket_name
}

output "bucket_arn" {
  type  = string
  value = component.infrastructure.bucket_arn
}
