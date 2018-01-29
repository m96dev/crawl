// original comment
// webpage 一気にローカルにダウンロードするプログラムです。

// モジュールの読込
var client = require('cheerio-httpcli');
var request = require('request');
var URL = require('url');
var fs = require('fs');
var path = require('path');

//共通の設定
//階層の指定
var LINK_LEVEL = 2;

//基準となるページURL
var TARGET_URL = "http://nodejs.jp/nodejs.org_ja/docs/v0.10/api/";
var TARGET_URL = "https://health.dmkt-sp.jp/column/";
var TARGET_URL = "http://health-mgr.sakura.ne.jp/column";
var TARGET_URL = "http://health.eek.jp/column/"

client.set('browser', 'iphone');

//既出のサイトを定義する。(既出のサイトは無視をする機能があるため。)
var list = {};

var count = 0;

//メイン処理
var totalCount = downloadRec(TARGET_URL, 0);
console.log('total '+totalCount);

//downloadRec( "a aa "+ TARGET_URL, 0); //indexOfの動作確認

//指定のurlを最大レベルlevelまでダウンロードする
function downloadRec(url, level) {
  //最大レベルのチェックをする (最大レベルになるまでループさせるため)
  if (level >= LINK_LEVEL) return;

  //既出のサイトは無視をする。
  if (list[url]) return;

  //基準ページ以外なら無視をする
  //-----------------------------------------------------------
  var us = TARGET_URL.split("/");

  //  console.log(us);  //出力::[ 'http:', '', 'nodejs.jp', 'nodejs.org_ja', 'docs', 'v0.10', 'api' ]

  us.pop(); //popメソッドを使用して、配列の最後の要素を削除します。
  //console.log(us.pop()); //出力::api

  //  console.log(us);  //出力::[ 'http:', '', 'nodejs.jp', 'nodejs.org_ja', 'docs', 'v0.10' ]

  var base = us.join("/"); //joinメソッドは配列の各要素を指定の文字列で連結し、結果の文字列を返します。
  //  console.log(base);  //出力::http://nodejs.jp/nodejs.org_ja/docs/v0.10

  if (url.indexOf(base) < 0) return;
  //console.log(url.indexOf(base));
  //-----------------------------------------------------------
  // HTMLを取得する
  client.fetch(url, {}, function (err, $, res) {
    //リンクされているページを取得
    $("a").each(function (idx) {
      console.log(idx);
      //  タグのリンク先を得る
      var href = $(this).attr('href');
      // var curUrl = $(this).attr('href');
      // var pattern = url;
      var pattern = '/column/';
      // console.log(curUrl);
      if (href.startsWith(pattern)) {
        // 前方一致のときの処理
        var metaViewport = $("meta[name='viewport']").attr();
        // console.log(metaViewport);
        if (metaViewport.content === 'width=1024') {
          console.log('NG');
          console.log(metaViewport.content);
          return count++;
        } else if (metaViewport.content === 'width=375') {
        
          console.log('ok');
        };

        // console.log('count:'+count);
        if (!href) return; //href属性を取得できない時の処理
        console.log(href);


        // 絶対パスを相対パスに変更
        href = URL.resolve(url, href);

        //'#' 以降を無視する(a.html#aa と a.html#bb　は同じものとする)
        href = href.replace(/\#.+$/, "") //末尾の#を消す

        downloadRec(href, level + 1);
      }

    });

    // ページを保存 (ファイル名を決定する)
    if (url.substr(url.length - 1, 1) == '/') {
      url += "index.html"; //インデックスを自動追加する。
    }

    // console.log(url.split("/")); //[ 'http:',  '',  'nodejs.jp',  'nodejs.org_j  'docs',  'v0.10',  'download' ];
    // console.log(url.split("/").slice(2)); //[ 'nodejs.jp', 'nodejs.org_ja', 'docs', 'v0.10', 'download' ]

    var savepath = url.split("/").slice(2).join("/"); //slice::配列の一部を取り出して新しい配列を返します。
    //  console.log(savepath); //nodejs.jp/nodejs.org_ja/docs/v0.10/download

    //保存先のディレクトリが存在するか確認をする。
    checkSaveDir(savepath);
    console.log(savepath); //nodejs.jp/nodejs.org_ja/docs/v0.10/download

    fs.writeFileSync(savepath, $.html());

  });
}
console.log(totalCount);

//保存先のディレクトリが存在するか確認をする。
function checkSaveDir(fname) {
  //ディレクトリ部分だけ取り出す
  var dir = path.dirname(fname);

  //ディレクトリを再帰的に作成する。
  var dirlist = dir.split("/");
  var p = "";
  for (var i in dirlist) {
    p += dirlist[i] + "/";
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
}