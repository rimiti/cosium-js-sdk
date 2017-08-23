import Exception from '../base'

export default class MissingMandatoryParameter extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Missing request parameter`
  }

}
