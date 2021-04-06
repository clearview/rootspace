export class ResponseData {
  private _data: object | object[] | string

  constructor(input: object | object[] | string) {
    this._data = this.buildData(input)
  }

  getData(): object | object[] | string {
    return {
      data: this._data,
    }
  }

  private buildData(input: object | object[] | string): object | object[] | string {
    if (!Array.isArray(input)) {
      return input
    }

    const result: object[] = []

    input.forEach((value) => {
      result.push(value)
    })

    return result
  }
}
