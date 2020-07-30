import { QueueCommands } from './commands/QueueCommands'

async function main() {
  const queueCommand = new QueueCommands()
  await queueCommand.run('start')
}

main()
