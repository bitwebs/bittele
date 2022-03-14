#!/usr/bin/env node
const BitDHT = require('@web4/dht')
const net = require('net')
const sodium = require('sodium-universal')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const connHandler = require('./lib.js').connHandler

const helpMsg = `Usage:\nbitproxy-server -l port_local -c conf.json ?-k
bitproxy-server --gen_seed`

if (argv.help) {
  console.log(helpMsg)
  process.exit(-1)
}

if (argv.gen_seed) {
  console.log('Init Seed:', randomBytes(32).toString('hex'))
  process.exit(-1)
}

if (!+argv.l) {
  console.error('Error: proxy port invalid')
  process.exit(-1)
}

if (!argv.c) {
  console.error('Error: conf invalid')
  process.exit(-1)
}

if (argv.k) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
}

let conf = null

try {
  conf = JSON.parse(fs.readFileSync(argv.c))
} catch (e) {
  console.error(e)
  process.exit(-1)
}

if (!conf.seed) {
  console.error('Error: conf.seed invalid')
  process.exit(-1)
}

const seed = Buffer.from(conf.seed, 'hex')

const dht = new BitDHT()
const keyPair = BitDHT.keyPair(seed)

const server = dht.createServer(c => {
  return connHandler(c, () => {
    return net.connect(+argv.l, '127.0.0.1')
  })
})

server.listen(keyPair).then(() => {
  console.log('bitproxy:', keyPair.publicKey.toString('hex'))
})

process.once('SIGINT', function () {
  dht.destroy()
})

function randomBytes (n) {
  const b = Buffer.alloc(n)
  sodium.randombytes_buf(b)
  return b
}
