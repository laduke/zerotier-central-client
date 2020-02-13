// node
const Central = require('./')
const central = Central({ token: process.env.CENTRAL_TOKEN })

central.getNetworks()
  .then(console.log)
