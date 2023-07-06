#!/bin/bash
pwd
touch ./src/files/inventory.txt && dig @$1 -t axfr $2.ull.lan >> ./src/files/inventory.txt && node parse_inventory.js ./src/files/inventory.txt

# $1 = arg 1 = server ip
# $2 = arg 2 = username
