const test = require('tape')

const central = require('../index.js')

const o = {} // empty options

test('token is in header', t => {
  const opts = { token: '1234' }
  const res = central.networkList(opts)

  t.equal('bearer 1234', res.headers.authorization)

  t.end()
})

test('no token is in header', t => {
  const res = central.networkList(o)

  t.notOk(res.headers.authorization)

  t.end()
})

// not helpful in browser environment
// need relative paths
// test('invalid base url', t => {
//   t.throws(() => central.networkList({ base: 1234 }))

//   t.end()
// })

test('network - list', t => {
  const { url, ...opts } = central.networkList()

  t.equal('https://my.zerotier.com/api/network', url)
  t.equal('get', opts.method)

  t.end()
})

test('network - get', t => {
  const { url, ...opts } = central.networkGet(o, '6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal('get', opts.method)

  t.end()
})

test('network - get invalid network ID', t => {
  t.throws(() => central.networkGet(o, 1))
  t.throws(() => central.networkGet(o, 'zzzzzzzzzzzzzzzz'))
  t.throws(() => central.networkGet(o))

  t.end()
})

test('network - create', t => {
  const { url, ...opts } = central.networkCreate()

  t.equal('https://my.zerotier.com/api/network', url)
  t.equal('post', opts.method)

  t.end()
})

test('network - update', t => {
  const { url, ...opts } = central.networkUpdate(o, '6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal('post', opts.method)

  t.end()
})

test('network - delete', t => {
  const { url, ...opts } = central.networkDelete(o, '6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal('delete', opts.method)

  t.end()
})

test('status - get', t => {
  const { url, ...opts } = central.statusGet()

  t.equal('https://my.zerotier.com/api/status', url)
  t.equal('get', opts.method)

  t.end()
})

test('member - list', t => {
  const { url, ...opts } = central.memberList(o, '6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/member', url)
  t.equal('get', opts.method)

  t.end()
})

test('member - get', t => {
  const { url, ...opts } = central.memberGet(o, '6b3e0de52313eae8', '1122334455')

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455',
    url
  )
  t.equal('get', opts.method)

  t.end()
})

test('member - get throws', t => {
  t.throws(() => central.memberGet(o, '6b3e0de52313eae8', 'zzzz'))
  t.throws(() => central.memberGet(o, 'qqq', '1122334455'))
  t.throws(() => central.memberGet(o))

  t.end()
})

test('member - update', t => {
  const { url, ...opts } = central.memberUpdate(
    o,
    '6b3e0de52313eae8',
    '1122334455'
  )

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455',
    url
  )
  t.equal('post', opts.method)

  t.end()
})

test('member - delete', t => {
  const { url, ...opts } = central.memberDelete(
    o,
    '6b3e0de52313eae8',
    '1122334455'
  )

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455',
    url
  )
  t.equal('delete', opts.method)

  t.end()
})

const uuid = 'c42645f3-85e0-4774-bf39-bc34f8365764'
test('network user - list', t => {
  const { url, ...opts } = central.networkUserList(o, '6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/users', url)
  t.equal('get', opts.method)

  t.end()
})

test('network user - post', t => {
  const { url, ...opts } = central.networkUserCreate(o, '6b3e0de52313eae8', uuid)

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/users/' + uuid,
    url
  )
  t.equal('post', opts.method)

  t.end()
})

test('network user - update', t => {
  const { url, ...opts } = central.networkUserUpdate(o, '6b3e0de52313eae8', uuid)

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/users/' + uuid,
    url
  )
  t.equal('post', opts.method)

  t.end()
})

test('network user - delete', t => {
  const { url, ...opts } = central.networkUserDelete(o, '6b3e0de52313eae8', uuid)

  t.equal(
    'https://my.zerotier.com/api/network/6b3e0de52313eae8/users/c42645f3-85e0-4774-bf39-bc34f8365764',
    url
  )
  t.equal('delete', opts.method)

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
