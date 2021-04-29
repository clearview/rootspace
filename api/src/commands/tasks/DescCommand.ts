import chalk from 'chalk'
import { getConnection, getCustomRepository, IsNull, Not } from 'typeorm'
import { DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'

import db from '../../db'
import { TaskRepository } from '../../database/repositories/tasks/TaskRepository'
import { Task } from '../../database/entities/tasks/Task'

// tslint:disable-next-line
const { JSDOM } = require('jsdom')

type withDBCallback = () => void | Promise<void>

async function withDB (fn: withDBCallback) {
    await db()

    try {
      await fn()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
}

const onlyHTMLDescription = (task: Task) => {
  let result = false

  try {
    JSON.parse(task.description)
  } catch (e) {
    result = true
  }

  return result
}

export class DescCommand {
  static async transform () {
    // tslint:disable-next-line:no-console
    console.log(chalk.yellow('Updating description...'))

    await withDB(async () => {
      const params = {
        where: {
          description: Not(IsNull())
        },
        withDeleted: true
      }

      const repository = getCustomRepository(TaskRepository)
      const tasks = await repository.find(params)

      const promises = tasks.filter(onlyHTMLDescription).map((task: Task) => {
        if (task.description) {
          const dom = new JSDOM(`<div>${task.description}</div>`)
          const doc = DOMParser.fromSchema(schema).parse(dom.window.document.body.firstElementChild)

          task.description = JSON.stringify(
            doc.toJSON()
          )
        } else {
          task.description = JSON.stringify({})
        }

        return getCustomRepository(TaskRepository).save(tasks, { chunk: 1000 })
      })

      await Promise.all(promises)
    })

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}