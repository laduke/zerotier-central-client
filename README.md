# ZeroTier Central API client

(my.zerotier.com)

should work in the browser or from node

## Install
`npm install @laduke/zerotier-central-client`

## Usage
In node you need the api access token from my.zerotier.com.
In the browser it'll just use cookies.

```javascript
const Central = require('./central.js')
const central = Central({ token: process.env.CENTRAL_TOKEN })

central.getNetworks()
.then(console.log)

```



