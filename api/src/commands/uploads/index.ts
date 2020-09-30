import { Command } from 'commander'
import { FixVersionsFilename } from './FixVersionsFilename'

export function uploadCommands() {
  const commands = new Command('uploads').description('Upload related commands')

  commands
    .command('fix-versions-filename')
    .description('Fix filname on uploads veriosns')
    .action(async () => {
      await FixVersionsFilename.run()
    })

  return commands
}
