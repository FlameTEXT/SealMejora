import { buildSync } from 'esbuild'
import { join } from 'path'
import { pathToFileURL } from 'url'

const name = process.argv[2]
let dir = process.cwd()
let plugin_name = ""

if (name) {
  dir = join(dir, name)
  plugin_name = join(dir,"index.ts")
} else {
  plugin_name = join(dir,"src","index.ts")
}

/**
@type {import("../config.mjs")}
 */
let { default: config } = await import(pathToFileURL(join(dir,"config.mjs")))


buildSync({
  bundle: true,
  entryPoints: [plugin_name],
  minify: true,
  outfile: join("dist",config.outfile),
  platform: "neutral",
  tsconfig: "./tsconfig.json",
  color: true,
  sourcemap: false,
  treeShaking: true,
  logLevel: 'error',
})
