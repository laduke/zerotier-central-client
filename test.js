const test = require('tape')
const td = require('testdouble')

const base = 'http://localhost/api/'

const Central = require('./index.js')

test('the request maker thing', u => {
  td.reset()

  test('Get Status', async t => {
    const fetchMock = require('fetch-mock')
    fetchMock.get(`${base}status`, {})

    const central = Central({ base })

    const res = await central.getStatus()
    t.deepEqual({}, res)

    fetchMock.restore()
  })

  test('Get RandomToken', async t => {
    const fetchMock = require('fetch-mock')
    fetchMock.get(`${base}randomToken`, {})

    const central = Central({ base })

    const res = await central.getRandomToken()
    t.deepEqual({}, res)

    fetchMock.restore()
  })

  test('Get Networks', async t => {
    const fetchMock = require('fetch-mock')
    fetchMock.get(`${base}network`, {})

    const central = Central({ base })

    const res = await central.getNetworks()
    t.deepEqual({}, res)

    fetchMock.restore()
  })

  test('Get Network', async t => {
    const id = '1122334455aabbcc'

    const fetchMock = require('fetch-mock')
    fetchMock.get(`${base}network/${id}`, {})

    const central = Central({ base })

    const res = await central.getNetwork(id)
    t.deepEqual({}, res)

    fetchMock.restore()
  })

  test('Get Members', async t => {
    const id = '1122334455aabbcc'

    const fetchMock = require('fetch-mock')
    fetchMock.get(`${base}network/${id}/member`, {})

    const central = Central({ base })

    const res = await central.getMembers(id)
    t.deepEqual({}, res)

    fetchMock.restore()
  })

  test('Get Member', async t => {
    const nwid = '1122334455aabbcc'
    const memb = 'ffeeddcc'

    const fetchMock = require('fetch-mock')
    fetchMock.get(`${base}network/${nwid}/member/${memb}`, {})

    const central = Central({ base })

    const res = await central.getMember(nwid, memb)
    t.deepEqual({}, res)

    fetchMock.restore()
  })

  test('Set Network', async t => {
    const nwid = '1122334455aabbcc'
    const config = { beep: 'boop' }

    const fetchMock = require('fetch-mock')
    fetchMock.post({ url: `${base}network/${nwid}`, body: config }, {})

    const central = Central({ base })

    const res = await central.setNetwork(nwid, config)
    t.deepEqual({}, res)

    fetchMock.restore()
  })

  test('Create Network', async t => {
    const config = { private: true }

    const fetchMock = require('fetch-mock')
    fetchMock.post({ url: `${base}network`, body: config }, {})

    const central = Central({ base })

    const res = await central.createNetwork(config)
    t.deepEqual({}, res)

    fetchMock.restore()
  })

  test('Set Member', async t => {
    const nwid = '1122334455aabbcc'
    const memb = 'ffeeddcc'
    const config = { config: { authorized: true } }

    const fetchMock = require('fetch-mock')
    fetchMock.post(
      { url: `${base}network/${nwid}/member/${memb}`, body: config },
      {}
    )

    const central = Central({ base })

    const res = await central.setMember(nwid, memb, config)
    t.deepEqual({}, res)

    fetchMock.restore()
  })
  u.end()
})

test('errors', async tt => {
  test('network error', async t => {
    const fetchMock = require('fetch-mock')
    fetchMock.mock('*', { throws: new Error('NetworkError') })

    const central = Central({ base })

    await central
      .getStatus()
      .then(x => {
        t.error('should have been a network error')
      })
      .catch(e => {
        t.ok(e.message)
        t.end()
      })

    fetchMock.restore()
  })

  test('authentication error', async t => {
    const fetchMock = require('fetch-mock')
    fetchMock.mock('*', {
      status: 401,
      body: { type: 'internal', message: 'Unauthentic' }
    })

    const central = Central({ base })

    await central
      .getStatus()
      .then(() => {
        t.error('should have been an Auth Error')
      })
      .catch(e => {
        t.equal(e.type, 'authentication.error')
        t.end()
      })

    fetchMock.restore()
  })

  test('authorization error', async t => {
    const fetchMock = require('fetch-mock')
    fetchMock.mock('*', {
      status: 403,
      body: { type: 'internal', message: 'Unauthorized' }
    })

    const central = Central({ base })

    await central
      .getStatus()
      .then(() => {
        t.error('should not be here')
      })
      .catch(e => {
        t.equal(e.type, 'authorization.error')
        t.end()
      })

    fetchMock.restore()
  })

  test('not found error', async t => {
    const fetchMock = require('fetch-mock')
    fetchMock.mock('*', {
      status: 404,
      body: { type: 'internal', message: 'not found' }
    })

    const central = Central({ base })

    await central
      .getStatus()
      .then(() => {
        t.error('should not be here')
      })
      .catch(e => {
        t.equal(e.type, 'not.found.error')
        t.end()
      })

    fetchMock.restore()
  })

  test('json error', async t => {
    const fetchMock = require('fetch-mock')
    fetchMock.mock('*', { status: 200, body: '}}{{{{--{}}' })

    const central = Central({ base })

    await central
      .getStatus()
      .then(x => {
        t.error('should have been a JSON error')
        console.log(x)
      })
      .catch(e => {
        t.equal(e.type, 'json.error')
        t.end()
      })

    fetchMock.restore()
  })

  tt.end()
})

test('really calls central', async t => {
  td.reset()
  if (process.env.CENTRAL_TOKEN) {
    const central = Central({ token: process.env.CENTRAL_TOKEN })

    const status = await central.getStatus()
    t.ok(status.version)

    t.end()
  } else {
    t.end()
  }
})
