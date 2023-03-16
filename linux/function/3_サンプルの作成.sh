#!/bin/bash

echo {mail,blog,www,}.{robotics,blacknon}.{co,com,jp,go,asia} | tr ' ' '\n' | sort -R | head -n 10 | sed 's/^\.//'

echo 'echo {mail,blog,www,}.{robotics,blacknon}.{co,com,jp,go,asia} | tr ' ' '\n' | sort -R | head -n 10 | sed 's/^\.//''
