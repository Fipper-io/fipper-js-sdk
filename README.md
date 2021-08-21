# fipper-js-sdk
A client library for JavaScript (SDK)

Fipper.io - a feature toggle (aka feature flags) software. More info https://fipper.io

<strong>ATTENTION:</strong> If you want to use the library with NodeJS, don't forget to transpile it into ES5. You could use [Babel](https://babeljs.io) for that.

## Install via NPM
> npm install fipper-js-sdk

## Install via Yarn
> yarn add fipper-js-sdk

## Examples
Here is a code snippet for [Nuxt.js](http://nuxtjs.org) (Vue). You could use Fipper-JS-SDK on both client and server sides:

#### plugins/fipper.js
```js
import { FipperClient } from 'fipper-js-sdk'

export default async ({ store }) => {
  const client = new FipperClient({
    environment: 'production',
    apiToken: '*place your API token here*',
    projectId: 12345
  })

  const configData = await client.getConfigData()
  store.dispatch('fipper/fipperConfig', configData)
}
```

#### nuxt.config.js
```js
 plugins: [
    { src: '~/plugins/fipper' }
 ],
 build: {
    transpile: ['fipper-js-sdk']
 },
```

#### store/fipper.js
```js
export const state = () => ({
  configData: {}
})

export const mutations = {
  CONFIG (state, value) {
    state.configData = value
  }
}

export const actions = {
  fipperConfig (context, configData) {
    context.commit('CONFIG', configData)
  }
}
```

#### pages/index.vue
```html
<template>
  <div>
    <div v-if="configData.getFlag('upgrade').available">
      The flag `upgrade` is available now
    </div>
    <div v-else>
      The flag `upgrade` is not available :(
    </div>
  </div>
</template>
<script>
  import { ConfigManager } from 'fipper-js-sdk'
  export default {
    computed: {
      configData () {
        return new ConfigManager(this.$store.state.fipper.configData)
      }
    }
  }
</script>
```

PS: This is just an example of using Fipper-JS-SDK. You could easily embed it into your React, Vue, Svelte, or VanillaJS projects w/o many efforts.

More information and more client libraries: https://docs.fipper.io

