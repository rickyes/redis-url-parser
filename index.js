const parseStandalone = (redisUrl) => {
  const url = new URL(redisUrl);

  const parsed = {
    password: url.password,
    db: Number(url.pathname.length ? url.pathname.slice(1) : 0),
    port: Number(url.port),
    host: url.hostname,
  };

  return parsed;
};

const parseSentinel = (redisUrl) => {
  // example: redis-sentinel://username:password@127.0.0.1:16379,127.0.0.1:26379/master_name/0
  const reg = new RegExp(/^redis-sentinel\:\/\/((.*)\:(.*)\@)?((?:[^\,\:]+\:\d+,?)+)\/([^\/]+)\/(\d+)$/);
  const matchResult = reg.exec(redisUrl);

  if (!matchResult) {
    throw new Error(`[ERR_INVALID_SENTINEL_REDIS_URL]: Invalid URL: ${redisUrl}`);
  }

  const parsed = {};

  const [,,username, password, ...nodes] = matchResult;
  username && (parsed.username = username);
  password && (parsed.password = password);

  parsed.db = parseInt(nodes.pop());
  parsed.name = nodes.pop();

  parsed.sentinels = nodes.filter(Boolean)[0].split(',').map(node => {
    const [ host, port ] = node.split(':');
    return { host, port: parseInt(port) };
  });

  return parsed;
};

module.exports = (redisUrls) => {
  if (!redisUrls) return;

  const redisConfig = {};
  try {
    const isSentinel = redisUrls.startsWith('redis-sentinel');
    const isPathMode = !isSentinel && !redisUrls.startsWith('redis:') && !redisUrls.startsWith('rediss:');
    if (isSentinel) {
      // sentinel mode url
      const sentinelConfig = parseSentinel(redisUrls);
      Object.assign(redisConfig, sentinelConfig);
    } else if (isPathMode) {
      // path mode
      Object.assign(redisConfig, { path: redisUrls });
    } else {
      // standalone/cluster mode url
      const nodes = redisUrls.split(',').map((node) => parseStandalone(node));
      if (nodes.length > 1) {
        redisConfig.cluster = true;
        redisConfig.nodes = nodes;
      } else {
        Object.assign(redisConfig, nodes[0]);
      }
    }
  } catch (error) {
    throw new Error(`[ERR_INVALID_REDIS_URL]: Invalid URL: ${redisUrls}`);
  }

  return redisConfig;
}