import { Command } from 'commander'
import { nodeCommands, taskCommands, uploadCommands } from './src/commands'
import { migrationCommands } from './src/database/commands'

const program = new Command()
program
  .version('0.0.1')
  .addCommand(nodeCommands())
  .addCommand(taskCommands())
  .addCommand(uploadCommands())
  .addCommand(migrationCommands())

program.parse(process.argv)
