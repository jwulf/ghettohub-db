const spawn = require('child_process').spawn
const path = require('path')

const exec = (cmd: string, args: string[] = []) =>
  new Promise((resolve, reject) => {
    console.log(`Started: ${cmd} ${args.join(' ')}`)
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

export const commit = async () => {
  await exec('bash', [path.join(__dirname, './start.sh')])
}
