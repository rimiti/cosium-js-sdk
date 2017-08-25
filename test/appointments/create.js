import test from 'ava'
import sdk from '../../src/lib'
import SDK from '../../src/class/sdk'
import mock from 'fetch-mock'
import {UnknownCategoryCode, UnavailableSlot, MissingMandatoryParameter} from '../../src/class/exceptions/index'

let instance = {}

test.before(t => {
  sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
  instance = sdk.create()
  t.is(instance instanceof SDK, true)
})

test('Create appointment', t => {
  return new Promise(resolve => {
    mock.post(instance.url + instance.routes.createAppointment, {"errorCode": null, "bookingId": "1935472128"})
    return instance.createAppointment({
      "siteCode": "c1",
      "object": "subject",
      "description": "my description",
      "qualification": "HEARING_AID",
      "category": "consultation1",
      "date": "2017-08-24T15:30:25+02:00",
      "customer": {
        "firstname": "Jean",
        "lastname": "Dupont",
        "email": "jean.dupont@gmail.com"
      }
    })
      .then((response) => {
        t.deepEqual(response, {"errorCode": null, "bookingId": "1935472128"})
        return resolve()
      })
      .then(() => { // Create appointment throws exception when missing mandatory request parameter
        mock.restore()
        mock.post(instance.url + instance.routes.createAppointment, {
          "errorCode": "MISSING_MANDATORY_PARAMETER",
          "errorMessage": "Missing mandatory parameter : category",
          "bookingId": 0
        })

        return instance.createAppointment({
          "siteCode": "c1",
          "description": "my description",
          "qualification": "HEARING_AID",
          "date": "2017-08-24T15:30:25+02:00",
          "customer": {
            "firstname": "Jean",
            "lastname": "Dupont",
            "email": "jean.dupont@gmail.com"
          }
        })
          .catch(e => {
            t.is(e instanceof MissingMandatoryParameter, true)
            t.is(e.name, `MissingMandatoryParameter`)
            t.is(e.message, `Parameter(s) ["object","category"] missing`)
          })
      })
      .then(() => { // Create appointment without a category not existing
        mock.restore()
        mock.post(instance.url + instance.routes.createAppointment, {
          "errorCode": "UNKNOWN_CATEGORY_CODE",
          "errorMessage": "Unknow category code",
          "bookingId": 0
        })

        return instance.createAppointment({
          "siteCode": "c1",
          "description": "my description",
          "object": "subject",
          "date": "2017-08-24T15:30:25+02:00",
          "qualification": "HEARING_AID",
          "category": "xxx",
          "customer": {
            "firstname": "Jean",
            "lastname": "Dupont",
            "email": "jean.dupont@gmail.com"
          }
        })
          .catch(e => {
            t.is(e instanceof UnknownCategoryCode, true)
            t.is(e.name, `UnknownCategoryCode`)
            t.is(e.message, `Unknow category code`)
          })
      })
      .then(() => { // Create appointment with unavailable slot
        mock.restore()
        mock.post(instance.url + instance.routes.createAppointment, {
          "errorCode": "UNAVAILABLE_SLOT",
          "errorMessage": "Time slot unavailable",
          "bookingId": 0
        })

        return instance.createAppointment({
          "siteCode": "c1",
          "date": "2017-07-29T13:15:00.000Z",
          "object": "Sujet",
          "category": "consultation1",
          "customer": {
            "firstname": "Jean",
            "lastname": "Dupont",
            "email": "jean.dupont@gmail.com"
          }
        })
          .catch(e => {
            t.is(e instanceof UnavailableSlot, true)
            t.is(e.name, `UnavailableSlot`)
            t.is(e.message, `Time slot unavailable`)
          })
      })
  })
})
