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
  ami = "ami-0fa715233bba2f42e"
  instance_type = "c6g.medium"
  tags = {
    Name = "ExampleAppServerInstance"
    }
}


