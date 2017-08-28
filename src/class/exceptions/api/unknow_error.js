import Exception from '../base'

export default class UnknownError extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Unknown error`
  }

}
