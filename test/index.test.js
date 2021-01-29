const test = require('tape')

const { Central } = require('../index.js')

const central = Central({ token: '1234' })

const GET = 'GET'
const POST = 'POST'
const DELETE = 'DELETE'

test('token is in header', t => {
  const req = central.networkList()

  t.equal('bearer 1234', req.headers.Authorization)

  t.end()
})

test('no token is in header', t => {
  const central = Central()
  const req = central.networkList()

  t.notOk(req.headers.Authorization)

  t.end()
})

test('network - list', t => {
  const { url, ...opts } = central.networkList()

  t.equal('https://my.zerotier.com/api/network', url)
  t.equal(GET, opts.method)

  t.end()
})

test('network - get', t => {
  const { url, ...opts } = central.networkGet('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal(GET, opts.method)

  t.end()
})

test('network - create', t => {
  const { url, ...opts } = central.networkCreate()

  t.equal('https://my.zerotier.com/api/network', url)
  t.equal(POST, opts.method)

  t.end()
})

test('network - update', t => {
  const { url, ...opts } = central.networkUpdate('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal(POST, opts.method)

  t.end()
})

test('network - delete', t => {
  const { url, ...opts } = central.networkDelete('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal(DELETE, opts.method)

  t.end()
})

test('status - get', t => {
  const { url, ...opts } = central.statusGet()

  t.equal('https://my.zerotier.com/api/status', url)
  t.equal(GET, opts.method)

  t.end()
})

test('member - list', t => {
  const { url, ...opts } = central.memberList('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/member', url)
  t.equal(GET, opts.method)

  t.end()
})

test('member - get', t => {
  const { url, ...opts } = central.memberGet(
    '6b3e0de52313eae8',
    '1122334455'
  )

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455',
    url
  )
  t.equal(GET, opts.method)

  t.end()
})

test('member - update', t => {
  const { url, ...opts } = central.memberUpdate(
    '6b3e0de52313eae8',
    '1122334455'
  )

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455',
    url
  )
  t.equal(POST, opts.method)

  t.end()
})

test('member - delete', t => {
  const { url, ...opts } = central.memberDelete(
    '6b3e0de52313eae8',
    '1122334455'
  )

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455',
    url
  )
  t.equal(DELETE, opts.method)

  t.end()
})

test('axios and fetch for real', async t => {
  if (process.env.CENTRAL_TOKEN) {
    const optz = {
      token: process.env.API_TOKEN
    }

    const axios = require('axios').default
    const result = await axios(central.statusGet(optz))
    t.ok(result.data.id)

    const fetch = require('node-fetch')
    const { url, ...opts } = central.statusGet(optz)
    const result2 = await fetch(url, opts).then(res => res.json())
    t.ok(result2.id)

    t.end()
  } else {
    t.end()
  }
})
