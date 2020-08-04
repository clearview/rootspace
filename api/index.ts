import { Command } from 'commander'
import { nodeCommands } from './src/commands'
import { taskCommands } from './src/commands'

const program = new Command()
program
  .version('0.0.1')
  .addCommand(nodeCommands())
  .addCommand(taskCommands())

program.parse(process.argv)