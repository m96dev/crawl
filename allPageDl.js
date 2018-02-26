// original comment
// webpage 一気にローカルにダウンロードするプログラムです。
// $ node allPageDl.js > allPageDl.log
/*
find ./ -type f -name "*[content="width=1024"]*"
grep [検索したい文字列] -rl [検索対象フォルダのパス]
grep  width=1024  -rl ./
grep  width=1024  -rl /Users/mono05/Documents/health/files/
                      ↓filename
find . | xargs grep -n hogehoge
                      <filetype>
find ./health.eek.jp/ -type f | xargs grep -n "width=1024"
find ./files/ -type f | xargs grep -n "width=1024"

# cacheファイルを検索して。Width=1024 のCanonicalURLを表示
find ./files/ -type f -name *.cache | xargs grep -rl "width=1024" | xargs grep -r "canonical"
find ./files/ -type f -name *.cache | xargs grep -rl "健康コラム" | xargs grep -r "canonical"
find ./files/ -type f -name *.cache | xargs grep -rl "ccm_paging_p" | xargs grep -r "canonical"
# crawl folder
find ./health.dmkt-sp.jp/ -type f -name index.html | xargs grep -rl "width=1024" | xargs grep -r "canonical"

grep  width=1024  -rl ./
*/
// モジュールの読込
var client = require('cheerio-httpcli')
// var request = require('request')
var URL = require('url')
var fs = require('fs')
var path = require('path')

var util = require('util')
var writeFile = util.promisify(fs.writeFileSync)

// 共通の設定
// 階層の指定
var LINK_LEVEL = 5

// 基準となるページURL
// var TARGET_URL = 'http://nodejs.jp/nodejs.org_ja/docs/v0.10/api/'
// var TARGET_URL = 'https://health.dmkt-sp.jp/column/'
// var TARGET_URL = 'http://do.local:8888/'

// rakuten
// var TARGET_URL = 'https://www.rakuten.ne.jp/gold/shopjapan/'

// // sakura
// var TARGET_URL = "http://health-mgr.sakura.ne.jp/column";
// var TARGET_URL = "http://health-mgr.sakura.ne.jp/";
// var TARGET_URL = "http://health.eek.jp/"

// // D
// var TARGET_URL = "https://health.dmkt-sp.jp/" //
var TARGET_URL = 'https://health.dmkt-sp.jp/'

client.set('browser', 'iphone')
  // 'ie' | 'edge' | 'chrome' | 'firefox' |
  // 'opera' | 'vivaldi' | 'safari' |
  // 'ipad' | 'iphone' | 'ipod' | 'android' |
  // 'googlebot'): boolean;
// 以下を追加
// client.debug = true;
client.set('debug', true)
var exitFlg = false
var exitCount = 5
// 既出のサイトを定義する。(既出のサイトは無視をする)
var list = []
var listPage = []
var count = 0

// メイン処理
var totalCount = downloadRec(TARGET_URL, 0)
console.log('total ' + totalCount)

// downloadRec( "a aa "+ TARGET_URL, 0); // indexOfの動作確認

