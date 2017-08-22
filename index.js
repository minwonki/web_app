var express = require('express');
var app = express();
var cron = require('node-cron');
var request = require('request');

var btcStr = 'btc_nothing';
var ethStr = 'eth_nothing';

function Req (type) {
  this.url = 'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=' + type;
  var startVal = 4221000;
  var rangeVal = 666000;
 
  request(this.url,
  function(error, response, body) {
      var jsonObj = JSON.parse(body);
      var timestamp = new Date(jsonObj['timestamp']);
      if (timestamp.getHours() == 1) {
          startVal = jsonObj['last'];
          rangeVal = jsonObj['high'] - jsonObj['low'];
      } else {
          var buy = Number(startVal) + rangeVal*0.5;
          var last = jsonObj['last']
          sampleStr = timestamp.toString();
          sampleStr = sampleStr + '</br>start:' + startVal + ', range:' + rangeVal + ", last:" + last; 
          if (buy < last) {
             sampleStr = sampleStr + '</br>Buy Now!!! - buy:' + buy; 
          } else {
             sampleStr = sampleStr + '</br>Not yet!!! - buy:' + buy;
          }
          console.log('type:', type);
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
