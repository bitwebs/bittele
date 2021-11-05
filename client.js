#!/usr/bin/env node
const HyperDHT = require('@hyperswarm/dht')
const net = require('net')
const pump = require('pump')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const connHandler = require('./lib.js').connHandler

const helpMsg = `Usage:\nhyperproxy -p port_listen -c conf.json`

if (argv.help) {
  console.log(helpMsg)
  process.exit(-1)
}

if (!+argv.p) {
  console.error('Error: proxy port invalid')
  process.exit(-1)
}

if (!argv.c) {
  console.error('Error: conf invalid')
  process.exit(-1)
}

let conf = null

try {
  conf = JSON.parse(fs.readFileSync(argv.c))
} catch (e) {
  console.error(e)
  process.exit(-1)
}

if (!conf.peer) {
  console.error('Error: conf.peer invalid')
  process.exit(-1)
}

const dht = new HyperDHT()

const proxy = net.createServer(function (socket) {
  return connHandler(c, () => {
    return dht.connect(Buffer.from(conf.peer, 'hex'))
  })
})

proxy.listen(+argv.p, function () {
  console.log(`Server ready @${argv.p}`)
})

process.once('SIGINT', function () {
  dht.destroy().then(function () {
    process.exit()
  })
})
