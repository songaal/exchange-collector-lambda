#!/bin/bash
trap '' 1
export IFS=","
args=("$@")
COUNTER=1
ID=${args[0]}
SYMBOLS=${args[1]}
echo '>>>' ID: $ID, SYMBOLS: $SYMBOLS
for symbol in $SYMBOLS; do
  echo ">> $COUNTER $symbol"
  node bulk-worker-run.js $ID $SYMBOLS >> system-lambda.log 2>&1
  COUNTER=$[$COUNTER +1]
done


