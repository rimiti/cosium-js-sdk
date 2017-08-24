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
   */
  datetimeFormat(datetime) {
    if (!moment(datetime, moment.ISO_8601, true).isValid()) {
      throw new InvalidDatetimeFormat()
    }
  }

  /**
   * @description Check if there is an error in body
   * @param response
   */
  errorCode(response) {
    if (response.errorCode === 'MISSING_MANDATORY_PARAMETER') throw new MissingMandatoryParameter(response.errorMessage)
    else if (response.errorCode === 'UNKNOWN_CATEGORY_CODE') throw new UnknownCategoryCode(response.errorMessage)
    else if (response.errorCode === 'UNAVAILABLE_SLOT') throw new UnavailableSlot(response.errorMessage)
    else if (response.errorCode === 'BOOKING_NOT_FOUND') throw new BookingNotFound(response.errorMessage)
    else if (response.errorCode !== null) throw new UnknownError(response.errorMessage)
  }

  /**
   * @description Check htt code status
   * @param response
   * @return {*}
   */
  httpStatus(response) {
    if (response.status === 200) return response.json()
    else if (response.status === 401) throw new NotAuthorized()
    else if (response.status === 400) throw new BadRequest()
    else throw new UnknownError(response)
  }

  /**
   * @description Validate params mandatory attribute
   * @param params
   */
  validateGetAvailableTimeslots(params) {
    let errors = []
    if (!params.siteCode) errors.push('siteCode')
    if (!params.startDate) errors.push('startDate')
    if (!params.endDate) errors.push('endDate')
    if (errors.length) throw new MissingParameter(`Parameter(s) ${JSON.stringify(errors)} missing`)
  }

  /**
   * @description Validate params mandatory attribute
   * @param params
   */
  validateCreateAppointment(params) {
    let errors = []
    if (!params.siteCode) errors.push('siteCode')
    if (!params.date) errors.push('date')
    if (!params.object) errors.push('object')
    if (!params.category) errors.push('category')
    if (!params.customer) errors.push('customer')
    if (!params.customer && !params.customer.firstname) errors.push('customer.firstname')
    if (!params.customer && !params.customer.lastname) errors.push('customer.lastname')
    if (errors.length) throw new MissingParameter(`Parameter(s) ${JSON.stringify(errors)} missing`)
  }

  /**
   * @description Validate params mandatory attribute
   * @param params
   */
  validateCancelAppointment(params) {
    let errors = []
    if (!params.siteCode) errors.push('siteCode')
    if (!params.bookingId) errors.push('bookingId')
    if (errors.length) throw new MissingParameter(`Parameter(s) ${JSON.stringify(errors)} missing`)
  }

}
