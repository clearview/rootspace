export interface IAppActivityData {
  activityId?: number
}

export interface IAppActivity {
  getType(): string
  toObject(): IAppActivityData
}
