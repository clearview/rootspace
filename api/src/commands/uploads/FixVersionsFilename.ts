import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { UploadRepository } from '../../database/repositories/UploadRepository'

export class FixVersionsFilename {
  static async run() {
    await db()

    try {
      await FixVersionsFilename.execute()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async execute() {
    // tslint:disable-next-line:no-console
    console.log(chalk.bold.yellow('Fix versions filename...'))

    const uploads = await getCustomRepository(UploadRepository)
      .createQueryBuilder('upload')
      .where('upload.versions IS NOT NULL')
      .getMany()

    for (const upload of uploads) {
      // tslint:disable-next-line:no-console
      console.log(chalk.cyanBright.bold('Processing uplaod id ' + upload.id))

      // tslint:disable-next-line:no-console
      console.log(chalk.green('Upload versions:'))
      // tslint:disable-next-line:no-console
      console.log(upload.versions)

      for (const name in upload.versions) {
        if (upload.versions.hasOwnProperty(name)) {
          const version: any = upload.versions[name]
          version.filename = version.location.split('/').pop()
        }
      }

      // tslint:disable-next-line:no-console
      console.log(chalk.green('Processed upload versions'))
      // tslint:disable-next-line:no-console
      console.log(upload.versions)

      await getCustomRepository(UploadRepository).save(upload)
    }
  }
}
