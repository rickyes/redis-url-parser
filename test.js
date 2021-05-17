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