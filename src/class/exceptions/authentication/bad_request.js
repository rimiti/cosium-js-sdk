import Exception from '../base'

export default class AuthenticationBadRequest extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Bad authentication`
  }
}
