import { Command } from 'commander'
import { SlugCommand } from './SlugCommand'

export function taskCommands() {
  const commands = new Command('task')
    .description('Task related commands')

  commands
    .command('slugs')
    .description('Update task slugs')
    .action(async () => {
      await SlugCommand.run()
    })

  return commands
}
