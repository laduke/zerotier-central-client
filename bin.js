var Configstore = require('configstore')
var prompt = require('password-prompt')
var JSONStream = require('JSONStream')
var cliclopts = require('cliclopts')
var pkg = require('./package.json')
var through = require('through2')
var args = require('minimist')
var Central = require('./api')

var conf = new Configstore(pkg.name, {}, { globalConfigPath: true })

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
  var { _: [ , subcommand ], token } = args

  var central = Central({ token })

  var listRe = /^l/

  if (!subcommand) {
    return console.log('Usage: network list')
  }

  if (subcommand.match(listRe)) {
    networkList(args)
  }

  function networkList (args) {
    central.networkList()
      .on('error', console.error)
      .pipe(JSONStream.parse('*'))
      .pipe(networkPrint())
      .pipe(process.stdout)
  }

  function networkPrint () {
    return through.obj(
      function (chunk, enc, cb) {
        var result = [ chunk.id, chunk.config.name ].join('\t')
        cb(null, result + '\n')
      }
    )
  }
}
