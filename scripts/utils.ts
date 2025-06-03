import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { type Options, x } from 'tinyexec'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootPath = path.resolve(__dirname, '..')
console.log(rootPath)

export const resolve = (...args: string[]) => path.resolve(rootPath, ...args)

export async function runCommand(command: string, args?: string[], options: Partial<Options> = {}) {
  await x(command, args, {
    ...options,
    nodeOptions: {
      cwd: rootPath,
      stdio: 'inherit',
      ...options.nodeOptions
    }
  })
}
