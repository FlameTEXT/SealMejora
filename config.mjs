const config = {
  // 扩展名
  "name": "two_sum",
  // 扩展作者
  "author": "nao",
  // 项目主页
  "homepageURL": "https://github.com/f44r/SealMejora",
  "description": "两数之和",
  "license": "MIT",
  "depends": [],
  "sealVersion": "1.4.5",
  "version": "0.0.0"
}

export default {
  ...config,

  // 输出文件名
  outfile: config.name + ".js"
}
