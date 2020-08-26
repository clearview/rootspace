import { Command } from 'commander'
import { SlugCommand } from './SlugCommand'
import { BoardIdCommand } from './BoardIdCommand'

export function taskCommands() {
  const commands = new Command('task')
    .description('Task related commands')

  commands
    .command('slugs')
    .description('Update task slugs')
    .action(async () => {
      await SlugCommand.run()
    })

  commands
    .command('boardIds')
    .description('Update task board IDs')
    .action(async () => {
      await BoardIdCommand.run()
    })

  return commands
}
