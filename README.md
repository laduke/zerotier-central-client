# ZeroTier Central API client

(my.zerotier.com)

Uses fetch and should work in the browser or node

## Install
`npm install @laduke/zerotier-central-client`

## Usage
In node you need the api access token from my.zerotier.com.
In the browser it'll use cookies, so no token required.

```javascript
const Central = require('./central.js')
const central = Central({ token: process.env.CENTRAL_TOKEN })

central.getNetworks()
.then(console.log)

```



