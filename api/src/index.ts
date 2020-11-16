import Server from './server'
import YjsServer from './YjsServer'

async function main() {
  const server = new Server()
  await server.bootstrap()
  server.listen()

  //const yjsServer = new YjsServer()
  //yjsServer.listen()
}

main()
