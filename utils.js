import axios from 'axios'

const makeEnum = (arr) => {
  const obj = {}
  for (const val of arr) {
    obj[val] = Symbol(val)
  }
  return Object.freeze(obj)
}

export const rateEnum = makeEnum(['RARELY', 'NORMAL', 'FREQUENTLY'])
export const apiServer = axios.create({
  baseURL: 'https://sync2.fipper.io',
  withCredentials: true,
  headers: {
    Accept: '*/*',
    'Content-Type': 'text/plain;charset=UTF-8'
  }
})
export class FipperConfigNotFoundError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ConfigError'
  }
}
