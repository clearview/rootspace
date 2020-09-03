import { Command } from 'commander'

import { UploadsRelations } from './UploadsRelations'

export function taskCommands() {
  const commands = new Command('task').description('Task related commands')

  commands
    .command('uploads-relations')
    .description('Update task attachments uplaods')
    .action(async () => {
      await UploadsRelations.run()
    })

  return commands
}
