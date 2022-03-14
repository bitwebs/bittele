# @web4/bitproxy


### server

```
bitproxy-server --help
```

```
bitproxy-server --gen_seed
```

Create a JSON config file for your server
```
{
  "seed": "SEED_ABOVE"
}
```

```
# -l 7001 <---- port of the local service you want to expose to the swarm
bitproxy-server -l 7001 -c config-server.json
# the command will print out the pubkey
```


### client

Create a JSON config file for your client
```
{
  "peer": "PUBKEY_FROM_SERVER"
}
```

```
bitproxy -p 1337 -c config-client.json
telnet localhost 1337
```
