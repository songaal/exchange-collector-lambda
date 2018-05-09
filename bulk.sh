export QUEUE_URL=https://sqs.ap-northeast-2.amazonaws.com/868448630378/bulk-price
export EXCHANGE=binance
export LIMIT=500
#since = 1491004800000 // 2017.4.1
#since = 1525844400000 //2018.5.9 14:40:00
export SINCE_TIME=1491004800000

trap '' 1

node bulk-collector.js >> system.log 2>&1 &

sleep 1
tail -f system.log
