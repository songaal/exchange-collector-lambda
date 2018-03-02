var AWS = require('aws-sdk');

var SQS_QUEUE_URL = "https://sqs.ap-northeast-2.amazonaws.com/868448630378/coin-price";

exports.put = function(ohlcv, timestamp, market, coin, base) {
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
        QueueUrl: SQS_QUEUE_URL
    };

    sqs.sendMessage(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            // } else {
            //   console.log("Success", data.MessageId);
        }
    });
}
