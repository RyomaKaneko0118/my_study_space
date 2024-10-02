#!/bin/bash

# 関数の定義
hello() {
  echo "Hello, world!"
  false
  echo "This line will not be executed"
}

# 関数の呼び出し
hello
echo "This line will not be executed"
