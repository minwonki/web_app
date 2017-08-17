var express = require('express');
var app = express();
var cron = require('node-cron');
var request = require('request');

var sampleStr = 'nothing';
var startValue = 4920250;
var range = 340000;
var flagStop = false;

cron.schedule('*/10 * * * *', function() {
  var date = new Date();
  var current_hour = date.getHours(); 
  if (current_hour == 1) {
      request('https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=btc_krw',
      function(error, response, body) {
          var jsonObj = JSON.parse(body);
          startValue = jsonObj['last'];
          range = jsonObj['high'] - jsonObj['low'];
          console.log('start:',startValue);
          console.log('range:',range);
          flagStop = false;
      });
  }

  if (flagStop == false) {
    request('https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=btc_krw',
        function(error, response, body) {
            var jsonObj = JSON.parse(body);
            var buy = startValue + range*0.5;
            console.log('last:',jsonObj['last']+",buy:"+buy);
            var last = jsonObj['last']
            if (buy < last) {
               sampleStr = 'Buy Now!!-' + last; 
               console.log('Buy Now!!-',last);
               flagStop = true;
            } else {
               sampleStr = 'Not yet - ' + buy + ':' + last;
            }
    });
  }
  
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
