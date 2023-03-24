import { Command } from 'commander'
import { PositionsCommand } from './PositionsCommand'
import { ArchivesSetParentNullCommand } from './ArchivesSetParentNullCommand'
import { CreateFoldersEntries } from './CreateFoldersEntries'
import { CreateContentAccess } from './CreateContentAccess'

export function nodeCommands() {
  const commands = new Command('node').description('Node related commands')

  commands
    .command('positions')
    .description('Re-set node positions')
    .action(async () => {
      await PositionsCommand.run()
    })

  commands
    .command('archives-set-parent-null')
    .description('Set archvie nodes parent to null')
    .action(async () => {
      await ArchivesSetParentNullCommand.run()
    })

  commands
    .command('create-folders-entries')
    .description('Create nodes folders table entries')
    .action(async () => {
      await CreateFoldersEntries.run()
    })

  commands
    .command('create-content-access')
    .description('Create content access table entries for nodes')
    .action(async () => {
      await CreateContentAccess.run()
    })

  return commands
}
