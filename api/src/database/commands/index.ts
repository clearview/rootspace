import { Command } from 'commander'
import { taskCommands } from './tasks'

export function migrationCommands() {
  const commands = new Command('migration')
    .description('Migration related commands')

  commands
    .addCommand(taskCommands())

  return commands
}