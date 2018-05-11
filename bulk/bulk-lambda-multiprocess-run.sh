#!/bin/bash
trap '' 1
export IFS=","
SYMBOLS="ETH/BTC,BTC/USDT"
batchSize=10
COUNTER=1
for symbol in $SYMBOLS; do
  echo "$COUNTER >> $symbol"
  #node bulk-lambda-scheduler.js $SYMBOLS >> system-lambda-$COUNTER.log 2>&1 &
  sleep 0.3
  COUNTER=$[$COUNTER +1]
done


