exports.getLatestOhlcv = function(data) {
    var endTime = new Date();
    endTime.setSeconds(0);
    endTime.setMilliseconds(0);
    endTime.setMinutes(endTime.getMinutes());
    var startTime = new Date(endTime.getTime());
    startTime.setMinutes(startTime.getMinutes() - 9);
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
        var ts = o.timestamp;

        if (ts >= startTimestamp && ts < endTimestamp) {
            if (open == undefined) open = o.price;
            if (high == undefined || o.price > high) high = o.price;
            if (low == undefined || o.price < low) low = o.price;
            close = o.price;
            volume += parseFloat(o.amount);
            trades++;
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
