# exchange-collector-lambda

거래소 가격데이터 저장용 람다함수.

거래소 api 를 통해 데이터를 가져와서 SQS에 넣는다.

차후 exchange-data-server가 SQS의 데이터를 influxdb에 넣는다.

## 람다구성

### 1. binance-scheduler

스케줄러는 한 거래소의 각 심볼을 각각의 exchange-collector 람다로 만들어서 호출해주는 트리거 역할을 한다. 

* 파일: exchange-scheduler.js
* 핸들러: exchange-scheduler.handler
* 환경변수
  * BUCKET: proxy.coinark.io
  * EXCHANGE: binance
  * FUNCTION_NAME: exchange-collector
  
 
 
### 2. exchange-collector

실제로 거래소 데이터를 가져와서 Queue 에 넣어준다.

* 파일: exchange-collector.js
* 핸들러: exchange-collector.handler
* 환경변수
  * QUEUE_URL: https://sqs.ap-northeast-2.amazonaws.com/868448630378/coin-price


