exports.getLatestOhlcv = function(data) {
    var endTime = new Date();
    endTime.setSeconds(0);
    endTime.setMilliseconds(0);
    endTime.setMinutes(endTime.getMinutes());
    var startTime = new Date(endTime.getTime());
    startTime.setMinutes(startTime.getMinutes() - 1);
    var startTimestamp = startTime.getTime();
    var endTimestamp = endTime.getTime();

    var open;
    var high;
    var low;
    var close;
    var volume = 0.0;
    var trades = 0;

    for (var k = 0; k < data.length; k++) {
        var o = data[k];
        var ts = o[0];

        // binance는 1분봉 데이터를 받으므로, 통계없이 값을 직접 입력한다.
        // 자료구조 : https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#klinecandlestick-data
        if (ts >= startTimestamp && ts < endTimestamp) {
            open = o[1];
            high = o[2];
            low = o[3];
            close = o[4];
            volume = o[5];
            trades = o[8];
            break;
        }
    }

    if (trades > 0) {
        return {
            "ts": startTimestamp,
            "ohlcv": {
                "o": open,
                "h": high,
                "l": low,
                "c": close,
                "v": volume,
                "t": trades
            }
        };
    } else {
        return false;
    }
}
