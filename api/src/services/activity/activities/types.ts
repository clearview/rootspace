export interface IAppActivityData {
  activityId?: number
  handler?: string
}

export interface IAppActivity {
  getType(): string
  toObject(): IAppActivityData
}
