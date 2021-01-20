/**
 * ZeroTier Central API endpoints
 */

// module.exports = Central
const BASE = 'https://my.zerotier.com/api'
const GET = 'get'
const POST = 'post'
const DEL = 'delete'

const methods = {
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

module.exports = methods
module.exports.withDefaults = withDefaults

// wrap it so consumer doesn't provide options in their calls
function withDefaults (opts) {
  return Object.keys(methods).reduce((acc, key) => {
    return {
      ...acc,
      [key]: function (...rest) {
        return methods[key]({ ...opts }, ...rest)
      }
    }
  }, {})
}

function make ({ base = BASE, path, method, token }) {
  const result = {
    url: `${base}${path}`,
    method,
    headers: headers(token)
  }

  return result
}

function networkUserDelete (opts, networkId, userId) {
  const path = `/network/${networkId}/users/${userId}`
  const method = DEL

  return make({ ...opts, path, method })
}

function networkUserUpdate (opts, networkId, userId) {
  const path = `/network/${networkId}/users/${userId}`
  const method = POST

  return make({ ...opts, path, method })
}

function networkUserCreate (opts, networkId, userId) {
  const path = `/network/${networkId}/users/${userId}`
  const method = POST

  return make({ ...opts, path, method })
}

function networkUserList (opts, networkId) {
  const path = `/network/${networkId}/users`
  const method = GET

  return make({ ...opts, path, method })
}
function memberDelete (opts, networkId, memberId) {
  const path = `/network/${networkId}/member/${memberId}`
  const method = DEL

  return make({ ...opts, path, method })
}

function memberUpdate (opts, networkId, memberId) {
  const path = `/network/${networkId}/member/${memberId}`
  const method = POST

  return make({ ...opts, path, method })
}

function memberGet (opts, networkId, memberId) {
  const path = `/network/${networkId}/member/${memberId}`
  const method = GET

  return make({ ...opts, path, method })
}

function memberList (opts, networkId) {
  const path = `/network/${networkId}/member`
  const method = GET

  return make({ ...opts, path, method })
}

function statusGet (opts = {}) {
  const path = '/status'
  const method = GET

  return make({ ...opts, path, method })
}

function networkUpdate (opts, networkId) {
  const path = `/network/${networkId}`
  const method = POST

  return make({ ...opts, path, method })
}

function networkList (opts = {}) {
  const path = '/network'
  const method = GET

  return make({ ...opts, path, method })
}

function networkGet (opts, networkId) {
  const path = `/network/${networkId}`
  const method = GET

  return make({ ...opts, path, method })
}

function networkDelete (opts = {}, networkId) {
  const path = `/network/${networkId}`
  const method = DEL

  return make({ ...opts, path, method })
}

function networkCreate (opts = {}) {
  const path = '/network'
  const method = POST

  return make({ ...opts, path, method })
}

function headers (token) {
  return {
    'content-type': 'application/json',
    ...(token ? { authorization: `bearer ${token}` } : null)
  }
}
