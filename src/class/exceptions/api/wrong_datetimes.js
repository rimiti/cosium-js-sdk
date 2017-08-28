import Exception from '../base'

export default class WrongDatetimes extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `You cannot have more than 20 days between two dates`
  }

}
