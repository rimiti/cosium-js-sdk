import AuthenticationBadRequest from './authentication/bad_request'
import ConfigurationWrongCredentials from './configuration/wrong_credentials'
import ConfigurationWrongFormat from './configuration/wrong_format'
import MissingMandatoryParameter from './api/missing_mandatory_parameter'
import WrongDatetimeValues from './api/wrong_datetime_values'
import WrongDatetimes from './api/wrong_datetimes'
import UnknownCategoryCode from './api/unknown_category_code'
import UnknownError from './api/unknow_error'
import UnavailableSlot from './api/unavailable_slot'
import BookingNotFound from './api/booking_not_found'

export {
  AuthenticationBadRequest,
  ConfigurationWrongFormat,
  ConfigurationWrongCredentials,
  MissingMandatoryParameter,
  WrongDatetimeValues,
  WrongDatetimes,
  UnknownCategoryCode,
  UnavailableSlot,
  UnknownError
  UnavailableSlot,
  BookingNotFound
}
