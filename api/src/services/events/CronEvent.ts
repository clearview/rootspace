export class CronEvent {
  private readonly _className: string
  private _method: string
  private _args: object

  private constructor(className: string) {
    this._className = className
  }

  public static forClass(className: string): CronEvent {
    return new CronEvent(className)
  }

  runMethod(method: string): CronEvent {
    this._method = method
    return this
  }

  withArgs(args: any): CronEvent {
    this._args = args
    return this
  }

  get className(): string {
    return this._className
  }

  get method(): string {
    return this._method
  }

  set method(method: string) {
    this._method = method
  }

  get args(): any {
    return this._args
  }

  set args(args: any) {
    this._args = args
  }

  toObject(): object {
    return {
      className: this.className,
      method: this.method,
      args: this.args
    }
  }
}