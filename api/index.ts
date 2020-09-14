import { Command } from 'commander'
import { nodeCommands, taskCommands } from './src/commands'
import { migrationCommands } from './src/database/commands'

const program = new Command()
program
  .version('0.0.1')
  .addCommand(nodeCommands())
  .addCommand(taskCommands())
  .addCommand(migrationCommands())

program.parse(process.argv)
