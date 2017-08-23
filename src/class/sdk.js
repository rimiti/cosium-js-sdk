import Configuration from './configuration'
import 'isomorphic-fetch'
import Es6Promise from 'es6-promise'
import moment from 'moment'
Es6Promise.polyfill()

export default class SDK extends Configuration {

  constructor(config) {
    super(config)
  }

  getAvailableTimeslots(params) {

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
        return response.json()
      })
      .then(availabilities => availabilities)
  }

  createAppointment(params) {

    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        "siteCode": params.siteCode,
        "date": params.startDate,
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
        if (response.status >= 400) throw new Error("createAppointment: Bad response from server")
        return response.json()
      })
      .then(createdAppointement => createdAppointement)

  }

  cancelAppointment() {

  }

  _daysBetweenTwoDates(start, end) {
    //
    // const  = moment(start)
    // const  = moment(end)
    // a.diff(b, 'years');

  }

}
