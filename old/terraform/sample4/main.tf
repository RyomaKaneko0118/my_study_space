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
resource "aws_instance" "app_server" {
  ami = "ami-0b828c1c5ac3f13ee"
  instance_type = "t2.micro"
  tags = {
    Name = "Terraform0312"
    }
}
resource "aws_vpc" "docker_ubuntu" {
  cidr_block = "10.0.0.0/16"
  //  DNSサーバーによる名前解決を有効にする
  enable_dns_support = true
  //  パブリックDNSホスト名を自動的に割り当てる
  enable_dns_hostnames = true
  tags = {
    Name = "docker_ubuntu"
  }
}
resource "aws_subnet" "public" {
  cidr_block = "10.0.1.0/24"
  vpc_id = aws_vpc.docker_ubuntu.id
  //  このサブネットで起動したインスタンスに自動的に
  //  IPアドレスを割り当ててくれる
  map_public_ip_on_launch = true
  availability_zone = "ap-northeast-1a"
  tags = {
    Name = "docker_ubuntu_subnet_public_basic_1a"
    }
  }
