import {
  NodeService,
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
  UserSpaceService,
  UploadService,
  FavoriteService,
  EntityService,
} from '../'
import { NodeContentMediator } from '../content/NodeContentMediator'
import { TaskComment } from '../../database/entities/tasks/TaskComment'
import { TaskCommentService } from '../content/tasks'

export class ServiceFactory {
  private nodeService: NodeService
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
    return UserService.getInstance()
  }

  getSpaceService() {
    return SpaceService.getInstance()
  }

  getInviteService() {
    return InviteService.getInstance()
  }

  getMailService() {
    return MailService.getInstance()
  }

  getActivityService() {
    return ActivityService.getInstance()
  }

  getUserSpaceService() {
    return UserSpaceService.getInstance()
  }

  getUploadService() {
    return UploadService.getInstance()
  }

  getFavoriteService() {
    return FavoriteService.getInstance()
  }

  getEntityService() {
    return EntityService.getInstance()
  }

  private initNodeContentServices() {
    this.nodeService = NodeService.getInstance()
    this.linkService = LinkService.getInstance()
    this.docService = DocService.getInstance()
    this.embedService = EmbedService.getInstance()

    this.taskBoardService = TaskBoardService.getInstance()
    this.taskBoardService.attachActivityObserver(this.getActivityService())

    const mediator = new NodeContentMediator(this.nodeService)

    mediator.addContentService(this.linkService)
    mediator.addContentService(this.docService)
    mediator.addContentService(this.embedService)
    mediator.addContentService(this.taskBoardService)
  }
}
