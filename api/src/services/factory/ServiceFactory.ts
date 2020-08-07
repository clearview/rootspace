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
  UserSpaceService
} from '../'
import { NodeContentMediator } from '../content/NodeContentMediator'

export class ServiceFactory {
  private nodeService: NodeService
  private linkService: LinkService
  private docService: DocService
  private embedService: EmbedService
  private taskBoardService: TaskBoardService
  private taskBoardTagService: TaskBoardTagService
  private taskListService: TaskListService
  private taskService: TaskService
  private followService: FollowService
  private userService: UserService
  private mailService: MailService
  private spaceService: SpaceService
  private inviteService: InviteService
  private activityService: ActivityService
  private userSpaceService: UserSpaceService

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

  getFollowService() {
    if (!this.followService) {
      this.initNodeContentServices()
    }

    return this.followService
  }

  getTaskBoardService() {
    if (!this.taskBoardService) {
      this.initNodeContentServices()
    }

    return this.taskBoardService
  }

  getTaskBoardTagService() {
    if (!this.taskBoardTagService) {
      this.initNodeContentServices()
    }

    return this.taskBoardTagService
  }

  getTaskListService() {
    if (!this.taskListService) {
      this.initNodeContentServices()
    }

    return this.taskListService
  }

  getTaskService() {
    if (!this.taskService) {
      this.initNodeContentServices()
    }

    return this.taskService
  }

  getUserService() {
    if (!this.userService) {
      this.initNodeContentServices()
    }

    return this.userService
  }

  getSpaceService() {
    if (!this.spaceService) {
      this.initNodeContentServices()
    }

    return this.spaceService
  }

  getInviteService() {
    if (!this.inviteService) {
      this.initNodeContentServices()
    }

    return this.inviteService
  }

  getMailService() {
    if (!this.mailService) {
      this.initNodeContentServices()
    }

    return this.mailService
  }

  getActivityService() {
    if (!this.activityService) {
      this.initNodeContentServices()
    }

    return this.activityService
  }

  getUserSpaceService() {
    if (!this.userSpaceService) {
      this.initNodeContentServices()
    }

    return this.userSpaceService
  }

  private initNodeContentServices() {
    this.nodeService = NodeService.getInstance()
    this.linkService = LinkService.getInstance()
    this.docService = DocService.getInstance()
    this.embedService = EmbedService.getInstance()
    this.followService = FollowService.getInstance()
    this.taskBoardService = TaskBoardService.getInstance()
    this.taskBoardTagService = TaskBoardTagService.getInstance()
    this.taskListService = TaskListService.getInstance()
    this.taskService = TaskService.getInstance()
    this.userService = UserService.getInstance()
    this.spaceService = SpaceService.getInstance()
    this.inviteService = InviteService.getInstance()
    this.mailService = MailService.getInstance()
    this.activityService = ActivityService.getInstance()
    this.userSpaceService = UserSpaceService.getInstance()

    const mediator = new NodeContentMediator(this.nodeService)

    mediator.addContentService(this.linkService)
    mediator.addContentService(this.docService)
    mediator.addContentService(this.embedService)
    mediator.addContentService(this.taskBoardService)
  }
}
