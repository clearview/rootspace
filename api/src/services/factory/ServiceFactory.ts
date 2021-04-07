import {
  NodeService,
  FolderService,
  LinkService,
  DocService,
  EmbedService,
  FollowService,
  TaskBoardService,
  TaskBoardTagService,
  TaskListService,
  TaskService,
  UserService,
  MailService,
  SpaceService,
  InviteService,
  ActivityService,
  NotificationService,
  UserSpaceService,
  UploadService,
  FavoriteService,
  EntityService,
  UserSettingService,
  TaskCommentService,
  ContentAccessService,
} from '../'
import { NodeContentMediator } from '../content/NodeContentMediator'

export class ServiceFactory {
  private nodeService: NodeService
  private folderService: FolderService
  private linkService: LinkService
  private docService: DocService
  private embedService: EmbedService
  private taskBoardService: TaskBoardService

  private constructor() {}

  static instance: ServiceFactory

  static getInstance() {
    if (ServiceFactory.instance) {
      return ServiceFactory.instance
    }

    return (ServiceFactory.instance = new ServiceFactory())
  }

  getNodeService() {
    if (!this.nodeService) {
      this.initNodeContentServices()
    }

    return this.nodeService
  }

  getFolderService() {
    if (!this.folderService) {
      this.initNodeContentServices()
    }

    return this.folderService
  }

  getLinkservice() {
    if (!this.linkService) {
      this.initNodeContentServices()
    }

    return this.linkService
  }

  getDocService() {
    if (!this.docService) {
      this.initNodeContentServices()
    }

    return this.docService
  }

  getEmbedService() {
    if (!this.embedService) {
      this.initNodeContentServices()
    }

    return this.embedService
  }

  getTaskBoardService() {
    if (!this.taskBoardService) {
      this.initNodeContentServices()
    }

    return this.taskBoardService
  }

  getTaskListService() {
    const service = TaskListService.getInstance()
    service.attachActivityObserver(this.getActivityService())

    return service
  }

  getTaskService() {
    const service = TaskService.getInstance()
    service.attachActivityObserver(this.getActivityService())

    return service
  }

  getTaskCommentService() {
    const service = TaskCommentService.getInstance()
    service.attachActivityObserver(this.getActivityService())

    return service
  }

  getTaskBoardTagService() {
    return TaskBoardTagService.getInstance()
  }

  getFollowService() {
    return FollowService.getInstance()
  }

  getUserService() {
    const service = UserService.getInstance()
    service.attachActivityObserver(this.getActivityService())

    return service
  }

  getUserSettingService() {
    return UserSettingService.getInstance()
  }

  getSpaceService() {
    return SpaceService.getInstance()
  }

  getInviteService() {
    const service = InviteService.getInstance()
    service.attachActivityObserver(this.getActivityService())

    return service
  }

  getMailService() {
    return MailService.getInstance()
  }

  getActivityService() {
    return ActivityService.getInstance()
  }

  getNotificationService() {
    return NotificationService.getInstance()
  }

  getUserSpaceService() {
    return UserSpaceService.getInstance()
  }

  getUploadService() {
    const service = UploadService.getInstance()
    service.attachActivityObserver(this.getActivityService())

    return service
  }

  getFavoriteService() {
    return FavoriteService.getInstance()
  }

  getEntityService() {
    return EntityService.getInstance()
  }

  getContentAccessService() {
    return ContentAccessService.getInstance()
  }

  private initNodeContentServices() {
    this.nodeService = NodeService.getInstance()
    this.nodeService.attachActivityObserver(this.getActivityService())

    this.folderService = FolderService.getInstance()
    this.folderService.attachActivityObserver(this.getActivityService())

    this.linkService = LinkService.getInstance()
    this.linkService.attachActivityObserver(this.getActivityService())

    this.embedService = EmbedService.getInstance()
    this.embedService.attachActivityObserver(this.getActivityService())

    this.docService = DocService.getInstance()
    this.docService.attachActivityObserver(this.getActivityService())
    this.docService.attachActivityObserver(this.getContentAccessService())

    this.taskBoardService = TaskBoardService.getInstance()
    this.taskBoardService.attachActivityObserver(this.getActivityService())

    const mediator = new NodeContentMediator(this.nodeService)

    mediator.addContentService(this.folderService)
    mediator.addContentService(this.linkService)
    mediator.addContentService(this.docService)
    mediator.addContentService(this.embedService)
    mediator.addContentService(this.taskBoardService)
  }
}
