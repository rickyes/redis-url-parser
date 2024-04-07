const { test } = require('tap');
const parser = require('.');

test('Without password', t => {
  
  const { host, db, password, port, cluster, nodes } = parser('redis://localhost:6379/1');

  t.equal(host, 'localhost');
  t.equal(db, 1);
  t.equal(password, '');
  t.equal(port, 6379);
  t.equal(host, 'localhost');
  t.equal(cluster, undefined);
  t.equal(nodes, undefined);

  t.end();
});

test('Without db', t => {
  
  const { host, db, password, port, cluster, nodes } = parser('redis://localhost:6379');

  t.equal(host, 'localhost');
  t.equal(db, 0);
  t.equal(password, '');
  t.equal(port, 6379);
  t.equal(host, 'localhost');
  t.equal(cluster, undefined);
  t.equal(nodes, undefined);

  t.end();
});

test('With password and user', t => {
  
  const { host, db, password, port, cluster, nodes } = parser('redis://user:pass@localhost:6379');

  t.equal(host, 'localhost');
  t.equal(db, 0);
  t.equal(password, 'pass');
  t.equal(port, 6379);
  t.equal(host, 'localhost');
  t.equal(cluster, undefined);
  t.equal(nodes, undefined);

  t.end();
});

test('With password and user and db', t => {
  
  const { host, db, password, port, cluster, nodes } = parser('redis://user:pass@localhost:6379/1');

  t.equal(host, 'localhost');
  t.equal(db, 1);
  t.equal(password, 'pass');
  t.equal(port, 6379);
  t.equal(host, 'localhost');
  t.equal(cluster, undefined);
  t.equal(nodes, undefined);

  t.end();
});

test('With only password', t => {
  
  const { host, db, password, port, cluster, nodes } = parser('redis://:pass@localhost:6379/1');

  t.equal(host, 'localhost');
  t.equal(db, 1);
  t.equal(password, 'pass');
  t.equal(port, 6379);
  t.equal(host, 'localhost');
  t.equal(cluster, undefined);
  t.equal(nodes, undefined);

  t.end();
});

test('With sentinel mode only password', t => {
  
  const { sentinels, name, db, username, password } = parser('redis-sentinel://:pwd@127.0.0.1:16379/master_name/2');

  t.equal(username, undefined);
  t.equal(password, 'pwd');
  t.equal(name, 'master_name');
  t.equal(db, 2);
  t.equal(sentinels.length, 1);

  t.equal(sentinels[0].host, '127.0.0.1');
  t.equal(sentinels[0].port, 16379);

  t.end();
});

test('With sentinel mode', t => {
  
  const { sentinels, name, db, username, password } = parser('redis-sentinel://usr:pwd@127.0.0.1:16379,127.0.0.2:26379/master_name/2');

  t.equal(username, 'usr');
  t.equal(password, 'pwd');
  t.equal(name, 'master_name');
  t.equal(db, 2);
  t.equal(sentinels.length, 2);

  t.equal(sentinels[0].host, '127.0.0.1');
  t.equal(sentinels[0].port, 16379);
  t.equal(sentinels[1].host, '127.0.0.2');
  t.equal(sentinels[1].port, 26379);

  t.end();
});

test('With sentinel mode 4 hosts', t => {
  
  const { sentinels, name, db, username, password } = parser('redis-sentinel://usr:pwd@host1.test.local:16379,host2.test.local:26379,host3:2678,host4.local:3679/master_name/2');

  t.equal(username, 'usr');
  t.equal(password, 'pwd');
  t.equal(name, 'master_name');
  t.equal(db, 2);
  t.equal(sentinels.length, 4);

  t.equal(sentinels[0].host, 'host1.test.local');
  t.equal(sentinels[0].port, 16379);
  t.equal(sentinels[1].host, 'host2.test.local');
  t.equal(sentinels[1].port, 26379);
  t.equal(sentinels[2].host, 'host3');
  t.equal(sentinels[2].port, 2678);
  t.equal(sentinels[3].host, 'host4.local');
  t.equal(sentinels[3].port, 3679);

  t.end();
});

