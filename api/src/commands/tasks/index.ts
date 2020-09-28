import { Command } from 'commander'
import { OverdueCommand } from './OverdueCommand'

export function taskCommands() {
  const commands = new Command('task').description('Task related commands')

  commands
    .command('overdue')
    .description('Update task overdue status')
    .action(async () => {
      await OverdueCommand.run()
    })

  return commands
}
