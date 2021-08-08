import pako from 'pako'
import { apiServer, rateEnum, FipperConfigNotFoundError } from '~/fipper/utils'

export class FipperClient {
  static previousSyncDate = null
  static config = null
  static eTag = null

  constructor ({ rate = rateEnum.RARELY, environment, apiToken, projectId }) {
    this.rate = rate
    this.environment = environment
    this.apiToken = apiToken
    this.projectId = projectId
  }

  getRate (rate) {
    switch (rate) {
      case rateEnum.RARELY: return 15
      case rateEnum.NORMAL: return 7
      case rateEnum.FREQUENTLY: return 3
    }
  }

  getActualConfig () {
    const now = new Date()

    if (this.previousSyncDate && this.config) {
      const timeSpan = new Date(new Date().getTime() + this.getRate(this.rate) * 60000)

      if (now - this.previousSyncDate < timeSpan) {
        return this.config
      }
    }
  }

  async getConfigData () {
    const actualConfig = this.getActualConfig()

    if (actualConfig) {
      return this.config
    }

    if (this.previousSyncDate && this.config && this.eTag) {
      const hashResponse = await apiServer.get('hash', {
        params: {
          apiToken: this.apiToken,
          item: this.projectId,
          eTag: this.eTag
        }
      })

      if (hashResponse.status === 304) {
        return this.config
      }
    }

    const configResponse = await apiServer.get('config', {
      params: {
        apiToken: this.apiToken,
        item: this.projectId
      }
    })

    if (configResponse.status === 200) {
      const rawData = configResponse.data
      const configEnv = rawData.config[this.environment]

      if (configEnv) {
        const rawDataFromBase64 = Buffer.from(configEnv, 'base64').toString('binary')
        const rawDataBuffer = rawDataFromBase64.split('').map((e) => {
          return e.charCodeAt(0)
        })
        const configRawData = pako.inflate(new Uint8Array(rawDataBuffer))
        this.config = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(configRawData)))
      } else {
        this.config = {}
      }

      this.eTag = rawData.eTag
      this.previousSyncDate = new Date()
    } else if (!this.config) {
      throw new FipperConfigNotFoundError('Config not found or unpublished')
    }
    return this.config
  }
}
