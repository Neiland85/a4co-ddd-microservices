terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
        fix/terraform-rds-variables-missing
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
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.5.0"

  cloud {
    organization = "NeilandAPiS"

    workspaces {
      name = "a4co-ddd-microservices"
    }
  }
  develop
}

provider "aws" {
  region = "us-east-1"
  
  fix/terraform-rds-variables-missing
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
  default_tags {
    tags = {
      Environment = "development"
      Project     = "a4co-ddd-microservices"
      ManagedBy   = "terraform"
    }
  }
}
     develop

# Example resource - replace with your actual infrastructure
resource "aws_s3_bucket" "example" {
  bucket = "a4co-ddd-microservices-${random_id.bucket_suffix.hex}"
  
  tags = {
    Name = "A4CO DDD Microservices Bucket"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}
     main
     develop
