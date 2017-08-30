# cosium-js-sdk

[![Build Status](https://travis-ci.org/rimiti/cosium-js-sdk.svg?branch=master)](https://travis-ci.org/rimiti/cosium-js-sdk) [![Coverage Status](https://coveralls.io/repos/github/rimiti/cosium-js-sdk/badge.svg?branch=master)](https://coveralls.io/github/rimiti/cosium-js-sdk?branch=master) [![Issue Count](https://codeclimate.com/github/rimiti/cosium-js-sdk/badges/issue_count.svg)](https://codeclimate.com/github/rimiti/cosium-js-sdk) [![NPM version](https://badge.fury.io/js/cosium-js-sdk.svg)](https://badge.fury.io/js/cosium-js-sdk) [![Downloads](https://img.shields.io/npm/dt/cosium-js-sdk.svg)](https://img.shields.io/npm/dt/cosium-js-sdk.svg)


Cosium Javascript SDK

# Install
```
$ npm install cosium-js-sdk
```

## Available methods

* ***Getting available timeslots***

```js
import * as sdk from 'cosium-js-sdk'

sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
const cosium = sdk.create()

const params = {
  siteCode: "c1",
  startDate: "2017-09-23T12:00:00.000Z",
  endDate: "2017-09-23T13:00:00.000Z"
}

cosium.getAvailableTimeslots(params).then((response) => {
	console.log(response)
})
```
Response body example:

```json
{
  "errorCode": null,
  "errorMessage": null,
  "availableTimeSlots": [
    {"date": "2017-09-23T12:00:00.000+0000", "qualifications": ["CONTACT_LENS", "OPTIC", "HEARING_AID"]},
    {"date": "2017-09-23T12:30:00.000+0000", "qualifications": ["CONTACT_LENS", "OPTIC", "HEARING_AID"]}
  ]
}
```

request parameter for calling the function:

| Name          | description           | Required  |
| ------------- |:---------------------:| ---------:|
| siteCode      | requested center code | true      |
| startDate     | start date            | true      |
| endDate       | end date              | true      |

N.B: The difference between startDate and endDate should be at maximum 20 days

<br/>

* ***Create an appointment***

```js
import * as sdk from 'cosium-js-sdk'

sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
const cosium = sdk.create()

const params = {
  "siteCode": "c1",
  "description": "my description",
  "object": "appointement subject",
  "qualification": "HEARING_AID",
  "category": "consultation1",
  "date": "2017-08-24T15:30:25+02:00",
  "customer":
  {
    "firstname": "Jean",
    "lastname": "Dupont",
    "email": "jean.dupont@gmail.com"
  }
}

cosium.createAppointment(params).then((response) => {
	console.log(response)
})
```
Response body example:

```json
{"errorCode": null, "bookingId": "1935472128"}
```

request parameter for calling the function:

| Name                      | description                            | Required  |
| ------------------------- |:--------------------------------------:| ---------:|
| siteCode                  | requested center code                  | true      |
| date                      | date of appointment                    | true      |
| object                    | object of the appointment              | true      |
| category                  | code of appointment category           | true      |
| description               | description of the appointment         | false     |
| timeslotDurationInMinutes | duration in minutes of the slot        | false     |
| customer                  | customer informations                  | true      |
| customer.firstname        | firstname of customer                  | true      |
| customer.lastname         | lastname of customer                   | true      |
| customer.email            | email of customer                      | false     |
| qualification             | desired qualification of the seller    | false     |

<br/>

* ***Delete an appointment***

```js
import * as sdk from 'cosium-js-sdk'

sdk.configure({url: "https://www.example.com", credentials: {username: "username", password: "password"}})
const cosium = sdk.create()

const params = {
 	"siteCode": "c1",
  "bookingId": "20"
}

cosium.cancelAppointment(params).then((response) => {
	console.log(response)
})
```
Response body example:

```json
{"errorCode": null}
```

request parameter for calling the function:

| Name          | description                                           | Required  |
| ------------- |:-----------------------------------------------------:| ---------:|
| siteCode      | requested center code                                 | true      |
| bookingId     | unique identifier of the reservation to be deleted    | true      |

## Tests
```js
// Run tests
npm test
```

## License
MIT © [Dimitri DO BAIRRO](https://dimsolution.com)
