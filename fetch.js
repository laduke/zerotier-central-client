require('cross-fetch/polyfill')

module.exports = send

function send (url, init) {
  return fetch(url, init) // eslint-disable-line
}
