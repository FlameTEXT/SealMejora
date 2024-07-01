const config = {
  // 扩展名
  "name": "ark-guess",
  // 扩展作者
  "author": 'nao',
  // 项目主页
  "homepageURL": "https://github.com/sealdice/javascript",
  "description": "明日方舟猜角色。关键词：方舟猜干员、不猜方舟干员了。发送关键词后直接发送干员名字即可。",
  "license": "MIT",
  "sealVersion": "1.4.5",
  "version": "0.0.0"
}

export default {
  ...config,

  // 输出文件名
  outfile: config.name+".js"
}
