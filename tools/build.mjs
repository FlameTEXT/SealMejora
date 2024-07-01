import { log } from 'console'
import { buildSync } from 'esbuild'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { readFileSync, writeFileSync } from 'fs'

const name = process.argv[2]
let dir = process.cwd()
let plugin_name = ""
let config_path = ""
if (name == "") {
  dir = join(dir, name)
  plugin_name = join(dir, "src", "index.ts")
  config_path = pathToFileURL(join(dir, "config.mjs"))
} else {
  plugin_name = join(dir, "src", name, "index.ts")
  config_path = pathToFileURL(join(dir, "src", name, "config.mjs"))
}

/**
@type {import("../config.mjs")}
 */
let { default: config } = await import(config_path)

log(plugin_name, '\n', config)

const outfile_path = join(dir, "dist", config.outfile)

buildSync({
  bundle: true,
  entryPoints: [plugin_name],
  minify: true,
  outfile: outfile_path,
  platform: "neutral",
  tsconfig: "./tsconfig.json",
  color: true,
  sourcemap: false,
  treeShaking: true,
  logLevel: 'error',
  mainFields: ["module"]
})

const code = readFileSync(outfile_path)
let header_text = `// ==UserScript==
// @name         ${config.name}
// @author       ${config.author}
// @version      ${config.version}
// @description  ${config.description}
// @timestamp    ${Math.ceil(Date.now() / 1000)}
// @license      ${config.license}
// @homepageURL  ${config.homepageURL}
// @sealVersion  ${config.sealVersion}
`

if (config.depends) {
  config.depends.forEach(v =>
    header_text += "// @depends " + v + "\n"
  )
}

header_text += "// ==/UserScript==\n"

writeFileSync(outfile_path, header_text + code)
