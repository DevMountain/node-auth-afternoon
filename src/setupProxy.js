const proxy = require('http-proxy-middleware');

module.exports = app => {
  app.use(proxy('/callback', { target: 'http://localhost:4000' }));
  app.use(proxy('/api', { target: 'http://localhost:4000' }));
};
