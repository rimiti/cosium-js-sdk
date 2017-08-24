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
  checkDatetimeFormat(datetime) {
    if (!moment(datetime, moment.ISO_8601, true).isValid()) {
      throw new InvalidDatetimeFormat()
    }
  }

  /**
   * @description Check if there is an error in body
   * @param response
   */
  checkErrorCode(response) {
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
  checkStatus(response) {
    if (response.status === 200) return response.json()
    else if (response.status === 401) throw new NotAuthorized()
    else if (response.status === 400) throw new BadRequest()
    else throw new UnknownError(response)
  }
}
