# redis-url-plus
Redis Connect URL parser aligned with Redis-CLI commands 


## Install
```bash
$ yarn add redis-url-plus
# or
$ npm i redis-url-plus
```

## Usage

```bash
redis://username:password@host:port/db[,redis://username:password@host:port/db]
```

```js
const RedisUrlParser = require('redis-url-plus');

RedisUrlParser('redis://localhost:6379/0');

// redis://localhost:6379/0 ==> { password: '', db: 0, port: 6379, host: 'localhost' }
// redis://localhost:6379, ==> { password: '', db: 0, port: 6379, host: 'localhost' }
// redis://user:pass@localhost:6379, ==> { password: 'pass', db: 0, port: 6379, host: 'localhost' }

/*
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
 */
```