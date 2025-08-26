terraform {
  required_version = ">= 1.5.0"

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

  # Configuración para Terraform Cloud
  cloud {
    organization = "NeilandAPiS"
    workspaces {
      name = "a4co-ddd-microservices-workspace"
    }
  }
}
