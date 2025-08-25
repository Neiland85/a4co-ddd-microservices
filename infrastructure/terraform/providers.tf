# Configuración de proveedores para Terraform
# Este archivo centraliza la configuración de todos los proveedores

terraform {
  required_version = ">= 1.0, < 2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0, < 7.0"
    }
  }

  # Configuración del backend S3 (comentado para desarrollo local)
  # backend "s3" {
  #   bucket         = "a4co-terraform-state"
  #   key            = "infrastructure/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "a4co-terraform-locks"
  # }
}

# Configuración del proveedor AWS
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "a4co-ddd-microservices"
      Environment = var.environment
      ManagedBy   = "terraform"
      Owner       = "devops-team"
      CostCenter  = "engineering"
    }
  }

  # Configuración de retry para evitar timeouts
  max_retries = 3
}
