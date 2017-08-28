import Exception from '../base'

export default class MissingParameter extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Mandatory parameters missing`
  }
}
