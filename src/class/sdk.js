import Configuration from './configuration'
import {
  UnknownError,
  MissingMandatoryParameter,
  WrongDatetimes,
  WrongDatetimeValues,
  UnknownCategoryCode,
  UnavailableSlot,
  BookingNotFound,
  InvalidDatetimeFormat
} from './exceptions'
import 'isomorphic-fetch'
import Es6Promise from 'es6-promise'
import moment from 'moment'

Es6Promise.polyfill()

export default class SDK extends Configuration {

  constructor(config) {
    super(config)
  }

  getAvailableTimeslots(params) {
    this.daysBetweenTwoDates(params.startDate, params.endDate)

    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        "siteCode": params.siteCode,
        "startDate": this._checkDatetimeFormat(params.startDate),
        "endDate": this._checkDatetimeFormat(params.endDate)
      })
    }

    return fetch(this.url + this.routes.availableTimeslots, options)
      .then(response => {
        if (response.status >= 400) throw new Error("getAvailableTimeslots: Bad response from server")
        this._checkErrorCode(response.body)
        return response.json()
      }).then(availabilities => {
        this._checkErrorCode(availabilities)
        return availabilities
      })
  }

  createAppointment(params) {
    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        "siteCode": params.siteCode,
        "date": this._checkDatetimeFormat(params.startDate),
        "object": params.endDate,
        "category": params.category,
        "description": params.description,
        "timeslotDurationInMinutes": params.timeslotDurationInMinutes,
        "customer": {
          "firstname": params.customer.firstname,
          "lastname": params.customer.lastname,
          "email": params.customer.email,
          "phone": params.customer.phone
        }
      })
    }

    return fetch(this.url + this.routes.createAppointment, options)
      .then(response => {
        // TODO: Throw a custom error
        if (response.status >= 400) throw new Error("createAppointment: Bad response from server")
        return response.json()
      })
      .then(createdAppointement => {
        this._checkErrorCode(createdAppointement)
        return createdAppointement
      })
  }

  cancelAppointment(params) {
    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        "siteCode": params.siteCode,
        "bookingId": params.bookingId
      })
    }

    return fetch(this.url + this.routes.cancelAppointment, options)
      .then(response => {
        // TODO: Throw a custom error
        if (response.status >= 400) throw new Error("cancelAppointment: Bad response from server")
        return response.json()
      })
      .then(deletedAppointement => {
        this._checkErrorCode(deletedAppointement)
        return deletedAppointement
      })
  }

  /**
   * @description Check number of days between two dates
   * @param start
   * @param end
   */
  daysBetweenTwoDates(start, end) {
    const days = moment(start).diff(moment(end), 'days')
    if (days < 0) throw new WrongDatetimeValues()
    if (Math.abs(days) >= 20) throw new WrongDatetimes()
  }

  /**
   * @description Check datetime format
   * @param datetime
   * @private
   */
  _checkDatetimeFormat(datetime) {
    if (!moment(datetime, 'YYYY-MM-DD HH:mm:ss', true).isValid()) throw new InvalidDatetimeFormat()
  }

  /**
   * @description Check if there is an error in body
   * @param response
   * @private
   */
  _checkErrorCode(response) {
    if (response.errorCode === 'MISSING_MANDATORY_PARAMETER') throw new MissingMandatoryParameter(response.errorMessage)
    else if (response.errorCode === 'UNKNOWN_CATEGORY_CODE') throw new UnknownCategoryCode(response.errorMessage)
    else if (response.errorCode === 'UNAVAILABLE_SLOT') throw new UnavailableSlot(response.errorMessage)
    else if (response.errorCode === 'BOOKING_NOT_FOUND') throw new BookingNotFound(response.errorMessage)
    else if (response.errorCode !== 'null') throw new UnknownError(response.errorMessage)
  }

}
