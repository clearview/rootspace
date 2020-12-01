import Server from './server'
import YjsServer from './yjs/server'

async function main() {
  const server = new Server()
  await server.bootstrap()
  server.listen()

  const yjsServer = new YjsServer()
  yjsServer.listen()
}

main()
