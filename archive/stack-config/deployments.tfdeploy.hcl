# Deployment configuration for development environment
deployment "development" {
  inputs = {
    environment  = "development"
    project_name = "a4co-ddd-microservices"
    aws_region   = "us-east-1"
  }
}
