import test from 'ava'
import sdk from '../../src/lib'
import SDK from '../../src/class/sdk'
import mock from 'fetch-mock'
import {MissingMandatoryParameter, BookingNotFound} from '../../src/class/exceptions'

let instance = {}

test.before(t => {
  sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
  instance = sdk.create()
  t.is(instance instanceof SDK, true)
})


test('Cancel appointment', t => {
  mock.restore()
  mock.post(instance.url + instance.routes.cancelAppointment, {"errorCode": null})

  return instance.cancelAppointment({
    "siteCode": "ABC",
    "bookingId": "1935472128"
  })
    .then((response) => t.deepEqual(response, {"errorCode": null}))
})

test('Delete appointment throws exception when missing mandatory request parameter', t => {
  mock.restore()
  mock.post(instance.url + instance.routes.cancelAppointment,
    {
        "errorCode": "MISSING_MANDATORY_PARAMETER",
        "errorMessage": "Missing mandatory parameter : bookingId"
    }
  )

  return instance.cancelAppointment({
    "siteCode": "ABC"
  })
    .catch(e => {
      t.is(e instanceof MissingMandatoryParameter, true)
      t.is(e.name, `MissingMandatoryParameter`)
      t.is(e.message, `Missing mandatoy parameter`)

    })

})

test('Delete appointment not existing', t => {
  mock.restore()
  mock.post(instance.url + instance.routes.cancelAppointment,
    {
        "errorCode": "BOOKING_NOT_FOUND",
        "errorMessage": "Unknown bookingId"
    }
  )

  return instance.cancelAppointment({
    "siteCode": "c1",
    "bookingId": "20"
    })
    .catch(e => {
      t.is(e instanceof BookingNotFound, true)
      t.is(e.name, `BookingNotFound`)
      t.is(e.message, `Reservation to  delete is not found`)

    })

})


// TODO: Tests are missing, you don't test your throwing errors
