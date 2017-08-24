import Configuration from './configuration'
import {MissingMandatoryParameter, WrongDatetimes} from './exceptions'
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
        this._check_error_code(response.body)
        return response.json()
      }).then(availabilities => {
        this._check_error_code(availabilities)
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
      .then(createdAppointement => createdAppointement)
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
  }

  daysBetweenTwoDates(start, end) {
    if (moment(start).diff(moment(end), 'days') >= 20) throw new WrongDatetimes()
  }

  _datetimeFormat(datetime) {
    // TODO: If format is not compliant, thrown a custom error
  }

  _check_error_code(response) {
    if (response.errorCode === 'MISSING_MANDATORY_PARAMETER') throw new MissingMandatoryParameter()
  }

}
