export interface FormatterInterface {
    format(): string
}

export class Formatter {
    private formatter: FormatterInterface

    constructor (strategy: FormatterInterface) {
      this.formatter = strategy
    }

    public format (): string {
      return this.formatter.format()
    }
}
