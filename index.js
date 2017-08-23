var express = require('express');
var app = express();
var cron = require('node-cron');
var request = require('request');

var btcStr = 'btc_nothing';
var ethStr = 'eth_nothing';
var btc_startVal = 100;
var btc_rangeVal = 10;
var eth_startVal = 101;
var eth_rangeVal = 11;

function Req (type) {
  this.url = 'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=' + type;
 
  request(this.url,
  function(error, response, body) {
      var jsonObj = JSON.parse(body);
      var timestamp = new Date(jsonObj['timestamp']);
      if (timestamp.getHours() == 1) {
          if (type == 'btc_krw') {
              btc_startVal = jsonObj['last'];
              btc_rangeVal = jsonObj['high'] - jsonObj['low'];
          } else {
              eth_startVal = jsonObj['last'];
              eth_rangeVal = jsonObj['high'] - jsonObj['low'];
          }
      } else {
          var buy = 0;
          var last = jsonObj['last']
          sampleStr = timestamp.toString();
          if (type == 'btc_krw') {
              buy = Number(btc_startVal) + btc_rangeVal*0.5;
              sampleStr = sampleStr + '</br>start:' + btc_startVal + ', range:' + btc_rangeVal + ", last:" + last; 
          } else {
              buy = Number(eth_startVal) + eth_rangeVal*0.5;
              sampleStr = sampleStr + '</br>start:' + eth_startVal + ', range:' + eth_rangeVal + ", last:" + last; 
          }

          if (buy < last) {
             sampleStr = sampleStr + '</br>Buy Now!!! - buy:' + buy; 
          } else {
             sampleStr = sampleStr + '</br>Not yet!!! - buy:' + buy;
          }

          if (type == 'btc_krw') {
            btcStr = sampleStr;
            //console.log('btc last:',last);
          } else {
            ethStr = sampleStr
            //console.log('eth last:',last);
          }
      }
  });
}

cron.schedule('*/10 * * * *', function() {
    Req('btc_krw');
    Req('eth_krw');
},
function(){console.log('job stop')},
true);
 
app.get('/', function (req, res) {
  res.send('Hello World! </br>' + '[btc]' + btcStr + '</br></br>' + '[eth]' + ethStr);
});
 
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
 
  console.log('앱은 http://%s:%s 에서 작동 중입니다.', host, port);
});
