class Flag {
  constructor ({ slug, flagType, available, value }) {
    this.slug = slug
    this.flagType = flagType
    this.available = available
    this.value = value
  }

  getValue () {
    switch (this.flagType) {
      case 10: return this.value
      case 20: return parseInt(this.value)
      case 30: return this.value
      case 40: return JSON.parse(this.value)
    }
  }
}

export class ConfigManager {
  constructor (data) {
    this.data = {}

    for (const [slug, item] of Object.entries(data)) {
      this.data[slug] = new Flag({
        slug,
        flagType: item.type,
        available: item.state,
        value: item.value
      })
    }
  }

  getFlag (slug) {
    return this.data[slug]
  }
}
