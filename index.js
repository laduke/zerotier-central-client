const assert = require('assert')

/**
 * ZeroTier Central API endpoints
 */

function assertNWID (networkId) {
  assert(
    typeof networkId === 'string' && networkId.match(networkIdRegex),
    'Invalid Network ID. A network ID is 16 hex characters. Got: ' + networkId
  )
}

function assertNodeId (nodeId) {
  assert(
    typeof nodeId === 'string' && nodeId.match(nodeIdRegex),
    'Invalid node ID. A node ID is 10 hex characters. Got: ' + nodeId
  )
}

function assertUserId (userId) {
  assert(
    typeof userId === 'string',
    'Invalid User ID. A user ID is a long string, a UUID: ' + userId
  )
}
const nodeIdRegex = /^[0-9a-fA-F]{10}$/
const networkIdRegex = /^[0-9a-fA-F]{16}$/

// module.exports = Central
const BASE = 'https://my.zerotier.com/api'
const GET = 'get'
const POST = 'post'
const DEL = 'delete'

module.exports = {
  memberList,
  networkCreate,
  networkDelete,
  networkGet,
  networkList,
  networkUpdate,
  statusGet,
  memberGet,
  memberUpdate,
  memberDelete,
  networkUserList,
  networkUserCreate,
  networkUserUpdate,
  networkUserDelete
}

function networkUserDelete (networkId, userId, opts = {}) {
  assertNWID(networkId)
  assertUserId(userId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}/users/${userId}`
  const method = DEL

  return make({ base, path, method, token })
}

function networkUserUpdate (networkId, userId, opts = {}) {
  assertNWID(networkId)
  assertUserId(userId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}/users/${userId}`
  const method = POST

  return make({ base, path, method, token })
}

function networkUserCreate (networkId, userId, opts = {}) {
  assertNWID(networkId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}/users/${userId}`
  const method = POST

  return make({ base, path, method, token })
}

function networkUserList (networkId, opts = {}) {
  assertNWID(networkId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}/users`
  const method = GET

  return make({ base, path, method, token })
}
function memberDelete (networkId, memberId, opts = {}) {
  assertNWID(networkId)
  assertNodeId(memberId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}/member/${memberId}`
  const method = DEL

  return make({ base, path, method, token })
}

function memberUpdate (networkId, memberId, opts = {}) {
  assertNWID(networkId)
  assertNodeId(memberId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}/member/${memberId}`
  const method = POST

  return make({ base, path, method, token })
}

function memberGet (networkId, memberId, opts = {}) {
  assertNWID(networkId)
  assertNodeId(memberId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}/member/${memberId}`
  const method = GET

  return make({ base, path, method, token })
}
function memberList (networkId, opts = {}) {
  assertNWID(networkId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}/member`
  const method = GET

  return make({ base, path, method, token })
}

function statusGet (opts = {}) {
  const { token, base = BASE } = opts
  const path = '/status'
  const method = GET

  return make({ base, path, method, token })
}

function networkUpdate (networkId, opts = {}) {
  const { token, base = BASE } = opts

  const path = `/network/${networkId}`
  const method = POST

  return make({ base, path, method, token })
}

function networkList (opts = {}) {
  const { token, base = BASE } = opts
  const path = '/network'
  const method = GET

  return make({ base, path, method, token })
}

function networkGet (networkId, opts = {}) {
  assertNWID(networkId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}`
  const method = GET

  return make({ base, path, method, token })
}

function networkDelete (networkId, opts = {}) {
  assertNWID(networkId)

  const { token, base = BASE } = opts
  const path = `/network/${networkId}`
  const method = DEL

  return make({ base, path, method, token })
}

function networkCreate (opts = {}) {
  const { token, base = BASE } = opts

  const path = '/network'
  const method = POST

  return make({ base, path, method, token })
}

function make ({ base, path, method, token }) {
  assert(typeof path === 'string', 'path should be a string, got: ', path)

  if (token) {
    assert(
      typeof token === 'string' && token.length > 0,
      'API Token should be a string, if defined. Got: ' + token
    )
  }

  // will throw if invalid base
  new URL('/', base) // eslint-disable-line no-new

  const result = {
    url: `${base}${path}`,
    method,
    headers: headers(token)
  }

  return result
}

function headers (token) {
  return {
    'content-type': 'application/json',
    ...(token ? { authorization: `bearer ${token}` } : null)
  }
}
