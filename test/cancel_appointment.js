import test from 'ava'
import sdk from '../src/lib'
import SDK from '../src/class/sdk'
import mock from 'fetch-mock'

let instance = {}

test.before(t => {
  sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
  instance = sdk.create()
  t.is(instance instanceof SDK, true)
})


test('Cancel appointment', t => {
  mock.post(instance.url + instance.routes.cancelAppointment, {"errorCode": null})

  return instance.cancelAppointment({
    "siteCode": "ABC",
    "bookingId": "1935472128"
  })
    .then((response) => t.deepEqual(response, {"errorCode": null}))
})


// TODO: Tests are missing, you don't test your throwing errors
