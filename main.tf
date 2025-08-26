terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.67.0"  # Versión específica que sabemos que funciona
    }
  }
  required_version = ">= 1.13.0"

  # Backend local para desarrollo
  # Descomenta el backend S3 cuando tengas credenciales configuradas
  # backend "s3" {
  #   bucket         = "a4co-terraform-state"
  #   key            = "a4co-ddd-microservices/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   use_lockfile   = true
  # }
}

provider "aws" {
  region = "us-east-1"
  
  # Configuración para desarrollo local
  # Comenta estas líneas cuando uses credenciales reales
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  
  default_tags {
    tags = {
      Project     = "a4co-ddd-microservices"
      Environment = "development"
      ManagedBy   = "terraform"
      Owner       = "a4co-team"
    }
  }
}
