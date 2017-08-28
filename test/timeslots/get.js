import test from 'ava'
import sdk from '../../src/lib/index'
import SDK from '../../src/class/sdk'
import mock from 'fetch-mock'
import {MissingMandatoryParameter, InvalidDatetimeFormat} from '../../src/class/exceptions/index'

let instance = {}

test.before(t => {
  sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
  instance = sdk.create()
  t.is(instance instanceof SDK, true)
})

test.afterEach(() => mock.restore())

test('Get available timeslots', t => {
  return Promise.resolve(resolve => {
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
    .then(() => {
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
        startDate: "2017-08-24",
        endDate: "2017-08-24"
      })
        .catch(e => {
          t.is(e instanceof InvalidDatetimeFormat, true)
          t.is(e.name, `InvalidDatetimeFormat`)
          t.is(e.message, `Invalid datetime format (ISO_8601 format required)`)
        })
    })
})
