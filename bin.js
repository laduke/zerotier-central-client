var Configstore = require('configstore')
var prompt = require('password-prompt')
var JSONStream = require('JSONStream')
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
    help: 'More output'
  }
])

var argv = args(process.argv.slice(2), cliOpts.options())

argv.token = argv.token || conf.get('token')

if (argv.help || !argv._[0]) {
  console.log('Usage: central <command>')
  cliOpts.print()

  console.log('These are some of the commands commands')
  console.log('\tauth\tSave an API token')
  process.exit(0)
}

var { _: [ command ] } = argv

var authRe = /^au/ // auth
var networkRe = /^n/ // network

if (command.match(authRe)) {
  authCommand(argv)
} else if (command.match(networkRe)) {
  networkCommand(argv)
}

function authCommand (args) {
  console.log('Paste your api token from my.zerotier.com to save it for future use')
  prompt('api token: ')
    .then(token => {
      conf.set({ token })
      console.log(`Token saved to ${conf.path}`)
    })
}

function networkCommand (args) {
  var { _: [ , subcommand ], token, verbose } = args

  var central = Central({ token })

  var listRe = /^l/

  if (!subcommand) {
    return console.log('Usage: network list')
  }

  if (subcommand.match(listRe)) {
    networkList(args)
  }

  function networkList (args) {
    console.log(verbose ? headerVerbose() : header())
    central.networkList()
      .on('error', console.error)
      .pipe(JSONStream.parse('*'))
      .pipe(verbose ? networkPrintVerbose() : networkPrint())
      .pipe(process.stdout)
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

  function networkPrint () {
    return through.obj(
      function (chunk, enc, cb) {
        var route = chunk.config.routes[0] ? chunk.config.routes[0].target : ''
        var result = [
          fmt(chunk.id, MED),
          fmt(chunk.config.name, MED),
          fmt(route, WID)
        ].join('\t')
        cb(null, result + '\n')
      }
    )
  }

  function networkPrintVerbose () {
    return through.obj(
      function (chunk, enc, cb) {
        var route = chunk.config.routes[0] ? chunk.config.routes[0].target : ''

        var pool = chunk.config.ipAssignmentPools[0]
          ? chunk.config.ipAssignmentPools[0].ipRangeStart : ''
        var end = chunk.config.ipAssignmentPools[0]
          ? chunk.config.ipAssignmentPools[0].ipRangeEnd : ''

        var result = [
          fmt(chunk.id, MED),
          fmt(chunk.config.name, MED),
          fmt(chunk.description, MED),
          fmt(route, WID),
          fmt(pool + ' - ' + end, WID)
        ].join('\t')
        cb(null, result + '\n')
      }
    )
  }
}

function fmt (str, width) {
  return trunc(str || '-', width, { position: 'middle' })
}
