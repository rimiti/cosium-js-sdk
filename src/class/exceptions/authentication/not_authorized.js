import Exception from '../base'

export default class NotAuthorized extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Not authorized`
  }
}
