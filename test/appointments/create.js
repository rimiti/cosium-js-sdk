import test from 'ava'
import sdk from '../../src/lib'
import SDK from '../../src/class/sdk'
import mock from 'fetch-mock'
import {UnknownCategoryCode} from '../../src/class/exceptions'

let instance = {}

test.before(t => {
  sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
  instance = sdk.create()
  t.is(instance instanceof SDK, true)
})

test('Create appointment', t => {
  mock.restore()
  mock.post(instance.url + instance.routes.createAppointment, {"errorCode": null, "bookingId": "1935472128"})

  return instance.createAppointment({
    "siteCode": "c1",
    "description": "ma   description",
    "qualification": "HEARING_AID",
    "category": "consultation1",
    "customer":
      {
        "firstname": "Jean",
        "lastname": "Dupont",
        "email": "jean.dupont@gmail.com"
      }
  })
    .then((response) => t.deepEqual(response, {"errorCode": null, "bookingId": "1935472128"}))
})

test('Create appointment without a category not existing', t => {
  mock.restore()
  mock.post(instance.url + instance.routes.createAppointment,
  {
    "errorCode": "UNKNOWN_CATEGORY_CODE",
    "errorMessage": "Unknow category code ddd",
    "bookingId": 0
  })

  return instance.createAppointment({
    "siteCode": "c1",
    "description": "ma   description",
    "qualification": "HEARING_AID",
    "category": "xxx",
    "customer":
      {
        "firstname": "Jean",
        "lastname": "Dupont",
        "email": "jean.dupont@gmail.com"
      }
  })
  .catch(e => {
    t.is(e instanceof UnknownCategoryCode, true)
    t.is(e.name, `UnknownCategoryCode`)
    t.is(e.message, `category in request param is unknown`)
  })
})
