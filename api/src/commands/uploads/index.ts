import { Command } from 'commander'
import { V3MigrationCommand } from './V3MigrationCommand'

export function uploadCommands() {
  const commands = new Command('uploads').description('Upload related commands')

  commands
    .command('v3-migration')
    .description('Rename path to location and add filename')
    .action(async () => {
      await V3MigrationCommand.run()
    })

  return commands
}
