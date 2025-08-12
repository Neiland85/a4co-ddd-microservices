terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0.0"

  backend "remote" {
    organization = "a4co-devops-org"

    workspaces {
      name = "a4co-ddd-microservices"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}
