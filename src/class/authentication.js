export default class Authentication {

  constructor(credentials) {
    this._username = credentials.username
    this._password = credentials.password
  }

  get username() {
    return this._username;
  }

  set username(value) {
    this._username = value;
  }

  get password() {
    return this._password;
  }

  set password(value) {
    this._password = value;
  }
}
