import Exception from '../base'

export default class WrongDatetimeValues extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Start datetime is greater than end datetime`
  }

}
