var express = require('express');
var app = express();
var cron = require('node-cron');
var request = require('request');

var sampleStr = 'nothing';
var startValue = 4850250;
var range = 200000;
var flagStop = false;

cron.schedule('*/2 * * * *', function() {
    request('https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=btc_krw',
    function(error, response, body) {
        var jsonObj = JSON.parse(body);
        var timestamp = new Date(jsonObj['timestamp']);
        if (timestamp.getHours() == 1) {
            console.log('time:',timestamp.getHours());
            startValue = jsonObj['last'];
            range = jsonObj['high'] - jsonObj['low'];
            console.log('start:', startValue);
            console.log('range:', range);
            console.log('time:', timestamp.toString());
            sampleStr = 'Setting StartValue:' + startValue + ', range:' + range + ', time:' + timestamp.toString();
        } else {
            var buy = startValue + range*0.5;
            var last = jsonObj['last']
            if (buy < last) {
               sampleStr = 'Buy Now!! - last:' + last + ',buy:' + buy + ' - ' +timestamp.toString(); 
               console.log('Buy Now!! - last:' + last + ',buy:' + buy + ' - ' +timestamp.toString());
            } else {
               sampleStr = 'Not yet - last:' + last + ',buy:' + buy + ' - ' +timestamp.toString();
               console.log('Not yet - last:' + last + ',buy:' + buy + ' - ' +timestamp.toString());
            }
        }
    });
},
function(){console.log('job stop')},
true);
 
app.get('/', function (req, res) {
  res.send('Hello World! </br>' + sampleStr);
});
 
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
 
  console.log('앱은 http://%s:%s 에서 작동 중입니다.', host, port);
});
