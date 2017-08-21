export default class Exception {

  get name() {
    return this._name
  }

  set name(value) {
    this._name = value
  }

  get message() {
    return this._message
  }

  set message(value) {
    this._message = value
  }
}
