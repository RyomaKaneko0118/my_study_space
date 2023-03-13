#!/bin/bash

# 関数の定義
hello() {
  echo "Hello, world!"
  false
}

# 関数の呼び出し
hello

# 直前のコマンドの終了ステータスを確認し、エラーがあればエラーメッセージを表示する
if [ $? -ne 0 ]; then
  echo "An error occurred"
fi
