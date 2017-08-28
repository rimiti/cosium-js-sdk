import Exception from '../base'

export default class UnknownCategoryCode extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `category in request param is unknown`
  }

}
