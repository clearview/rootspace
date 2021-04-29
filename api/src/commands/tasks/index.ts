import { Command } from 'commander'
import { OverdueCommand } from './OverdueCommand'
import { DescCommand } from './DescCommand'

export function taskCommands() {
  const commands = new Command('task').description('Task related commands')

  commands
    .command('overdue')
    .description('Update task overdue status')
    .action(async () => {
      await OverdueCommand.run()
    })

  commands
    .command('desc:transform')
    .description('Format description field')
    .action(async () => {
      await DescCommand.transform()
    })

  return commands
}
