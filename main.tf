terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0.0"

  backend "remote" {
    organization = "a4co-org"

    workspaces {
      name = "a4co-ddd-microservices"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "example" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"

  depends_on = [aws_vpc.example]

  tags = {
    Name = "ExampleInstance"
  }
}
