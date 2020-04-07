const assert = require('assert')

/**
 * ZeroTier Central API endpoints
 */

/**
 * Returns an object with methods the api endpoints.
 * @namespace Central
 * @param {Object} options
 * @param {String} options.token - Central API token
 */
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
    memberGet,
    memberList,
    memberUpdate,
    memberDelete,
    networkCreate,
    networkDelete,
    networkGet,
    networkList,
    networkUpdate,
    networkUserCreate,
    networkUserDelete,
    networkUserList,
    networkUserUpdate,
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

  /**
   * @param {String} networkId - 16 Hex characters
   * @memberof Central
   * @instance
   */
  function networkGet (networkId) {
    assertNWID(networkId)

    return get(`/network/${networkId}`)
  }

  function networkCreate () {
    return post('/network')
  }

  function networkUpdate (networkId) {
    assertNWID(networkId)
    return post(`/network/${networkId}`)
  }

  function networkDelete (networkId) {
    assertNWID(networkId)
    return del(`/network/${networkId}`)
  }

  function memberList (networkId) {
    assertNWID(networkId)
    return get(`/network/${networkId}/member`)
  }

  function memberGet (networkId, nodeId) {
    assertNWID(networkId)
    assertNodeId(nodeId)
    return get(`/network/${networkId}/member/${nodeId}`)
  }

  function memberUpdate (networkId, nodeId) {
    assertNWID(networkId)
    assertNodeId(nodeId)
    return post(`/network/${networkId}/member/${nodeId}`)
  }

  function memberDelete (networkId, nodeId) {
    assertNWID(networkId)
    assertNodeId(nodeId)
    return del(`/network/${networkId}/member/${nodeId}`)
  }

  function statusGet () {
    return get('/status')
  }

  function networkUserList (networkId) {
    assertNWID(networkId)
    return get(`/network/${networkId}/users`)
  }

  function networkUserCreate (networkId) {
    assertNWID(networkId)
    return post(`/network/${networkId}/users`)
  }

  function networkUserUpdate (networkId) {
    assertNWID(networkId)
    return post(`/network/${networkId}/users`)
  }

  function networkUserDelete (networkId, uid) {
    assertNWID(networkId)
    assert(uid.match(uuidRegex), 'userId should be a uuid. Got: ' + uid)
    return post(`/network/${networkId}/users/${uid}`)
  }
}

function assertNWID (networkId) {
  assert(
    networkId.match(networkIdRegex),
    'Invalid Network ID. A network ID is 16 hex characters. Got: ' + networkId
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

const nodeIdRegex = /^[0-9a-fA-F]{10}$/
const networkIdRegex = /^[0-9a-fA-F]{16}$/
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

module.exports = Central
