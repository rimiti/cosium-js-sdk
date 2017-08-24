import Configuration from './configuration'
import {MissingMandatoryParameter, WrongDatetimes, WrongDatetimeValues, UnknownCategoryCode, UnavailableSlot} from './exceptions'
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
        "startDate": params.startDate,
        "endDate": params.endDate
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
        "date": params.startDate, // TODO: Check datetime format with his own private method
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

  _datetimeFormat(datetime) {
    // TODO: If format is not compliant, thrown a custom error
  }

  /**
   * @description Check if there is an error in body
   * @param response
   * @private
   */
  _checkErrorCode(response) {
    if (response.errorCode === 'MISSING_MANDATORY_PARAMETER') throw new MissingMandatoryParameter()
    if (response.errorCode === 'UNKNOWN_CATEGORY_CODE') throw new UnknownCategoryCode()
    if(response.errorCode === 'UNAVAILABLE_SLOT') throw new UnavailableSlot()
  }

}
