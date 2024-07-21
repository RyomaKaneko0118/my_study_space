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

# amiとインスタンスタイプの設定
resource "aws_instance" "app_server" {
  ami = "ami-0b828c1c5ac3f13ee"
  instance_type = "t2.micro"
  subnet_id = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.docker_ubuntu.id]
  tags = {
    Name = "Terraform0312"
    }
}

# vpcの設定
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

# サブネットの作成
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

# インターネットゲートウェイの設定
resource "aws_internet_gateway" "docker_ubuntu" {
  vpc_id = aws_vpc.docker_ubuntu.id
  tags = {
    Name = "terraform_igw_docker_ubuntu"
    }
  }

# ルートテーブルの設定
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.docker_ubuntu.id
  tags = {
    Name = "docker_ubuntu_route_table_public"
    }
  }
resource "aws_route" "public" {
  route_table_id = aws_route_table.public.id
  gateway_id = aws_internet_gateway.docker_ubuntu.id
  destination_cidr_block = "0.0.0.0/0"
}

//サブネットの関連付け
resource "aws_route_table_association" "public" {
  route_table_id = aws_route_table.public.id
  subnet_id = aws_subnet.public.id
}

# セキュリティグループの設定
resource "aws_security_group" "docker_ubuntu" {
  name = "docker_ubuntu"
  vpc_id = aws_vpc.docker_ubuntu.id
  ingress {
    from_port = "22"
    to_port = "22"
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    }
  }
