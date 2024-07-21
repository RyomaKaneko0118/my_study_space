#!/bin/bash

# ファイルを作成して開く関数
open_files() {
    local count=$1
    local prefix="testfile"

    for ((i = 1; i <= $count; i++)); do
        filename="$prefix$i"
        touch "$filename"
        exec {fd}>"$filename"
        echo "Opened file: $filename"
    done
}

# ファイルをクリーンアップする関数
cleanup_files() {
    local count=$1
    local prefix="testfile"

    for ((i = 1; i <= $count; i++)); do
        filename="$prefix$i"
        exec {fd}>&-
        rm -f "$filename"
        echo "Closed and removed file: $filename"
    done
}

# メインスクリプト

echo "Opening 2000 files..."
open_files 2000

# 一定時間待機してからファイルをクリーンアップする
sleep 10

echo "Cleaning up files..."
cleanup_files 2000

echo "Done."
