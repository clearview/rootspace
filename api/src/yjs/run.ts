import YjsServer from './server'
import db from '../db'

async function main() {
  await db()

  const yjsServer = new YjsServer()
  yjsServer.listen()
}

main()
