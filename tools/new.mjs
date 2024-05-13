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

if (fs.existsSync(dir)) {
  console.error("已存在同名的插件文件夹")
  process.exit()
}

fs.mkdirSync(dir)

const template_index = `
let ext = seal.ext.find("${name}");
if (!ext) {
  ext = seal.ext.new("${name}", "${author}", "0.0.0");
  seal.ext.register(ext);
}

export {}`;
fs.writeFileSync(path.join(dir, "index.ts"),template_index.trim())

const template_config = `
const config = {
  // 扩展名
  "name": "${name}",
  // 扩展作者
  "author": ${author},
  // 项目主页
  "homepageURL": "${homepageURL}",
}

export default {
  ...config,

  // 输出文件名
  outfile: config.name+".js"
}`;
fs.writeFileSync(path.join(dir, "config.mjs"), template_config.trim())


console.log("New: ", dir);