test('With sentinel mode no user and no pass provided', t => {
  
  const { sentinels, name, db, username, password } = parser('redis-sentinel://sentinel:26379,sentinel2:26379,sentinel3:26379/mymaster/0');

  t.equal(username, undefined);
  t.equal(password, undefined);
  t.equal(name, 'mymaster');
  t.equal(db, 0);
  t.equal(sentinels.length, 3);

  t.equal(sentinels[0].host, 'sentinel');
  t.equal(sentinels[0].port, 26379);
  t.equal(sentinels[1].host, 'sentinel2');
  t.equal(sentinels[1].port, 26379);
  t.equal(sentinels[2].host, 'sentinel3');
  t.equal(sentinels[2].port, 26379);

  t.end();
});

test('With specific cluster mode and 1 node', t => {
  
  const { cluster, nodes } = parser('redis-cluster://localhost:6379');

  t.equal(cluster, true);
  t.equal(nodes.length, 1);

  t.equal(nodes[0].port, 6379);
  t.equal(nodes[0].host, 'localhost');
  t.equal(nodes[0].db, '');
  t.equal(nodes[0].password, '');
  t.equal(nodes[0].cluster, undefined);
  t.equal(nodes[0].nodes, undefined);

  t.end();
});

test('With specific cluster mode and 2 node', t => {
  
  const { cluster, nodes } = parser('redis-cluster://localhost:6379,localhost:6378');

  t.equal(cluster, true);
  t.equal(nodes.length, 2);

  t.equal(nodes[0].port, 6379);
  t.equal(nodes[1].port, 6378);
  for (const node of nodes) {
    t.equal(node.host, 'localhost');
    t.equal(node.db, '');
    t.equal(node.password, '');
    t.equal(node.cluster, undefined);
    t.equal(node.nodes, undefined);
  }

  t.end();
});

test('With specific cluster mode and throw error', t => {
  t.throws(() => parser('redis-cluster://1'), '[ERR_INVALID_CLUSTER_REDIS_URL]: Invalid URL: redis-cluster://1');

  t.end();
});


test('With cluster mode', t => {
  
  const { host, db, password, port, cluster, nodes } = parser('redis://localhost:6379/0,redis://localhost:6378/0');

  t.equal(host, undefined);
  t.equal(db, undefined);
  t.equal(password, undefined);
  t.equal(port, undefined);
  t.equal(host, undefined);
  t.equal(cluster, true);
  t.equal(nodes.length, 2);

  t.equal(nodes[0].port, 6379);
  t.equal(nodes[1].port, 6378);
  for (const node of nodes) {
    t.equal(node.host, 'localhost');
    t.equal(node.db, 0);
    t.equal(node.password, '');
    t.equal(node.host, 'localhost');
    t.equal(node.cluster, undefined);
    t.equal(node.nodes, undefined);
  }

  t.end();
});

test('Without url', t => {
  t.equal(parser(), undefined);
  t.equal(parser(''), undefined);
  t.throws(() => parser('1'), '[ERR_INVALID_REDIS_URL]: Invalid URL: 1');
  t.end();
});

test('With invalid sentinel url', t => {
  t.throws(
    () => parser('redis-sentinel://usr:pwd@127.0.0.1:16379,127.0.0.1:26379'), 
    '[ERR_INVALID_REDIS_URL]: Invalid URL: redis-sentinel://usr:pwd@127.0.0.1:16379,127.0.0.1:26379'
  );

  t.end();
});

test('With socket path', (t) => {
  t.equal(parser('socket://tmp/redis.sock').path, '/tmp/redis.sock');
  t.equal(parser('socket:///tmp/redis.sock').path, '/tmp/redis.sock');
  t.throws(() => parser('socket:/1'), '[ERR_INVALID_SOCKET_PATH]: Invalid URL: socket:/1');

  t.end();
});
