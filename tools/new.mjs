import config from "../config.mjs"
import fs from "fs"
import path from "path";

const name = process.argv[2]
let {
  author, homepageURL
} = config

if (!name) {
  console.error("缺少参数 扩展名");
  process.exit()
}

let dir = path.join(process.cwd(), "src", name)



try {
  fs.mkdirSync(dir)

  fs.writeFileSync(path.join(dir, "index.ts"),
    `let ext = seal.ext.find("${name}");
  if (!ext) {
    ext = seal.ext.new("${name}", "${author}", "1.0.0");
    seal.ext.register(ext);
  }

  export {}`)

  fs.writeFileSync(path.join(dir, "config.mjs"),
    `const config = {
    // 扩展名
    "name": "${name}",
    // 扩展作者
    "author": "nao",
    // 项目主页
    "homepageURL": "${homepageURL}",
  }

  export default {
    ...config,

    // 输出文件名
    outfile: config.name+".js"
  }`)
} catch (e) { console.log(e); }



console.log("New: ", dir);
