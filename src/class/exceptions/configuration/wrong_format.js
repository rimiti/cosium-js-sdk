import Exception from '../base'

export default class ConfigurationWrongFormat extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Only "json" format can be set`
  }

}
