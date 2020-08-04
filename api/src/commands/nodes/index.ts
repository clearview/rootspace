import { Command } from 'commander'
import { PositionsCommand } from './PositionsCommand'

export function nodeCommands() {
  const commands = new Command('node')
    .description('Node related commands')

  commands
    .command('positions')
    .description('Re-set node positions')
    .action(async () => {
      await PositionsCommand.run()
    })

  return commands
}
