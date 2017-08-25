import Exception from '../base'

export default class BookingNotFound extends Exception {

  constructor(message) {
    super()
    this.name = this.constructor.name
    this.message = message || `Booking not found`
  }

}
