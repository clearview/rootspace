import { Command } from 'commander'
import { nodeCommands } from './src/commands'
import { migrationCommands } from './src/database/migrations/commands'

const program = new Command()
program
  .version('0.0.1')
  .addCommand(nodeCommands())
  .addCommand(migrationCommands())

program.parse(process.argv)