# redis-url-plus

[![NPM version][npm-image]][npm-url]
[![Codacy][codacy-image]][codacy-url]
[![build status][build-image]][build-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm downloads/month][downloads-month-image]][download-url]
[![npm downloads][downloads-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/redis-url-plus.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/redis-url-plus
[build-image]: https://github.com/rickyes/redis-url-plus/actions/workflows/node.js.yml/badge.svg?branch=main
[build-url]: https://github.com/rickyes/redis-url-plus
[codecov-image]: https://codecov.io/gh/rickyes/redis-url-plus/branch/main/graph/badge.svg?token=T6eRV9TZp6
[codecov-url]: https://codecov.io/github/rickyes/redis-url-plus?branch=master
[downloads-month-image]: https://img.shields.io/npm/dm/redis-url-plus.svg?style=flat-square
[download-url]: https://npmjs.org/package/redis-url-plus
[downloads-image]: https://img.shields.io/npm/dt/redis-url-plus.svg
[codacy-image]: https://app.codacy.com/project/badge/Grade/7a96dea4ed924752b2f131c0ab5ec812
[codacy-url]: https://app.codacy.com/manual/rickyes/redis-url-plus

Redis Connect URL parser aligned with Redis-CLI commands

## Features

0. Standalone
1. Cluster
2. Sentinel
3. Unix Domain Socket

## Install

```bash
$ yarn add redis-url-plus
# or
$ npm i redis-url-plus
```

## Usage

```bash
# standalone/cluster
redis://username:password@host:port/db[,redis://username:password@host:port/db]

# sentinel
redis-sentinel://[username:password@]host:port[,host:port]/master_name/db

# unix domain socket
socket://tmp/redis.sock

# cluster
redis-cluster://host:port[,host:port]
```

```js
const RedisUrlParser = require('redis-url-plus');

RedisUrlParser('redis://localhost:6379/0');

// redis://localhost:6379/0 ==> { password: '', db: 0, port: 6379, host: 'localhost' }
// redis://localhost:6379, ==> { password: '', db: 0, port: 6379, host: 'localhost' }
// redis://user:pass@localhost:6379, ==> { password: 'pass', db: 0, port: 6379, host: 'localhost' }
/**
 * redis://localhost:6379,redis://localhost:6378,redis://localhost:6377
 *
 * ||
 * 
 * {
 *   cluster: true,
 *     nodes: [
 *      { password: '', db: 0, port: 6379, host: 'localhost' },
 *      { password: '', db: 0, port: 6378, host: 'localhost' },
 *      { password: '', db: 0, port: 6377, host: 'localhost' }
 *    ]
 * }
 **/

// redis-sentinel://sentinel:26379/mymaster/0 ==> { db: 0, name: 'mymaster', sentinels: [{ host: 'sentinel', port: 26379 }] }
/**
 * 
 * redis-sentinel://usr:pwd@sentinel:26379/mymaster/0
 * 
 * ||
 * 
 * { username: 'usr', password: 'pwd', db: 0, name: 'mymaster', sentinels: [{ host: 'sentinel', port: 26379 }] }
 *  
 **/

// socket://tmp/redis.sock ==> { path: '/tmp/redis.sock' }

// redis-cluster://localhost:6379 ==> { cluster: true, nodes: [{ host: 'localhost', port: 6379 }] }
/**
 * 
 * redis-cluster://localhost:6379,localhost:6380
 * 
 * ||
 * 
 * { cluster: true, nodes: [{ host: 'localhost', port: 6379 }, { host: 'localhost', port: 6380 }] }
 *  
 **/

```

## Support Version

- 10
- 12
- 14
- 16
