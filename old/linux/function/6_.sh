#!/bin/bash
echo "最も大きいファイルの番号名から新しいファイルの作成"
nextIndex=$(ls -r | grep -E '^([0-9]*.ts)$' | head -n 1 | grep -o "[0-9]*")
fileName=$((nextIndex + 1))
touch "${fileName}.ts"


