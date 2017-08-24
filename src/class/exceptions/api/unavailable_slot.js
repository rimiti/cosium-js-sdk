import Exception from '../base'

export default class UnavailableSlot extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Slot to create is unavailable`
  }

}
