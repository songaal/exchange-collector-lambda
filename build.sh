#! /bin/bash

# 프로그램별 사용되는 거래소
# exchange-scheduler,exchange-collector:
#  1. 바이낸스

# bithumb-exchange-collector, bithumb-exchange-scheduler
#  1. 빗썸 전용

# upbit-exchange-collector, upbit-exchange-scheduler
#  1. 업비트 전용

# huobi-exchange-collector, exchange-scheduler
#  1. 후오비



# binance-bulk-executor-force, binance-bulk-collector-force:
#  바이낸스 전용 강제 데이터 업데이트. 로컬에서 람다 호출.

VERSION=1.3.10
zip -r9 ./exchange-collector-$VERSION.zip ./*.js ./node_modules

echo "compress. exchange-collector-$VERSION.zip"
