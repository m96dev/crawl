var client = require('cheerio-httpcli');
var request = require('request');
var URL = require('url');
var fs = require('fs');
var path = require('path');

client.fetch('http://m96.eek.jp/', { param1: 'fuga' })
.then(function (result) {
  console.log(result.error);
  console.log(result.$);
  console.log(result.response);
  console.log(result.body);
})
.catch(function (err) {
  console.log(err);
})
.finally(function () {
  // 処理完了でもエラーでも最終的に必ず実行される
  console.log('final!')
});
