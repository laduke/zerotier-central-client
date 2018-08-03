#!/usr/bin/env node

var Configstore = require('configstore')
var prompt = require('password-prompt')
var JSONStream = require('JSONStream')
var concat = require('concat-stream')
var cliclopts = require('cliclopts')
var pkg = require('./package.json')
var trunc = require('cli-truncate')
var through = require('through2')
var args = require('minimist')
var Central = require('./api')

var conf = new Configstore(pkg.name, {}, { globalConfigPath: true })

var MED = 16
var WID = 32

var cliOpts = cliclopts([
  {
    name: 'help',
    abbr: 'h',
    help: 'Show help',
    boolean: true
  },
  {
    name: 'token',
    abbr: 't',
    help: 'API token from my.zerotier.com'
  },
  {
    name: 'verbose',
    abbr: 'v',
    help: 'More output',
    boolean: true
  },
  {
    name: 'json',
    abbr: 'j',
    help: 'Raw json output',
    boolean: true
  }
])

var argv = args(process.argv.slice(2), cliOpts.options())

argv.token = argv.token || conf.get('token')

if (argv.help || !argv._[0]) {
  console.log('Usage: central <command>')
  cliOpts.print()

  console.log('These are some of the commands commands\n')
  console.log('\tauth        \tSave an API token')
  console.log()
  console.log('\tnetwork list\t\tlist your networks')
  console.log('\tnetwork get <id>\tget a specific network')
  console.log('\tnetwork add\t\tcreate a network')
  console.log()
  console.log('\tmember list <network_id>')
  process.exit(0)
}

var { _: [ command ] } = argv

var authRe = /^au/ // 'auth'
var networkRe = /^n/ // 'network'
var memberRe = /^m/ // 'member'

var listRe = /^l/ // 'list'

if (command.match(authRe)) {
  authCommand(argv)
} else if (command.match(networkRe)) {
  networkCommand(argv)
} else if (command.match(memberRe)) {
  memberCommand(argv)
}

function memberCommand (args) {
  var { _: [ , subcommand ], token } = args
  var central = Central({ token })

  if (!subcommand) {
    return console.log('Usage: member list')
  } else if (subcommand.match(listRe)) {
    memberList(args)
  }

  function memberList (args) {
    var { _: [ , , networkId ] } = args
    if (args.json) {
      central.memberList(networkId)
        .on('error', console.error)
        .pipe(process.stdout)
    } else if (args.verbose) {
      console.log(headerVerbose())
      central.memberList(networkId)
        .on('error', console.error)
        .pipe(JSONStream.parse('*'))
        .pipe(formatObj(memberPrintVerbose))
        .pipe(process.stdout)
    } else {
      console.log(header())
      central.memberList(networkId)
        .on('error', console.error)
        .pipe(JSONStream.parse('*'))
        .pipe(formatObj(memberPrint))
        .pipe(process.stdout)
    }
  }

  function memberPrint (chunk) {
    return [
      fmt(chunk.nodeId, MED),
      fmt(chunk.name, WID),
      fmt(chunk.config.authorized.toString(), MED)
    ].join('\t') + '\n'
  }

  function header () {
    return [
      fmt('<node id>', MED),
      fmt('<name>', MED),
      fmt('<authorized>', WID)
    ].join('\t')
  }

  function memberPrintVerbose (chunk) {
    var ip1 = chunk.config.ipAssignments[0]

    return [
      fmt(chunk.nodeId, MED),
      fmt(chunk.name, WID),
      fmt(chunk.config.authorized.toString(), MED),
      fmt(chunk.physicalAddress, MED),
      fmt(ip1, MED)

    ].join('\t') + '\n'
  }

  function headerVerbose () {
    return [
      fmt('<node id>', MED),
      fmt('<name>', MED),
      fmt('<authorized>', WID),
      fmt('<wan ip>', WID),
      fmt('<zt ipv4>', WID)
    ].join('\t')
  }
}

function authCommand (args) {
  console.log('Paste your api token from my.zerotier.com to save it for future use')
  prompt('api token: ')
    .then(token => {
      conf.set({ token })
      console.log(`Token saved to ${conf.path}`)
    }, e => {
      console.log('exiting')
      process.exit(1)
    })
}

