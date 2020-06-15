import * as dotenv from 'dotenv'
dotenv.config()

// @ts-ignore
import chalk from 'chalk'
import * as yargs from 'yargs'
import { exampleCommand } from './src/commands/example'

yargs
    .command({
        command: 'example <command>',
        aliases: ['x'],
        handler: async (argv) => {
            await exampleCommand.run(argv.command)
            process.exit()
        },
        builder: (args) => args
            .positional('command', {
                alias: 'c',
                type: 'string',
                describe: 'command',
                choices: ['select', 'update'],
                demandOption: true
            })
    })
    .demandCommand(1, chalk.red('Input command before moving on!'))
    .version('1.0')
    .help()
    .argv

process.on('unhandledRejection', (reason, p) =>
    // tslint:disable-next-line:no-console
    console.log('Unhandled Rejection at: Promise ', p, reason)
)
