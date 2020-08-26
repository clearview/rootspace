import { Command } from 'commander'
import { BoardIdCommand } from './BoardIdCommand'
import { SlugCommand } from './SlugCommand'

export function taskCommands() {
  const commands = new Command('task')
    .description('Task migrations commands')

  commands
    .command('slugs')
    .description('Update task slugs')
    .action(async () => {
      await SlugCommand.run()
    })

    .command('boardIds')
    .description('Update task board IDs')
    .action(async () => {
      await BoardIdCommand.run()
    })

  return commands
}
