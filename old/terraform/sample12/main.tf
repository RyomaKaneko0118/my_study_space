terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      }
    }
  }

provider "aws" {
  # エラーがでるので下記をコメントアウト
  # profile = "default"
  region  = "ap-northeast-1"
}

# amiとインスタンスタイプの設定
resource "aws_instance" "app_server" {
  ami = "ami-0b828c1c5ac3f13ee"
  instance_type = "t2.micro"
  root_block_device {
    volume_size = 20
    }
  key_name  = aws_key_pair.auth.id
  subnet_id = aws_subnet.public_1a.id
  vpc_security_group_ids = [aws_security_group.docker_ubuntu.id]
  tags = {
    Name = "Terraform_v_2"
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
resource "aws_subnet" "public_1a" {
  cidr_block = "10.0.10.0/24"
  vpc_id = aws_vpc.docker_ubuntu.id
  //  このサブネットで起動したインスタンスに自動的に
  //  IPアドレスを割り当ててくれる
  map_public_ip_on_launch = true
  availability_zone = "ap-northeast-1a"
  tags = {
    Name = "docker_ubuntu_subnet_public_basic_1a"
    }
  }

resource "aws_subnet" "private_1a" {
  cidr_block = "10.0.20.0/24"
  vpc_id = aws_vpc.docker_ubuntu.id
  //  このサブネットで起動したインスタンスに自動的に
  //  IPアドレスを割り当ててくれる
  map_public_ip_on_launch = false
  availability_zone = "ap-northeast-1a"
  tags = {
    Name = "docker_ubuntu_subnet_private_basic_1a"
    }
  }

resource "aws_subnet" "private_1b" {
  cidr_block = "10.0.21.0/24"
  vpc_id = aws_vpc.docker_ubuntu.id
  //  このサブネットで起動したインスタンスに自動的に
  //  IPアドレスを割り当ててくれる
  map_public_ip_on_launch = false
  availability_zone = "ap-northeast-1b"
  tags = {
    Name = "docker_ubuntu_subnet_private_basic_1b"
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
  subnet_id = aws_subnet.public_1a.id
}

# ルートテーブルの設定
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.docker_ubuntu.id
  tags = {
    Name = "docker_ubuntu_route_table_private"
    }
  }
//サブネットの関連付け
resource "aws_route_table_association" "private" {
  route_table_id = aws_route_table.private.id
  subnet_id = aws_subnet.private_1a.id
}

# セキュリティグループの設定
resource "aws_security_group" "docker_ubuntu" {
  name = "docker_ubuntu"
  vpc_id = aws_vpc.docker_ubuntu.id
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    }
  }
resource "aws_security_group_rule" "ssh" {
  from_port = 22
  to_port = 22
  protocol = "tcp"
  security_group_id = aws_security_group.docker_ubuntu.id
  type = "ingress"
  cidr_blocks = ["0.0.0.0/0"]
}
resource "aws_security_group_rule" "HTTP" {
  from_port = 80
  to_port = 80
  protocol = "tcp"
  security_group_id = aws_security_group.docker_ubuntu.id
  type = "ingress"
  cidr_blocks = ["0.0.0.0/0"]
}
resource "aws_security_group_rule" "HTTPS" {
  from_port = 443
  to_port = 443
  protocol = "tcp"
  security_group_id = aws_security_group.docker_ubuntu.id
  type = "ingress"
  cidr_blocks = ["0.0.0.0/0"]
}
resource "aws_security_group_rule" "web_testing" {
  from_port = 8080
  to_port = 8082
  protocol = "tcp"
  security_group_id = aws_security_group.docker_ubuntu.id
  type = "ingress"
  cidr_blocks = ["0.0.0.0/0"]
}
resource "aws_security_group_rule" "Kubernetes_testing" {
  from_port = 30000
  to_port = 30000
  protocol = "tcp"
  security_group_id = aws_security_group.docker_ubuntu.id
  type = "ingress"
  cidr_blocks = ["0.0.0.0/0"]
}

variable "key_name" {
  description = <<DESCRIPTION
  your_key.pubを入力してください。
  .pubがつく公開鍵の方です。
  秘密鍵と間違えないように。
  DESCRIPTION
  }

variable "public_key" {
  description = <<DESCRIPTION
  cat ~/.ssh/your_key.pub
  で出力された値を直打ちして下さい。
  （パス名のみだと、私の環境ではエラーがでました。）
  DESCRIPTION
}

resource "aws_key_pair" "auth" {
  key_name   = var.key_name
  public_key = var.public_key
}
