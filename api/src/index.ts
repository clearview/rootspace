import Server from './server'

async function main() {
  const server = Server.getInstance()
  await server.bootstrap()
  server.listen()
}

main()