// 指定のurlを最大レベルlevelまでダウンロードする
function downloadRec (url, level) {
  if (!url.startsWith(TARGET_URL) && count > 0) return
  // if (url.startsWith(TARGET_URL) && count>0) return;
  // 最大レベルのチェックをする (最大レベルになるまでループさせるため)
  if (level >= LINK_LEVEL) return

  // 既出のサイトは無視をする。
  console.log(list)
  var matchData = list.indexOf(url)
  // マッチング用のURLリストを作成
  if (matchData > 0) return true
  else list.push(url)
  console.log('matchData:' + matchData)

  // 基準ページ以外なら無視をする // 入力::http://nodejs.jp/nodejs.org_ja/docs/v0.10/api
  var us = TARGET_URL.split('/')
  // console.log(us);        // 出力::['http:','','nodejs.jp','nodejs.org_ja','docs','v0.10','api']
  us.pop()                  // 出力::api 配列の最後の要素を削除
  // console.log(us);        // 出力::['http:','', 'nodejs.jp', 'nodejs.org_ja', 'docs','v0.10']
  var base = us.join('/')  // 配列の各要素を指定の文字列で連結
  //  console.log(base);     // 出力::http://nodejs.jp/nodejs.org_ja/docs/v0.10
  console.log('url : ' + url)
  if (url.indexOf(base) < 0) {
    console.log('this is other site')
    return
  }

  // HTMLを取得する
  // client.fetch(url, {}, function (err, $, res) {
  client.fetch(url, {})
  .then(function (res) {
    var $ = res.$
    // client.fetchSync(url, {}, function (err, $, res) {
    // リンクされているページを取得
    console.log('$("a")' + $('a'))
    $('a').each(function (idx) {
      // console.log(idx);
      //  タグのリンク先を得る
      var href = $(this).attr('href')
      // list[] = href;
      // var curUrl = $(this).attr('href');
      // var pattern = url;
      var pattern = '/column/'
      pattern = ''
      // console.log(curUrl);
      if (href.startsWith(pattern) && url.startsWith(TARGET_URL)) {
        if (href.startsWith('?')) return
        count++
        if (exitFlg && (count === exitCount)) return false // exit loop and method
        // 前方一致のときの処理
        var metaViewport = ''
        metaViewport = $("meta[name='viewport']").attr()
        if (!href) return // href属性を取得できない時の処理
        console.log('href ' + href)
        console.log('url + href ' + url + href)
        // console.log(metaViewport);
        if (metaViewport !== '' && metaViewport.content === 'width=1024') {
          console.log('NG')
          console.log(metaViewport.content)
        } else if (metaViewport.content === 'width=375') {
          console.log('OK')
          console.log(metaViewport.content)
          // return count++;
        } else {
          console.log('wat??')
          console.log(metaViewport.content)
        }
        // console.log('count:'+count);

        // あるURLから 相対的なURL を 絶対URL へ生成する場合には resolve メソッドを使用します。
        // var URL = require('url');
        // var from =  'http://h.com/foo/index.html' ,
        //     to   =  '../bar/index.html' ;
        // var href = URL.resolve( from , to );
        // echo href; //http://h.com/bar/baz.html
        href = URL.resolve(url, href)

        // '#' 以降を無視する(a.html#aa と a.html#bbは同じものとする)
        href = href.replace(/#.+$/, '') // 末尾の#を消す
        href = href.replace(/\?/, '')    // ?を消す

        // await downloadRec(href, level + 1);
        downloadRec(href, level + 1)
      }
    }) // $("a").each(

    // ページを保存 (ファイル名を決定する)
    if (url.substr(url.length - 1, 1) === '/') {
      url += 'index.html' // インデックスを自動追加する。
    }
    // console.log(url.split("/"));          //[ 'http:','','nodejs.jp','nodejs.org_ja','docs','v0.10','download']
    // console.log(url.split("/").slice(2)); //[            'nodejs.jp','nodejs.org_ja','docs','v0.10','download']

    var savepath = url.split('/').slice(2).join('/') // slice::配列の一部を取り出して新しい配列を返します。
    //  console.log(savepath);               // nodejs.jp/nodejs.org_ja/docs/v0.10/download

    // 保存先のディレクトリが存在するか確認をする。
    checkSaveDir(savepath)
    console.log('savepath : ' + savepath) // nodejs.jp/nodejs.org_ja/docs/v0.10/download

    // 再確認、末尾がファイル名出ない場合は追加
    savepath += (savepath.lastIndexOf('index.html')) ? '' : 'index.html'
    // html として保存
    // fs.writeFileSync(savepath, $.html());

    writeFile(savepath, $.html())
    // readFile('./package.json')
      // .then((json) => JSON.parse(json))
      // .then((json) => console.log(json))
      .then((resWrite) => console.log('writeFile' + resWrite))
      .catch((errWrite) => console.log('writeFileError!!', errWrite)) // a.json が不正ならここで SyntaxError が出る

    // WIP
    if (listPage.indexOf(savepath) > 0) return true
    else listPage.push(savepath)
  })// client.fetch END
  .catch(function (err) {
    console.log(err.url + ' ' + err.statusCode + ' ' + err.req._header)
  })
  .finally(function () {
    // 処理完了でもエラーでも最終的に必ず実行される
    console.log('count:' + count)
  })
}
console.log(totalCount)

// 保存先のディレクトリが存在するか確認をする。
function checkSaveDir (fname) {
  // ディレクトリ部分だけ取り出す
  var dir = path.dirname(fname)
  console.log('dir :' + dir)

  // ディレクトリを再帰的に作成する。
  var dirlist = dir.split('/')
  var p = ''
  for (var i in dirlist) {
    p += dirlist[i] + '/'
    // if (!fs.existsSync(p) && !fs.statSync(p).isDirectory()) {
    if (!fs.existsSync(p)) {
      // 末尾から1文字を削除
      // p = p.slice( 0, -1 ) ;
      // fs.unlinkSync(p);
      fs.mkdirSync(p, function (err) {
        if (err) {
          console.log('error!!')
          console.error('fs.mkdirSync : ' + err)
          process.exit(1)
        } else {
          console.log('finished!!')
        }
      })
    }
  }
}
