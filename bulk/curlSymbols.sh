#!/bin/bash
curl https://api.binance.com/api/v1/exchangeInfo | jq .symbols |jq '.[]|{baseAsset, quoteAsset}'

