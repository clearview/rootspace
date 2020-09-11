import { Command } from 'commander'
import { OverdueCommand } from './OverdueCommand'
import { UploadsRelations } from './UploadsRelations'

export function taskCommands() {
  const commands = new Command('task').description('Task related commands')

  commands
    .command('overdue')
    .description('Update task overdue status')
    .action(async () => {
      await OverdueCommand.run()
    })

  commands.command('uploads-relations')
    .description('Update task attachments uploads')
    .action(async () => {
      await UploadsRelations.run()
    })

  return commands
}
