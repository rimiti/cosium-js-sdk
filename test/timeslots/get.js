import test from 'ava'
import sdk from '../../src/lib/index'
import SDK from '../../src/class/sdk'
import mock from 'fetch-mock'
import {
  MissingMandatoryParameter,
  InvalidDatetimeFormat,
  WrongDatetimeValues,
  WrongDatetimes,
  NotAuthorized,
  BadRequest,
  UnknownError
} from '../../src/class/exceptions/index'

let instance = {}

test.before(t => {
  sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
  instance = sdk.create()
  t.is(instance instanceof SDK, true)
})

test.afterEach(() => mock.restore())

test('Get available timeslots', t => {
  return Promise.resolve(resolve => {
    mock.restore()
    mock.post(instance.url + instance.routes.availableTimeslots, {
      "errorCode": null,
      "errorMessage": null,
      "availableTimeSlots": [
        {date: '2017-09-23T12:00:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']},
        {date: '2017-09-23T12:30:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']}
      ]
    })

    return instance.getAvailableTimeslots({
      siteCode: "c1",
      startDate: "2017-08-24T15:30:25+02:00",
      endDate: "2017-08-24T15:30:25+02:00"
    })
      .then(response => {
        t.deepEqual(response, {
          errorCode: null,
          errorMessage: null,
          availableTimeSlots: [
            {date: '2017-09-23T12:00:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']},
            {date: '2017-09-23T12:30:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']}
          ]
        })
        return resolve()
      })
  })
    .then(() => { // Get available time slots throws exception when missing mandatory parameter
      mock.restore()
      mock.post(instance.url + instance.routes.availableTimeslots, {
        "errorCode": "TEST_ERROR_CODE",
        "errorMessage": "Test error",
        "availableTimeSlots": []
      })

      return instance.getAvailableTimeslots({siteCode: "c1",
        startDate: "2017-08-24T15:30:25+02:00",
        endDate: "2017-08-24T15:30:25+02:00"})
        .catch(e => {
          t.is(e instanceof UnknownError, true)
          t.is(e.name, `UnknownError`)
          t.is(e.message, `Test error`)
        })
    })
    .then(() => { // Get available time slots throws exception when missing mandatory parameter
      mock.restore()
      mock.post(instance.url + instance.routes.availableTimeslots, {
        "errorCode": "MISSING_MANDATORY_PARAMETER",
        "errorMessage": "Missing mandatory parameter : startDate",
        "availableTimeSlots": []
      })

      return instance.getAvailableTimeslots({siteCode: "c1"})
        .catch(e => {
          t.is(e instanceof MissingMandatoryParameter, true)
          t.is(e.name, `MissingMandatoryParameter`)
          t.is(e.message, `Parameter(s) ["startDate","endDate"] missing`)
        })
    })
    .then(() => { // Get available timeslots with bad datetime format
      mock.restore()
      mock.post(instance.url + instance.routes.availableTimeslots, {
        "errorCode": null,
        "errorMessage": null,
        "availableTimeSlots": [
          {date: '2017-09-23T12:00:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']},
          {date: '2017-09-23T12:30:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']}
        ]
      })

      return instance.getAvailableTimeslots({
        siteCode: "c1",
        startDate: "2017-08-32",
        endDate: "2017-08-24"
      })
        .catch(e => {
          t.is(e instanceof InvalidDatetimeFormat, true)
          t.is(e.name, `InvalidDatetimeFormat`)
          t.is(e.message, `Invalid datetime format (ISO_8601 format required)`)
        })
    })
    .then(() => { // Get available timeslots with more than 20 interval days
      mock.restore()
      mock.post(instance.url + instance.routes.availableTimeslots, {
        "errorCode": null,
        "errorMessage": null,
        "availableTimeSlots": [
          {date: '2017-09-23T12:00:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']},
          {date: '2017-09-23T12:30:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']}
        ]
      })

      return instance.getAvailableTimeslots({
        siteCode: "c1",
        startDate: "2017-08-24T15:30:25+02:00",
        endDate: "2017-10-24T15:30:25+02:00"
      })
        .catch(e => {
          t.is(e instanceof WrongDatetimes, true)
          t.is(e.name, `WrongDatetimes`)
          t.is(e.message, `You cannot have more than 20 days between two dates`)
        })
    })
    .then(() => { // Get available timeslots with start datetime greater than end datetime
      mock.restore()
      mock.post(instance.url + instance.routes.availableTimeslots, {
        "errorCode": null,
        "errorMessage": null,
        "availableTimeSlots": [
          {date: '2017-09-23T12:00:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']},
          {date: '2017-09-23T12:30:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']}
        ]
      })

      return instance.getAvailableTimeslots({
        siteCode: "c1",
        startDate: "2017-10-24T15:30:25+02:00",
        endDate: "2017-08-24T15:30:25+02:00"
      })
        .catch(e => {
          t.is(e instanceof WrongDatetimeValues, true)
          t.is(e.name, `WrongDatetimeValues`)
          t.is(e.message, `Start datetime is greater than end datetime`)
        })
    })
    .then(() => { // Get available timeslots without being authenticated
      mock.restore()
      mock.post(instance.url + instance.routes.availableTimeslots, 401)

      return instance.getAvailableTimeslots({
        siteCode: "c1",
        startDate: "2017-10-24T15:30:25+02:00",
        endDate: "2017-10-24T15:30:25+02:00"
      })
        .catch(e => {
          t.is(e instanceof NotAuthorized, true)
          t.is(e.name, `NotAuthorized`)
          t.is(e.message, `Not authorized`)
        })
    })
    .then(() => { // Return 400 bad request
      mock.restore()
      mock.post(instance.url + instance.routes.availableTimeslots, 400)

      return instance.getAvailableTimeslots({
        siteCode: "c1",
        startDate: "2017-10-24T15:30:25+02:00",
        endDate: "2017-10-24T15:30:25+02:00"
      })
        .catch(e => {
          t.is(e instanceof BadRequest, true)
          t.is(e.name, `BadRequest`)
          t.is(e.message, `Bad request`)
        })
    })
})
