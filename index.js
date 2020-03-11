const assert = require('assert')

function Central (opts = {}) {
  if (opts.token) {
    assert(
      typeof opts.token === 'string' && opts.token.length > 0,
      'API Token should be a string, if defined. Got: ' + opts.token
    )
  }

  const token = opts.token
  const base = opts.base || 'https://my.zerotier.com/api'
  const headers = {
    'content-type': 'application/json',
    ...(token ? { authorization: `bearer ${token}` } : null)
  }

  // will throw if invalid base
  new URL('/', base) // eslint-disable-line no-new

  return {
    networkList,
    networkGet,
    networkCreate,
    networkUpdate,
    networkDelete,
    memberList,
    memberGet,
    memberUpdate,
    statusGet
  }

  function make (path, method) {
    assert(typeof path === 'string', 'path should be a string, got: ', path)

    const result = {
      url: `${base}${path}`,
      method,
      headers
    }

    return result
  }

  function get (path) {
    return make(path, 'get')
  }
  function del (path) {
    return make(path, 'delete')
  }

  function post (path) {
    return make(path, 'post')
  }

  function networkList () {
    return get('/network')
  }

  function networkGet (nwid) {
    assertNWID(nwid)

    return get(`/network/${nwid}`)
  }

  function networkCreate () {
    return post('/network')
  }

  function networkUpdate (nwid) {
    assertNWID(nwid)
    return post(`/network/${nwid}`)
  }

  function networkDelete (nwid) {
    assertNWID(nwid)
    return del(`/network/${nwid}`)
  }

  function memberList (nwid) {
    assertNWID(nwid)
    return get(`/network/${nwid}/member`)
  }

  function memberGet (nwid, nodeId) {
    assertNWID(nwid)
    assertNodeId(nodeId)
    return get(`/network/${nwid}/member/${nodeId}`)
  }

  function memberUpdate (nwid, nodeId) {
    assertNWID(nwid)
    assertNodeId(nodeId)
    return post(`/network/${nwid}/member/${nodeId}`)
  }

  function statusGet (nwid) {
    return get('/status')
  }
}

function assertNWID (nwid) {
  assert(
    nwid.match(networkIdRegex),
    'Invalid Network ID. A network ID is 16 hex characters. Got: ' + nwid
  )
}

function assertNodeId (nodeId) {
  assert(
    nodeId.match(nodeIdRegex),
    'Invalid node ID. A node ID is 10 hex characters. Got: ' + nodeId
  )
}

Central.withToken = function (token) {
  return Central({ token })
}

Central.withBase = function (base) {
  return Central({ base })
}

const networkIdRegex = /^[0-9a-fA-F]{16}$/
const nodeIdRegex = /^[0-9a-fA-F]{10}$/

module.exports = Central
