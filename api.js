var assert = require('assert')
var duplexify = require('duplexify')
var https = require('https')

module.exports = Central

function Central (opts) {
  if (!(this instanceof Central)) return new Central(opts)
  opts = opts || {}

  assert(opts.token, 'Please provide your auth token in the token: key')

  this.hostname = opts.host || 'my.zerotier.com'
  this.token = opts.token

  var defaults = {
    path: '/api/network',
    method: 'GET',
    data: null,

    hostname: this.hostname,
    port: this.port,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${this.token}`
    }
  }

  this.stream = function (opts) {
    var options = Object.assign({}, defaults, opts)

    var dup = request(options)
    dup.end()

    return dup

    function request (opts) {
      var req = https.request(opts)
      var dup = duplexify(req)

      req.on('response', handleResp)

      req.on('error', handleError)

      return dup
    }

    function parseStatus (statusCode) {
      if (statusCode !== 200) {
        return new Error(statusCode)
      }
    }

    function handleResp (res) {
      dup.setReadable(res)

      var err = parseStatus(res.statusCode)
      if (err) { handleError(err) }
    }

    function handleError (err) {
      if (err.code === 'ECONNRESET') {
        err.message += '. zerotier-one may have just crashed'
      } else if (err.code === 'ECONNREFUSED') {
        err.message += '. Is zerotier-one running?'
      }

      dup.destroy(err)
    }
  }
}

Central.prototype.networkList = function () {
  return this.stream({ path: '/api/network' })
}

Central.prototype.networkGet = function (networkId) {
  return this.stream({ path: '/api/network/' + networkId })
}

Central.prototype.networkCreate = function () {
  return this.stream({ path: '/api/network/?easy=1', method: 'POST' })
}
