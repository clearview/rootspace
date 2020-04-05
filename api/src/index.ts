import Server from './server'

async function main () {
  const server = new Server()
  await server.bootstrap()
  server.listen()
}

main()
