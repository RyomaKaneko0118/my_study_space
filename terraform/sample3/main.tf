terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      }
    }
  }

provider "aws" {
  profile = "default"
  region  = "ap-northeast-1"
}
# 64 ビット (Arm)
resource "aws_instance" "app_server" {
  ami = "ami-0b828c1c5ac3f13ee"
  instance_type = "t2.micro"
  tags = {
    Name = "Terraform0312"
    }
}


