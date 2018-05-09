const AWS = require('aws-sdk')
const lambda = new AWS.Lambda({
    region: 'ap-northeast-2'
});
/*
* 이 worker는 1. 람다를 호출하고 2. 리턴받은 timestamp로 다시 그 다음 람다를 호출하고 3. timestamp 가 null 일때 까지 호출해준다.
* */
module.exports = function(functionName, exchange_id, symbol, coin, base, since, limit){
    let k = 0
    console.log(new Date(), '['+i+'/'+total+']' ,exchange_id, symbol)
    let lastSince = 0
    while(true) {
        k++
        if(since == lastSince) {
            //더이상 최신데이터가 없다면 종료한다.
            console.log(new Date(), 'No more new data since ', new Date(since).toLocaleString(), since)
            break;
        }
        let attr = {
            exchange: exchange_id,
            coin: coin,
            base: base,
            symbol: symbol,
            since: since,
            limit: limit

        };
        console.log(new Date(), symbol, k, new Date(since).toLocaleString(), attr);
        if (process.env.DRY_RUN != 'true') {
            lambda.invoke({
                FunctionName: functionName,
                Payload: JSON.stringify(attr)
            }, function (err, data) {
                if (err) console.log(attr.base, attr.coin, err, err.stack);
                else console.log(data)
            });
        }

        size = dataList.length
        if (process.env.DRY_RUN != 'true') {
            queue.bulk_put(dataList, exchange_id, coin, base, QUEUE_URL);
        }

        lastData = dataList[size - 1]
        // 마지막 시간을 확인하고 다음 루프의 since 시간으로 셋팅한다.
        lastSince = since
        since = lastData[0]
    }
    console.log(new Date(), '--------------------------')
}
