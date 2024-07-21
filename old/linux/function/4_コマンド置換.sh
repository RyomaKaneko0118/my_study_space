#!/bin/bash
echo "コマンド置換\$()"
echo "コマンドの結果を文字列として取得する"
echo "filename=\$(date '+%Y-%m-%d')"
echo "touch \"\$filename\""

filename=$(date '+%Y-%m-%d')
touch "$filename"
