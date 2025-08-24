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
    organization = "a4co-org"

    workspaces {
      name = "a4co-ddd-microservices-workspace"
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

    terraform-cloud-fix
# S3 bucket resource for testing
# Example resource - replace with your actual infrastructure
    main
resource "aws_s3_bucket" "example" {
  bucket = "a4co-ddd-microservices-${random_id.bucket_suffix.hex}"
  
  tags = {
    Name = "A4CO DDD Microservices Bucket"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
     terraform-cloud-fix
}

# Outputs
output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.example.bucket
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.example.arn

     main
}
