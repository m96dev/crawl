# crawl
crawler for checking header tag

### NodeJS
Nodejsライブラリを利用して、サーチエンジンが自動でやっているような
サイトクローラーを作成、指示を与えて情報を持って帰ってくるBOTのようなもの

あるサイトのページ、もしくはドメインを指定
そのページに有るリンクからサイトを同ドメイン内に絞り巡回
- IOS,android等スマホで巡回した結果となる
- 別ドメインは除外する
- 目的のタグ等でHTML内をチェック、3レベル先までのページを再度巡回
- ログとしてHTMLソースのみをダウンロードしておく。

`var TARGET_URL = "http://foo.jp/";`
or
`var TARGET_URL = "http://foo.jp/bar/";`

### task
- [x] 結果を参照して調査ができるレベルのもを作成
- [ ] Mid:指定のURLのサブフォルダー以下だけを辿らせる
- [ ] Low:高速すぎて、何度もファイルを保存にいく
- [ ] more


指定のURLのサブフォルダー以下だけを辿らせる
```
(optionで切り替えられるように)
ex:
targetUrl
http://one.jp/two/three

result
http://one.jp/two/three
http://one.jp/two/three/four
http://one.jp/two/three/four/five


now result
http://one.jp      << ignore
http://one.jp/two/ << ignore
http://one.jp/two/three/
http://one.jp/two/three/four
http://one.jp/two/three/four/five
```