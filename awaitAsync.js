// // Node8
const util = require('util')
const fs = require('fs')

const readFile = util.promisify(fs.readFile)
readFile('./package.json')
  .then((json) => JSON.parse(json))
  .then((json) => console.log(json))
  .catch((e) => console.error('error!!', e)) // a.json が不正ならここで SyntaxError が出る

// // async-await 版だとこうなります。

// const util = require('util')
// const fs = require('fs')

// const readFile = util.promisify(fs.readFile)
// async function parse() {
//   try {
//     const json = await readFile('./package.json')
//     console.log(JSON.parse(json))
//   } catch(e) {
//     console.error('error!', e)
//   }
// }
// parse()
