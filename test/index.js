import test from 'ava'
import sdk from '../src/lib'
import SDK from '../src/class/sdk'

let instance = {}

test.before(t => {
  sdk.configure({credentials: {username: "username", password: "password"}})
  instance = sdk.create()
  t.is(instance instanceof SDK, true)
})

test('Getting available time slots', t => {
  t.is(true, true)
})

test('Create appointment', t => {
  t.is(true, true)
})

test('Cancel appointment', t => {
  t.is(true, true)
})
