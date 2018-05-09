var AWS = require('aws-sdk');

exports.put = function(ohlcv, timestamp, market, coin, base, queueUrl) {
    var messageBody = JSON.stringify(ohlcv);
    // Set the region
    AWS.config.update({
        region: 'ap-northeast-2'
    });
    var sqs = new AWS.SQS({
        apiVersion: '2012-11-05'
    });

    var params = {
        MessageAttributes: {
            "timestamp": {
                DataType: "Number",
                StringValue: timestamp.toString()
            },
            "market": {
                DataType: "String",
                StringValue: market
            },
            "coin": {
                DataType: "String",
                StringValue: coin
            },
            "base": {
                DataType: "String",
                StringValue: base
            }
        },
        MessageBody: messageBody,
        QueueUrl: queueUrl
    };

    sqs.sendMessage(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            // } else {
            //   console.log("Success", data.MessageId);
        }
    });
}
