export interface IActivityHandler {
  process(): Promise<void>
}
