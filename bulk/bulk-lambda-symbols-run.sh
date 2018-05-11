#!/bin/bash
trap '' 1
SYMBOLS="ETH/BTC,BTC/USDT"
node bulk-lambda-scheduler.js $SYMBOLS >> system-lambda.log 2>&1 &
