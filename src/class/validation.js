import moment from 'moment'
import {
  UnknownError,
  MissingMandatoryParameter,
  WrongDatetimes,
  WrongDatetimeValues,
  UnknownCategoryCode,
  UnavailableSlot,
  BookingNotFound,
  InvalidDatetimeFormat,
  NotAuthorized,
  BadRequest
} from './exceptions'

export default class Validation {

  /**
   * @description Check if there is an error in body
   * @param response
   * @return {Promise}
   */
  errorCode(response) {
    return new Promise(resolve => {
      if (response.errorCode === 'MISSING_MANDATORY_PARAMETER') throw new MissingMandatoryParameter(response.errorMessage)
      else if (response.errorCode === 'UNKNOWN_CATEGORY_CODE') throw new UnknownCategoryCode(response.errorMessage)
      else if (response.errorCode === 'UNAVAILABLE_SLOT') throw new UnavailableSlot(response.errorMessage)
      else if (response.errorCode === 'BOOKING_NOT_FOUND') throw new BookingNotFound(response.errorMessage)
      else if (response.errorCode !== null) throw new UnknownError(response.errorMessage)
      return resolve(response)
    })
  }

  /**
   * @description Check htt code status
   * @param response
   * @return {Promise}
   */
  httpStatus(response) {
    return new Promise(resolve => {
      if (response.status === 200) return resolve(response.json())
      else if (response.status === 401) throw new NotAuthorized()
      else if (response.status === 400) throw new BadRequest()
    })
  }

  /**
   * @description Validate params mandatory attribute
   * @param params
   * @return {Promise}
   */
  validateGetAvailableTimeslots(params) {
    return new Promise((resolve) => {
      let errors = []
      if (!params.siteCode) errors.push('siteCode')
      if (!params.startDate) errors.push('startDate')
      if (!params.endDate) errors.push('endDate')
      if (errors.length) throw new MissingMandatoryParameter(`Parameter(s) ${JSON.stringify(errors)} missing`)
      if (!this._datetimeFormat(params.startDate)) throw new InvalidDatetimeFormat()
      if (!this._datetimeFormat(params.endDate)) throw new InvalidDatetimeFormat()

      const days = this._daysBetweenTwoDates(params.startDate, params.endDate)
      if (days > 20) throw new WrongDatetimes()
      if (days < 0) throw new WrongDatetimeValues()
      return resolve(true)
    })
  }

  /**
   * @description Validate params mandatory attribute
   * @param params
   * @return {Promise}
   */
  validateCreateAppointment(params) {
    return new Promise((resolve) => {
      let errors = []
      if (!params.siteCode) errors.push('siteCode')
      if (!params.date) errors.push('date')
      if (!params.object) errors.push('object')
      if (!params.category) errors.push('category')
      if (!params.customer) errors.push('customer')
      if (!params.customer && !params.customer.firstname) errors.push('customer.firstname')
      if (!params.customer && !params.customer.lastname) errors.push('customer.lastname')
      if (errors.length) throw new MissingMandatoryParameter(`Parameter(s) ${JSON.stringify(errors)} missing`)
      if (!this._datetimeFormat(params.date)) throw new InvalidDatetimeFormat()
      return resolve(true)
    })
  }

  /**
   * @description Validate params mandatory attribute
   * @param params
   * @return {Promise}
   */
  validateCancelAppointment(params) {
    return new Promise((resolve) => {
      let errors = []
      if (!params.siteCode) errors.push('siteCode')
      if (!params.bookingId) errors.push('bookingId')
      if (errors.length) throw new MissingMandatoryParameter(`Parameter(s) ${JSON.stringify(errors)} missing`)
      return resolve(true)
    })
  }

  /**
   * @description Check number of days between two dates
   * @param start
   * @param end
   * @return {number}
   * @private
   */
  _daysBetweenTwoDates(start, end) {
    return moment(end).diff(moment(start), 'days')
  }

  /**
   * @description Check datetime format
   * @param datetime
   * @return {boolean}
   * @private
   */
  _datetimeFormat(datetime) {
    return moment(datetime, moment.ISO_8601, true).isValid()
  }

}
