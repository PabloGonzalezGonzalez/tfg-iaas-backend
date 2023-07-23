#!/bin/bash
pwd
inventory="./files/inventory.txt"

# $1 = arg 1 = server ip
# $2 = arg 2 = username
if [ -f $inventory ]
 then
  rm -f $inventory
fi
touch $inventory && dig @$1 -t axfr $2.ull.lan > $inventory && node ./scripts/parse_inventory.js $inventory

