// getpage.js
// モジュール読み込み
var client = require('cheerio-httpcli')

// ダウンロード
// var url = 'http://health.eek.jp/sitemap.xml'
// var url = 'https://health.dmkt-sp.jp/sitemap'
var url = 'https://health.dmkt-sp.jp/column/'
// var url = "http://mono-96.jp/"
var param = {}
client.set('browser', 'iphone')

client.fetch(url, param, function (err, $, res) {
  // エラーチェック
  if (err) {
    console.log('Error:', err)
    return
  }
  // ダウンロードした結果を画面に表示
  var body = $.html()
  // console.log(body);// body
  // レスポンスヘッダを参照
  // console.log("レスポンスヘッダ");
  // console.log(res.headers);

  // HTMLタイトルを表示
  console.log($('title').text())
  console.log('meta \n')
  console.log($('meta').text())
  var metaViewport = $("meta[name='viewport']").attr()
  console.log(metaViewport)

  // リンク一覧を表示
  console.log('href links  \n')
  var count = 0
  var curUrl = ''
  $('a').each(function (idx) {
    // console.log($(this).attr('href'));
    curUrl = $(this).attr('href')
    console.log(url)
    console.log(curUrl)
    // var pattern = url;
    var pattern = '/column/'
    if (curUrl.startsWith(pattern)) {
    // if(curUrl.indexOf(pattern) === 0){
      // 前方一致のときの処理
      count++
    }
  })
  console.log('href count :' + count)
})

var checkHeader = client.fetch(url, param, function (err, $, res) {
  // エラーチェック
  if (err) {
    console.log('Error:', err)
    return
  }
  // ダウンロードした結果を画面に表示
  var body = $.html()
  // console.log(body);// body
  // レスポンスヘッダを参照
  // console.log("レスポンスヘッダ");
  // console.log(res.headers);

  // HTMLタイトルを表示
  console.log($('title').text())
  console.log('meta \n')
  console.log($('meta').text())
  var metaViewport = $("meta[name='viewport']").attr()
  console.log(metaViewport)

  // console.log('href count :' + count)
})
