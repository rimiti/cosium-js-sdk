import test from 'ava'
import sdk from '../src/lib'
import SDK from '../src/class/sdk'
import fetchMock from 'fetch-mock'

let instance = {}



test.before(t => {
  sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
  instance = sdk.create()


  t.is(instance instanceof SDK, true)
})

test('Get available time slots', t => {

  fetchMock.post(instance.url + instance.routes.availableTimeslots,
    {
      "errorCode": null,
      "errorMessage": null,
      "availableTimeSlots": [
        { date: '2017-09-23T12:00:00.000+0000', qualifications: [ 'CONTACT_LENS', 'OPTIC', 'HEARING_AID' ] },
        { date: '2017-09-23T12:30:00.000+0000', qualifications: [ 'CONTACT_LENS', 'OPTIC', 'HEARING_AID' ] }
      ]
    }
  )

  let params = {
    siteCode: "c1",
    startDate: "2017-09-23T12:00:00.000Z",
    endDate: "2017-09-23T13:00:00.000Z"
  }

  let expected = {
    "errorCode": null,
    "errorMessage": null,
    "availableTimeSlots": [
      { date: '2017-09-23T12:00:00.000+0000', qualifications: [ 'CONTACT_LENS', 'OPTIC', 'HEARING_AID' ] },
      { date: '2017-09-23T12:30:00.000+0000', qualifications: [ 'CONTACT_LENS', 'OPTIC', 'HEARING_AID' ] }
    ]
  }

  return instance.getAvailableTimeslots(params).then((resp) => {
    t.deepEqual(resp, expected)

  })

  fetchMock.restore()

})

test('Create appointment', t => {

  fetchMock.post(instance.url + instance.routes.createAppointment, {"errorCode":null, "bookingId":"1935472128"})

  let params = {
    "siteCode": "c1",
    "date": "2017-07-23T16:00:00.000Z",
    "object":"Sujet",
    "description":   "ma   description",
    "qualification": "HEARING_AID",
    "category": "consultation1",
    "customer":
    {
      "firstname":   "Jean",
      "lastname":"Dupont",
      "email": "jean.dupont@gmail.com"
    }
  }

  let expected = {"errorCode":null, "bookingId":"1935472128"}

  return instance.createAppointment(params).then((resp) => {
    t.deepEqual(resp, expected)

  })

  fetchMock.restore()

})

test('Cancel appointment', t => {
  t.is(true, true)
})
