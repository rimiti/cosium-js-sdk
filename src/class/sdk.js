import Configuration from './configuration'
import {NotAuthorized, BadRequest, UnknownError} from './exceptions'
import 'isomorphic-fetch'
import Es6Promise from 'es6-promise'

Es6Promise.polyfill()

export default class SDK extends Configuration {

  constructor(config) {
    super(config)
  }

  /**
   * @description Get available timeslots between two dates
   * @param params
   * @return {*|Promise<any>|Promise.<TResult>}
   */
  getAvailableTimeslots(params) {
    this.daysBetweenTwoDates(params.startDate, params.endDate)

    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        "siteCode": params.siteCode,
        "startDate": this.checkDatetimeFormat(params.startDate),
        "endDate": this.checkDatetimeFormat(params.endDate)
      })
    }

    return fetch(this.url + this.routes.availableTimeslots, options)
      .then(response => this.checkStatus(response))
      .then(availabilities => {
        this.checkErrorCode(availabilities)
        return availabilities
      })
  }

  /**
   * @description Create appointment
   * @param params
   * @return {*|Promise<any>|Promise.<TResult>}
   */
  createAppointment(params) {
    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        "siteCode": params.siteCode,
        "date": this.checkDatetimeFormat(params.date),
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
      .then(response => this.checkStatus(response))
      .then(createdAppointement => {
        this.checkErrorCode(createdAppointement)
        return createdAppointement
      })
  }

  /**
   * @description Cancel appointment
   * @param params
   * @return {*|Promise<any>|Promise.<TResult>}
   */
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
      .then(response => this.checkStatus(response))
      .then(deletedAppointement => {
        this.checkErrorCode(deletedAppointement)
        return deletedAppointement
      })
  }
}
