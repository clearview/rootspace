import * as dotenv from 'dotenv'
dotenv.config()

// @ts-ignore
import chalk from 'chalk'
import yargs = require('yargs')
import { NodeCommand } from './src/commands/NodeCommand'
import { TaskCommands } from './src/commands/TaskCommands'

const commands = yargs
    .command({
        command: 'node <command>',
        aliases: ['n'],
        handler: async (argv) => {
            await new NodeCommand().run(String(argv.command))
            process.exit()
        },
        builder: (args) =>
            args.positional('command', {
                alias: 'n',
                type: 'string',
                describe: 'command',
                choices: ['normalize-positions'],
                demandOption: true
            })
    })
    .command({
        command: 'tasks <command>',
        aliases: ['t'],
        handler: async (argv) => {
            await new TaskCommands().run(String(argv.command))
            process.exit()
        },
        builder: (args) =>
            args.positional('command', {
                alias: 't',
                type: 'string',
                describe: 'command',
                choices: ['update-slugs'],
                demandOption: true
            })
    })
    .demandCommand(1, chalk.red('Input command before moving on!'))
    .help()
    .wrap(72)
    .recommendCommands()
    .argv

process.on('unhandledRejection', (reason, p) =>
  // tslint:disable-next-line:no-console
  console.log('Unhandled Rejection at: Promise ', p, reason)
)
