import SDK from '../class'
import jsonOverride from 'json-override'

let configuration = {
  "url": "",
  "routes": {
    "availableTimeslots": "/api/public/online-booking/query",
    "createAppointment": "/api/public/online-booking/book",
    "cancelAppointment": "/api/public/online-booking/unbook"
  },
  "format": "json",
  "credentials": {
    "username": "",
    "password": ""
  }
}

/**
 * @description Override default configuration
 * @param config
 */
export function configure(config) {
  configuration = jsonOverride(configuration, config)
}

/**
 * @description Instantiate SDK class
 * @returns {SDK}
 */
export function create() {
  return new SDK(configuration)
}
