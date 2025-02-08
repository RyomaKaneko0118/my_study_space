#!/bin/bash

cat count
for ((i=0; i<1000; i++)); do
  ./inc.sh
done