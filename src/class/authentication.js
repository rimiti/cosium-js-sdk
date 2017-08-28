import {ConfigurationWrongCredentials} from './exceptions'

export default class Authentication {

  constructor(credentials) {
    this.username = credentials.username
    this.password = credentials.password
    this._checkConfiguration()
  }

  get username() {
    return this._username
  }

  set username(value) {
    this._username = value
  }

  get password() {
    return this._password
  }

  set password(value) {
    this._password = value
  }

  getAuthentication() {
    const base64 = new Buffer(`${this.username}:${this.password}`).toString('base64')
    return `Basic ${base64}`
  }

  _checkConfiguration() {
    if (!this.username || !this.password) throw new ConfigurationWrongCredentials()
  }
}
