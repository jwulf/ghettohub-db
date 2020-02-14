import {spawn} from 'child_process'
import path from 'path'

const exec = async (cmd: string, args: string[] = []): Promise<number> =>
  new Promise((resolve, reject) => {
    // console.log(`Started: ${cmd} ${args.join(' ')}`)
    const app = spawn(cmd, args, {stdio: 'inherit'})
    app.on('close', (code: number) => {
      if (code !== 0) {
        const err = new Error(`Invalid status code: ${code}`)
        ;(err as any).code = code
        return reject(err)
      }
      return resolve(code)
    })
    app.on('error', reject)
  })

export const commit = async (): Promise<void> => {
  await exec('bash', [path.join(__dirname, './start.sh')])
}
