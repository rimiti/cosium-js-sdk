import sdk from '../class'

sdk.configure({
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
})

export default sdk
