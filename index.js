const BASE = 'https://my.zerotier.com/api'
const GET = 'GET'
const POST = 'POST'
const DELETE = 'DELETE'

module.exports = { Central }

function Central (opts = {}) {
  const headers = {
    ...(opts.token ? { Authorization: `bearer ${opts.token}` } : null),
    Accept: 'application/json',
    'User-Agent': 'zerotier-central-client'
  }

  const base = opts.base || BASE

  return {
    networkList,
    networkGet,
    networkDelete,
    networkCreate,
    networkUpdate,

    memberList,
    memberGet,
    memberDelete,
    memberCreate,
    memberUpdate,

    statusGet
  }

  /**
   * Get ZeroTier Central status.
   *
   */
  function statusGet () {
    const path = '/status'
    return make(path, GET, base, headers)
  }

  function networkUpdate (id) {
    const path = `/network/${id}`
    return make(path, POST, base, headers)
  }

  function networkList () {
    const path = '/network'
    return make(path, GET, base, headers)
  }

  function networkGet (id) {
    const path = `/network/${id}`
    return make(path, GET, base, headers)
  }

  function networkCreate () {
    const path = '/network'
    return make(path, POST, base, headers)
  }

  /**
   * Delete a Network by ID
   *
   * @param {NetworkId} networkId - 16 digit network ID
   */
  function networkDelete (id) {
    const path = `/network/${id}`
    return make(path, DELETE, base, headers)
  }

  function memberUpdate (networkId, id) {
    const path = `/network/${networkId}/member/${id}`
    return make(path, POST, base, headers)
  }

  function memberList (networkId) {
    const path = `/network/${networkId}/member`
    return make(path, GET, base, headers)
  }

  function memberGet (networkId, id) {
    const path = `/network/${networkId}/member/${id}`
    return make(path, GET, base, headers)
  }

  function memberCreate (networkId, id) {
    const path = `/network/${networkId}/member/${id}`
    return make(path, POST, base, headers)
  }

  /**
   * Delete a Member from a Network by Network and Node ID
   *
   * @param {NetworkId} networkId
   * @param {NodeId} id
   */
  function memberDelete (networkId, id) {
    const path = `/network/${networkId}/member/${id}`
    return make(path, DELETE, base, headers)
  }

  /**
   * low level thing that returns a request object to pass into your fetch module
   *
   * @param {string} path
   * @param {string} method
   */
  function make (path, method) {
    return {
      url: `${base}${path}`,
      method,
      headers: Object.assign({}, headers)
    }
  }
}

/**
 * @typedef {Object} Options
 * @property {string} token ZeroTier Central API Token
 * @property {string} base Default is https://my.zerotier.com/api
 */

/** @typedef {String} NetworkId - 16 digit ZeroTier Network ID */
/** @typedef {String} NodeId - 10 digit ZeroTier Node ID */
/** @typedef {String} UserId - Central User ID (uuid) */
