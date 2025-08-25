terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.0.0"
<<<<<<< HEAD

  backend "remote" {
    organization = "a4co-org"

    workspaces {
      name = "a4co-ddd-microservices"
    }
  }
=======
>>>>>>> b4c99a77661d4447a77fd27419f07bd269f8693d
}

provider "aws" {
  region = "us-east-1"
}
<<<<<<< HEAD

resource "aws_instance" "example" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"

  depends_on = [aws_vpc.example]

  tags = {
    Name = "ExampleInstance"
  }
}
=======
>>>>>>> b4c99a77661d4447a77fd27419f07bd269f8693d
