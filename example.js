const Central = require('./index.js')
const central = Central({ token: process.env.API_TOKEN })

run()
async function run () {
  const axios = require('axios').default
  const result = await axios(central.statusGet())
  console.log(result)

  const fetch = require('node-fetch')
  const { url, ...opts } = central.statusGet()
  const result2 = await fetch(url, opts).then(res => res.json())
  console.log(result2)
}
