import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { UploadRepository } from '../../database/repositories/UploadRepository'

export class V3MigrationCommand {
  static async run() {
    await db()

    try {
      await V3MigrationCommand.migrate()
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async migrate() {
    // tslint:disable-next-line:no-console
    console.log(chalk.bold.yellow('Uploads v3 migration...'))

    const uploads = await getCustomRepository(UploadRepository)
      .createQueryBuilder('upload')
      .where('upload.filename IS NULL')
      .getMany()

    for (const upload of uploads) {
      // tslint:disable-next-line:no-console
      console.log(chalk.green('Processing uplaod id ' + upload.id))

      upload.filename = upload.location.split('/').pop()

      // tslint:disable-next-line:no-console
      console.log(chalk.green('Extracted filename ' + upload.filename))

      for (const name in upload.versions) {
        if (upload.versions.hasOwnProperty(name)) {
          // tslint:disable-next-line:no-console
          console.log(chalk.green('Processing version ' + name))

          const version: any = upload.versions[name]

          if (!version.path) {
            // tslint:disable-next-line:no-console
            console.log(chalk.red('No path property, continue'))
            continue
          }

          version.location = version.path
          version.filename = upload.location.split('/').pop()

          delete version.path

          // tslint:disable-next-line:no-console
          console.log(chalk.green('Version:'))
          // tslint:disable-next-line:no-console
          console.log(version)
        }
      }

      await getCustomRepository(UploadRepository).save(upload)
    }
  }
}
