import test from 'ava'
import sdk from '../../src/lib'
import {ConfigurationWrongCredentials, ConfigurationWrongFormat} from '../../src/class/exceptions'

test('Set empty username and password', t => {
  const err = t.throws(() => sdk.create(), ConfigurationWrongCredentials)
  t.is(err.name, `ConfigurationWrongCredentials`)
  t.is(err.message, `Wrong credentials configuration`)
})

test('Set wrong format', t => {
  sdk.configure({format: "xml", credentials: {username: "username", password: "password"}})
  const err = t.throws(() => sdk.create(), ConfigurationWrongFormat)
  t.is(err.name, `ConfigurationWrongFormat`)
  t.is(err.message, `Only "json" format can be set`)
})
