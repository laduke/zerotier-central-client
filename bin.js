var Configstore = require('configstore')
var prompt = require('password-prompt')
var cliclopts = require('cliclopts')
var pkg = require('./package.json')
var args = require('minimist')

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

var { _: [ subcommand ] } = argv

var authRe = /^au/ // auth

if (subcommand.match(authRe)) {
  authCommand(argv)
}

function authCommand (args) {
  console.log('Paste your api token from my.zerotier.com to save it for future use')
  prompt('api token: ')
    .then(token => {
      conf.set({ token })
      console.log(`Token saved to ${conf.path}`)
    })
}
