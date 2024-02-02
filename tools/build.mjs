import { buildSync } from 'esbuild'
import { join } from 'path'
import { pathToFileURL } from 'url'

const name = process.argv[2]
let dir = process.cwd()
let plugin_point = ""

if (name) {
  dir = join(dir, name)
  plugin_point = join(dir,"index.ts")
} else {
  plugin_point = join(dir,"src","index.ts")
}

/**
@type {import("../config.mjs")}
 */
let { default: config } = await import(pathToFileURL(join(dir,"config.mjs")))


buildSync({
  bundle: true,
  entryPoints: [plugin_point],
  minify: true,
  outfile: join("dist",config.outfile),
  platform: "node",
  tsconfig: "./tsconfig.json",
  color: true,
  sourcemap: true,
  target: 'es6',
  treeShaking: true,
  logLevel: 'error',
})
