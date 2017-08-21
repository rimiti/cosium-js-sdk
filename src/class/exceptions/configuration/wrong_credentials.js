import Exception from '../base'

export default class ConfigurationWrongCredentials extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Wrong credentials configuration`
  }
}
