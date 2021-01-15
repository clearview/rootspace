import { Command } from 'commander'
import { DeleteCommand } from './DeleteCommand'

export function spaceCommands() {
  const commands = new Command('space').description('Space related commands')

  commands
    .command('delete <id>')
    .description('Delete space and all related nodes')
    .action(async (argv) => {
      await DeleteCommand.run(argv)
    })

  return commands
}
