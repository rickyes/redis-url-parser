const parse = (redisUrl) => {
  const url = new URL(redisUrl);

  const parsed = {
    password: url.password,
    db: Number(url.pathname.length ? url.pathname.slice(1) : 0),
    port: Number(url.port),
    host: url.hostname,
  };

  return parsed;
};


module.exports = (redisUrls) => {
  if (!redisUrls) return;

  const redisConfig = {};
  try {
    const nodes = redisUrls.split(',').map((node) => parse(node));
    if (nodes.length > 1) {
      redisConfig.cluster = true;
      redisConfig.nodes = nodes;
    } else {
      Object.assign(redisConfig, nodes[0]);
    }
  } catch (error) {
    throw new Error(`[ERR_INVALID_REDIS_URL]: Invalid URL: ${redisUrls}`);
  }

  return redisConfig;
}