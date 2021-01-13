import chalk from 'chalk'
import db from '../../db'
import { getConnection, getCustomRepository } from 'typeorm'
import { SpaceRepository } from '../../database/repositories/SpaceRepository'
import { DocRepository } from '../../database/repositories/DocRepository'
import { DocRevisionRepository } from '../../database/repositories/DocRevisionRepository'
import { EmbedRepository } from '../../database/repositories/EmbedRepository'
import { FavoriteRepository } from '../../database/repositories/FavoriteRepository'
import { FolderRepository } from '../../database/repositories/FolderRepository'
import { InviteRepository } from '../../database/repositories/InviteRepository'
import { LinkRepository } from '../../database/repositories/LinkRepository'
import { NodeRepository } from '../../database/repositories/NodeRepository'
import { NotificationRepository } from '../../database/repositories/NotificationRepository'
import { UploadRepository } from '../../database/repositories/UploadRepository'
import { UserSettingRepository } from '../../database/repositories/UserSettingRepository'

export class DeleteCommand {
  static async run(id: number) {
    if (!id || !Number.isInteger(+id)) {
      throw Error('Please enter numerical space ID')
    }

    await db()

    try {
      await DeleteCommand.deleteSpace(id)
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(chalk.red('Operation failed!'))
      // tslint:disable-next-line:no-console
      console.log(e.message)
    } finally {
      await getConnection().close()
    }
  }

  private static async deleteSpace(id: number) {
    const spaceRepository = getCustomRepository(SpaceRepository)
    const space = await spaceRepository.findOne(id)

    if (space) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting space ID: ${id} - ${space.title} ...`))

      // Remove nodes properly linked through one-to-many relations
      // UserSpace, TaskBoard, TaskList, Task, TaskComment, Tag
      await spaceRepository.remove(space)
    }

    // tslint:disable-next-line:no-console
    console.log(chalk.yellow(`Deleting space ID: ${id} lingering nodes ...`))

    // Remove not properly linked nodes

    // Docs
    const docsRepository = getCustomRepository(DocRepository)
    const docs = await docsRepository.find({spaceId: id})
    if (docs) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting docs ...`))

      await docsRepository.remove(docs)
    }

    // Docs Revisions
    const docsRevisionsRepository = getCustomRepository(DocRevisionRepository)
    const docsRevisions = await docsRevisionsRepository.find({spaceId: id})
    if (docsRevisions) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting doc revisions ...`))

      await docsRevisionsRepository.remove(docsRevisions)
    }

    // Embeds
    const embedsRepository = getCustomRepository(EmbedRepository)
    const embeds = await embedsRepository.find({spaceId: id})
    if (embeds) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting embeds ...`))

      await embedsRepository.remove(embeds)
    }

    // Favorites
    const favoritesRepository = getCustomRepository(FavoriteRepository)
    const favorites = await favoritesRepository.find({spaceId: id})
    if (favorites) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting favorites ...`))

      await favoritesRepository.remove(favorites)
    }

    // Folders
    const foldersRepository = getCustomRepository(FolderRepository)
    const folders = await foldersRepository.find({spaceId: id})
    if (folders) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting folders ...`))

      await foldersRepository.remove(folders)
    }

    // Todo: Remove follows
    // There is no spaceId relation link

    // Invites
    const invitesRepository = getCustomRepository(InviteRepository)
    const invites = await invitesRepository.find({spaceId: id})
    if (invites) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting invites ...`))

      await invitesRepository.remove(invites)
    }

    // Links
    const linksRepository = getCustomRepository(LinkRepository)
    const links = await linksRepository.find({spaceId: id})
    if (links) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting links ...`))

      await linksRepository.remove(links)
    }

    // Nodes
    const nodesRepository = getCustomRepository(NodeRepository)
    const nodes = await nodesRepository.find({spaceId: id})
    if (nodes) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting nodes ...`))

      await nodesRepository.remove(nodes)
    }

    // Notifications
    const notificationsRepository = getCustomRepository(NotificationRepository)
    const notifications = await notificationsRepository.find({spaceId: id})
    if (notifications) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting notifications ...`))

      await notificationsRepository.remove(notifications)
    }

    // Uploads
    // Todo: Delete files from remote storage
    const uploadsRepository = getCustomRepository(UploadRepository)
    const uploads = await uploadsRepository.find({spaceId: id})
    if (uploads) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting uploads ...`))

      await uploadsRepository.remove(uploads)
    }

    // User Settings
    const userSettingsRepository = getCustomRepository(UserSettingRepository)
    const settings = await userSettingsRepository.find({spaceId: id})
    if (settings) {
      // tslint:disable-next-line:no-console
      console.log(chalk.yellow(`Deleting user settings ...`))

      await userSettingsRepository.remove(settings)
    }

    // tslint:disable-next-line:no-console
    console.log(chalk.green('Operation completed'))
  }
}
