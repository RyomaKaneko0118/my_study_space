#!/bin/bash

if [ "$1" = "" ] ; then
   read n
else
   n=$1
fi

echo $((n * 2))
echo 'echo 10 | などで数値を渡すか引数で渡す。'