function networkCommand (args) {
  var { _: [ , subcommand ], token } = args

  var central = Central({ token })

  var getRe = /^g/
  var addRe = /^a/

  if (!subcommand) {
    return console.log('Usage: network list')
  }

  if (subcommand.match(listRe)) {
    networkList(args)
  } else if (subcommand.match(getRe)) {
    networkGet(args)
  } else if (subcommand.match(addRe)) {
    networkAdd(args)
  }

  function networkAdd (args) {
    if (args.json) {
      central.networkCreate()
        .on('error', console.error)
        .pipe(process.stdout)
    } else if (args.verbose) {
      console.log(headerVerbose())
      central.networkCreate()
        .on('error', console.error)
        .pipe(concat(gotBody(networkPrintVerbose)))
    } else {
      console.log(header())
      central.networkCreate()
        .on('error', console.error)
        .pipe(concat(gotBody(networkPrint)))
    }
  }

  function networkGet (args) {
    var { _: [ , , networkId ] } = args

    if (!networkId) {
      console.error('Need a Network ID to get')
      console.error('Network IDs are 16 characters 0-9 A-F')
      console.error('Try: `zt-central network list`')
    } else {
      if (args.json) {
        central.networkGet(networkId)
          .on('error', console.error)
          .pipe(process.stdout)
      } else if (args.verbose) {
        console.log(headerVerbose())

        central.networkGet(networkId)
          .on('error', console.error)
          .pipe(concat(gotBody(networkPrintVerbose)))
      } else {
        console.log(header())

        central.networkGet(networkId)
          .on('error', console.error)
          .pipe(concat(gotBody(networkPrint)))
      }
    }
  }

  function networkList (args) {
    if (args.json) {
      central.networkList()
        .on('error', console.error)
        .pipe(process.stdout)
    } else if (args.verbose) {
      console.log(headerVerbose())
      central.networkList()
        .on('error', console.error)
        .pipe(JSONStream.parse('*'))
        .pipe(formatObj(networkPrintVerbose))
        .pipe(process.stdout)
    } else {
      console.log(header())
      central.networkList()
        .on('error', console.error)
        .pipe(JSONStream.parse('*'))
        .pipe(formatObj(networkPrint))
        .pipe(process.stdout)
    }
  }

  function header () {
    return [
      fmt('<network id>', MED),
      fmt('<network name>', MED),
      fmt('<first route>', WID)
    ].join('\t')
  }

  function headerVerbose () {
    return [
      fmt('<network id>', MED),
      fmt('<name>', MED),
      fmt('<description>', MED),
      fmt('<first route>', WID),
      fmt('<auto-assign>', WID)
    ].join('\t')
  }

  function networkPrint (chunk) {
    var route = chunk.config.routes[0] ? chunk.config.routes[0].target : ''
    return [
      fmt(chunk.id, MED),
      fmt(chunk.config.name, MED),
      fmt(route, WID)
    ].join('\t') + '\n'
  }

  function networkPrintVerbose (chunk) {
    var route = chunk.config.routes[0] ? chunk.config.routes[0].target : ''

    var pool = chunk.config.ipAssignmentPools[0]
      ? chunk.config.ipAssignmentPools[0].ipRangeStart : ''
    var end = chunk.config.ipAssignmentPools[0]
      ? chunk.config.ipAssignmentPools[0].ipRangeEnd : ''

    return [
      fmt(chunk.id, MED),
      fmt(chunk.config.name, MED),
      fmt(chunk.description, MED),
      fmt(route, WID),
      fmt(pool + ' - ' + end, WID)
    ].join('\t') + '\n'
  }
}

function formatObj (formatter) {
  return through.obj(
    function (chunk, enc, cb) {
      cb(null, formatter(chunk))
    }
  )
}

function gotBody (fmt) {
  return function (body) {
    console.log(fmt(JSON.parse(body.toString())))
  }
}

function fmt (str, width) {
  return trunc(str || '-', width, { position: 'middle' })
}
