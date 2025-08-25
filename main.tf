terraform {
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
  required_version = ">= 1.5.0"

  cloud {
    organization = "NeilandAPiS"

    workspaces {
      name = "a4co-ddd-microservices"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  
  default_tags {
    tags = {
      Environment = "development"
      Project     = "a4co-ddd-microservices"
      ManagedBy   = "terraform"
    }
  }
}

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
