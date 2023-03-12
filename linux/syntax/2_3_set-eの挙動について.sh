#!/bin/bash

# 関数の定義
hello() {
  echo "Hello, world!"
  false
}

# 関数の呼び出し
hello

# エラーが発生した場合
if [ $? -eq 1 ]; then
  echo "エラーが発生しました" >&2
  exit 1
fi
# スクリプトの処理
exit 0
