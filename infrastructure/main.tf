# Terraform Configuration for A4CO Microservices Infrastructure
# This file provides a basic structure for managing infrastructure as code

terraform {
  required_providers {
    # Add your cloud providers here
    # Example: AWS, Azure, GCP, etc.
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Terraform Cloud configuration
  cloud {
    organization = "a4co-ddd-microservices"
    workspaces {
      name = "a4co-production"
    }
  }
}

# Provider configurations
provider "aws" {
  region = var.aws_region

  # Authentication will be handled by Terraform Cloud
  # No need to specify access keys here
}

# Variables
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "a4co-ddd-microservices"
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ECS Cluster for microservices
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  tags = {
    Name        = "${var.project_name}-cluster"
    Environment = var.environment
    Project     = var.project_name
  }
}

# ECR Repositories for Docker images
resource "aws_ecr_repository" "services" {
  for_each = toset([
    "inventory-service",
    "auth-service",
    "order-service",
    "product-service",
    "web",
    "dashboard-web"
  ])

  name                 = "${var.project_name}/${each.key}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.project_name}-${each.key}"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "ecs_cluster_name" {
  description = "ECS Cluster Name"
  value       = aws_ecs_cluster.main.name
}

output "ecr_repository_urls" {
  description = "ECR Repository URLs"
  value = {
    for repo in aws_ecr_repository.services :
    repo.name => repo.repository_url
  }
}