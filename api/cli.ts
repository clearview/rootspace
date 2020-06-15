import * as dotenv from 'dotenv'
dotenv.config()

// @ts-ignore
import chalk from 'chalk'
import yargs = require('yargs')
import { LinksCommand } from './src/commands/LinksCommand'

yargs
  .command({
    command: 'links <command>',
    aliases: ['x'],
    handler: async (argv) => {
      await new LinksCommand().run(String(argv.command))
      process.exit()
    },
    builder: (args) =>
      args.positional('command', {
        alias: 'c',
        type: 'string',
        describe: 'command',
        choices: ['normalize-positions'],
        demandOption: true,
      }),
  })
  .demandCommand(1, chalk.red('Input command before moving on!'))
  .version('1.0')
  .help().argv

process.on('unhandledRejection', (reason, p) =>
  // tslint:disable-next-line:no-console
  console.log('Unhandled Rejection at: Promise ', p, reason)
)
