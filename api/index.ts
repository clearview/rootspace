import { Command } from 'commander'
import { nodeCommands, spaceCommands, taskCommands, uploadCommands } from './src/commands'
import { migrationCommands } from './src/database/commands'

const program = new Command()
program
  .version('0.0.1')
  .addCommand(nodeCommands())
  .addCommand(spaceCommands())
  .addCommand(taskCommands())
  .addCommand(uploadCommands())
  .addCommand(migrationCommands())

program.parse(process.argv)
