#!/bin/bash

trap '' 15
trap '' 18
trap '' 2
echo "プロセスID $$でスリープ中"

sleep 10000
echo "スリープ終了"
