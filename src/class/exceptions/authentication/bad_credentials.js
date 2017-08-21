import Exception from '../base'

export default class BadCredentials extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message ? message : `Bad credentials`
  }

}
