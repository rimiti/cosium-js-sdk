import Configuration from './configuration'
import {} from './exceptions'
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
      .then(response => {
        if (response.status >= 400) throw new Error("getAvailableTimeslots: Bad response from server")
        this.checkErrorCode(response.body)
        return response.json()
      })
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
        "date": this.checkDatetimeFormat(params.startDate),
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
      .then(response => {
        // TODO: Throw a custom error
        if (response.status >= 400) throw new Error("cancelAppointment: Bad response from server")
        return response.json()
      })
      .then(deletedAppointement => {
        this.checkErrorCode(deletedAppointement)
        return deletedAppointement
      })
  }
}
