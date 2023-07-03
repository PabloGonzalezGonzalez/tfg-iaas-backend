#!/bin/bash
pwd
touch ./src/files/inventory.txt && dig @10.6.131.86 -t axfr ull.lan >> ./src/files/inventory.txt && node parse_inventory.js ./src/files/inventory.txt
