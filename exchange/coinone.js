exports.getLatestOhlcv = function(data) {
    var endTime = new Date();
    endTime.setSeconds(0);
    endTime.setMilliseconds(0);
    endTime.setMinutes(endTime.getMinutes());
    var startTime = new Date(endTime.getTime());
    startTime.setMinutes(startTime.getMinutes() - 9);
    var startTimestamp = startTime.getTime();
    var endTimestamp = endTime.getTime();
    // console.log("time: ", startTime, " ~ ", endTime);
    // console.log("timestamp: ", startTime.getTime(), " ~ ", endTime.getTime());

    var open;
    var high;
    var low;
    var close;
    var volume = 0.0;
    var trades = 0;
    //console.log(new Date(data.timestamp*1000));

    if (data.completeOrders) {
        for (var k = 0; k < data.completeOrders.length; k++) {
            var o = data.completeOrders[k];
            var ts = o.timestamp * 1000;

            //console.log(k, "compare>> ", startTimestamp, ts, endTimestamp);
            if (ts >= startTimestamp && ts < endTimestamp) {
                //console.log(startTime, o);
                if (open == undefined) open = o.price;
                if (high == undefined || o.price > high) high = o.price;
                if (low == undefined || o.price < low) low = o.price;
                close = o.price;
                volume += parseFloat(o.qty);
                trades++;
            }
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
