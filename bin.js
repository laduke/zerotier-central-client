var cliclopts = require('cliclopts')
var args = require('minimist')

var cliOpts = cliclopts([
  {
    name: 'help',
    abbr: 'h',
    help: 'Show help',
    boolean: true
  }
])

var argv = args(process.argv.slice(2), cliOpts.options())

if (argv.help || !argv._[0]) {
  console.log('Usage: central <command>')
  cliOpts.print()
  process.exit(0)
}
