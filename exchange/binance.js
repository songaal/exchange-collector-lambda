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
        var ts = o.time;
        var price = o.price;

        if (ts >= startTimestamp && ts < endTimestamp) {
            if (open == undefined) open = price;
            if (high == undefined || price > high) high = price;
            if (low == undefined || price < low) low = price;
            close = price;
            volume += parseFloat(o.qty);
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
