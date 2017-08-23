import test from 'ava'
import sdk from '../../src/lib'
import SDK from '../../src/class/sdk'
import mock from 'fetch-mock'
import {MissingMandatoryParameter} from '../../src/class/exceptions'

let instance = {}

test.before(t => {
  sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
  instance = sdk.create()
  t.is(instance instanceof SDK, true)
})

// test('Get available time slots', t => {
//   mock.post(instance.url + instance.routes.availableTimeslots,
//     {
//       "errorCode": null,
//       "errorMessage": null,
//       "availableTimeSlots": [
//         {date: '2017-09-23T12:00:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']},
//         {date: '2017-09-23T12:30:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']}
//       ]
//     }
//   )


//   return instance.getAvailableTimeslots({
//     siteCode: "c1",
//     startDate: "2017-09-23T12:00:00.000Z",
//     endDate: "2017-09-23T13:00:00.000Z"
//   })
//     .then((response) => t.deepEqual(response, {
//       errorCode: null,
//       errorMessage: null,
//       availableTimeSlots: [
//         {date: '2017-09-23T12:00:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']},
//         {date: '2017-09-23T12:30:00.000+0000', qualifications: ['CONTACT_LENS', 'OPTIC', 'HEARING_AID']}
//       ]
//     }))
// })


// test('Get available time slots throws exception when missing mandatory request parameter', t => {

//   const err = t.throws(() => instance.getAvailableTimeslots({
//     siteCode: "c1"
//   }), MissingMandatoryParameter)

// })


