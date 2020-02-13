const fetch = require('./fetch.js')
const { SError } = require('error')

class AuthenticationError extends SError {}
class AuthorizationError extends SError {}
class NotFoundError extends SError {}
class JsonError extends SError {}
class HttpError extends SError {}

const API_BASE = 'https://my.zerotier.com/api/'

module.exports = factory

function factory (opts = {}) {
  const _fetchOpts = {
    headers: {
      'content-type': 'application/json',
      ...(opts.token ? { authorization: `bearer ${opts.token}` } : null)
    },
    credentials: 'same-origin'
  }

  const _base =
    opts.base ||
    (typeof window !== 'undefined' && window.location.origin + '/api/') ||
    API_BASE

  function _get (path) {
    const { resource, init } = setupRequest(path, _base, {
      ..._fetchOpts,
      method: 'GET'
    })

    return _fetch(resource, init)
  }

  function _set (path, data) {
    return new Promise((resolve, reject) => {
      let body
      try {
        body = JSON.stringify(data)
      } catch (e) {
        return reject(JsonError.create(e))
      }

      const { resource, init } = setupRequest(path, _base, {
        ..._fetchOpts,
        method: 'POST',
        body
      })

      _fetch(resource, init)
        .then(resolve)
    })
  }

  /* Do the fetch get request, tidy some errors
   * @returns {Promise}
   */
  function _fetch (resource, init) {
    return fetch(resource, init)
      .then(
        res => {
          if (!res.ok) {
            throw errFromStatusCode(res)
          } else {
            return res.json()
              .catch(e => {
                throw jsonErr(resource)
              })
          }
        }
      )
      .catch(e => {
        throw e
      })
  }

  /**
   * Get some info about the User and Central
   **/
  const getStatus = () => _get('status')

  /**
   * Generate a new random API token on the server
   * Tokens are returned in the status object: getStatus()
   **/
  const getRandomToken = () => _get('randomToken')

  /**
   * Get All Networks
   **/
  const getNetworks = () => _get('network')

  /**
   * Get Network Details
   * @param {string} id
   **/
  const getNetwork = id => _get(`network/${id}`)

  /**
   * Get Members on a Network
   * @param {string} networkId - Network ID, a 16 hex digits
   **/
  const getMembers = id => _get(`network/${id}/member`)

  /**
   * Get a specific Member on a Network
   * @param {string} networkId - Network ID, a 16 hex digits
   * @param {string} nodeId - Node ID, a 10 hex digits
   **/
  const getMember = (networkId, memberId) =>
    _get(`network/${networkId}/member/${memberId}`)

  const setNetwork = (networkId, data) =>
    _set(`network/${networkId}`, data)

  const createNetwork = (data) =>
    _set('network', data)

  const setMember = (networkId, memberId, data) =>
    _set(`network/${networkId}/member/${memberId}`, data)

  return {
    getStatus,
    getRandomToken,
    getNetworks,
    getNetwork,
    getMembers,
    getMember,
    setNetwork,
    createNetwork,
    setMember
  }
}

/**
 * returns what you'd pass to Fetch/Request(resource, init)
 **/
function setupRequest (path, _base, init) {
  const resource = `${_base}${path}`
  return { resource, init }
}

function jsonErr (url) {
  throw JsonError.create(
    'Json Error. Maybe this is not a JSON path. url={url}',
    {
      url
    }
  )
}

function errFromStatusCode (res, json) {
  const { status: statusCode, url } = res

  switch (statusCode) {
    case 401: {
      return AuthenticationError.create(
        'Not authenticated. Wrong token? Not logged in? url={url}',
        { url, statusCode }
      )
    }
    case 403: {
      return AuthorizationError.create(
        'Authorization error. Not permittted. url={url}',
        {
          url,
          statusCode
        }
      )
    }
    case 404: {
      return NotFoundError.create('Not Found.  url={url}', {
        url,
        statusCode
      })
    }
    default: {
      return HttpError.create('Unknown HTTP error url={url}', {
        url,
        statusCode
      })
    }
  }
}
