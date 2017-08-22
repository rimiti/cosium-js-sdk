import {ConfigurationWrongFormat} from './exceptions'
import Authentication from './authentication'

export default class Configuration {

  /**
   * @description Auto-hydrate object from configuration
   * @param config
   */
  constructor(config) {
    this._hydrate(config, this._itemsToHydrate())
  }

  get format() {
    return this._format
  }

  set format(value) {
    if (value !== 'json') throw new ConfigurationWrongFormat()
    this._format = value
  }

  get credentials() {
    return this._credentials
  }

  set credentials(value) {
    this._credentials = new Authentication(value)
  }

  get headers() {
    return {
        'Authorization': this._credentials.getAuthentication(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
  }

  /**
   * @description Hydrate object from configuration settings
   * @param obj
   * @param attributes
   * @private
   */
  _hydrate(obj, attributes) {
    if (!obj) return
    for (let item of attributes) {
      this[item] = (obj[item]) ? obj[item] : ''
    }
  }

  /**
   * @description Return array with items names to hydrate
   * @return {[string,string]}
   * @private
   */
  _itemsToHydrate() {
    return ['format', 'credentials']
  }
}
