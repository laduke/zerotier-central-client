const test = require('tape')

const Central = require('./index.js')

test('token is in header', t => {
  const central = Central({ token: '1234' })
  const res = central.networkList()

  t.equal('bearer 1234', res.headers.authorization)

  t.end()
})

test('no token is in header', t => {
  const central = new Central()
  const res = central.networkList()

  t.notOk(res.headers.authorization)

  t.end()
})

test('invalid base url', t => {
  t.throws(() => new Central({ base: 1234 }))

  t.end()
})

test('network - list', t => {
  const central = new Central()
  const { url, ...opts } = central.networkList()

  t.equal('https://my.zerotier.com/api/network', url)
  t.equal('get', opts.method)

  t.end()
})

test('network - get', t => {
  const central = new Central({ token: '1234' })
  const { url, ...opts } = central.networkGet('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal('get', opts.method)

  t.end()
})

test('network - get invalid network ID', t => {
  const central = new Central({ token: '1234' })

  t.throws(() => central.networkGet(1))
  t.throws(() => central.networkGet('zzzzzzzzzzzzzzzz'))
  t.throws(() => central.networkGet())

  t.end()
})

test('network - create', t => {
  const central = new Central({ token: '1234' })
  const { url, ...opts } = central.networkCreate()

  t.equal('https://my.zerotier.com/api/network', url)
  t.equal('post', opts.method)

  t.end()
})

test('network - update', t => {
  const central = Central({ token: '1234' })
  const { url, ...opts } = central.networkUpdate('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal('post', opts.method)

  t.end()
})

test('network - delete', t => {
  const central = Central()
  const { url, ...opts } = central.networkDelete('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8', url)
  t.equal('delete', opts.method)

  t.end()
})

test('status - get', t => {
  const central = Central()
  const { url, ...opts } = central.statusGet()

  t.equal('https://my.zerotier.com/api/status', url)
  t.equal('get', opts.method)

  t.end()
})

test('member - list', t => {
  const central = Central()
  const { url, ...opts } = central.memberList('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/member', url)
  t.equal('get', opts.method)

  t.end()
})

test('member - get', t => {
  const central = Central()
  const { url, ...opts } = central.memberGet('6b3e0de52313eae8', '1122334455')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455', url)
  t.equal('get', opts.method)

  t.end()
})

test('member - get throws', t => {
  const central = Central()

  t.throws(() => central.memberGet('6b3e0de52313eae8', 'zzzz'))
  t.throws(() => central.memberGet('qqq', '1122334455'))
  t.throws(() => central.memberGet())

  t.end()
})

test('member - update', t => {
  const central = Central()
  const { url, ...opts } = central.memberUpdate('6b3e0de52313eae8', '1122334455')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455', url)
  t.equal('post', opts.method)

  t.end()
})

test('member - delete', t => {
  const central = Central()
  const { url, ...opts } = central.memberDelete('6b3e0de52313eae8', '1122334455')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/member/1122334455', url)
  t.equal('delete', opts.method)

  t.end()
})

test('network user - list', t => {
  const central = Central()
  const { url, ...opts } = central.networkUserList('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/users', url)
  t.equal('get', opts.method)

  t.end()
})

test('network user - post', t => {
  const central = Central()
  const { url, ...opts } = central.networkUserCreate('6b3e0de52313eae8')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/users', url)
  t.equal('post', opts.method)

  t.end()
})

test('network user - delete', t => {
  const central = Central()
  const { url, ...opts } = central.networkUserDelete('6b3e0de52313eae8', 'c42645f3-85e0-4774-bf39-bc34f8365764')

  t.equal('https://my.zerotier.com/api/network/6b3e0de52313eae8/users/c42645f3-85e0-4774-bf39-bc34f8365764', url)
  t.equal('post', opts.method)

  t.end()
})

test('axios and fetch for real', async t => {
  if (process.env.CENTRAL_TOKEN) {
    const central = Central({ token: process.env.API_TOKEN })

    const axios = require('axios').default
    const result = await axios(central.statusGet())
    t.ok(result.data.id)

    const fetch = require('node-fetch')
    const { url, ...opts } = central.statusGet()
    const result2 = await fetch(url, opts).then(res => res.json())
    t.ok(result2.id)

    t.end()
  } else {
    t.end()
  }
})
