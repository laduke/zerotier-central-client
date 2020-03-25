# ZeroTier Central API client

(my.zerotier.com)

Bring your own fetch.
No dependencies, pure functions, etc

## Install
`npm install @laduke/zerotier-central-client`

## Usage
In node you need the api access token from my.zerotier.com.
In the browser it'll use cookies, so no token required.
This doesn't depend on any of the [many fetch/request modules](https://github.com/request/request/issues/3143) out there, but returns objects that should be easy to pass into any of them.
Maybe you're already using something like that and don't need another dependency.


```javascript
  const central = Central({ token: process.env.API_TOKEN })

  const axios = require('axios').default
  const result = await axios(central.statusGet())
  console.log(result)

  const fetch = require('node-fetch')
  const { url, ...opts } = central.statusGet()
  const result2 = await fetch(url, opts).then(res => res.json())
  console.log(result2)

```



