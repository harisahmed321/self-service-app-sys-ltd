const log4js = require('log4js');
const moment = require('moment');

const date = moment(new Date()).format('DD-MM-YYYY');

log4js.configure({
  appenders: { logging: { type: 'file', filename: `logs/${date}.log` } },
  categories: { default: { appenders: ['logging'], level: 'error' } },
});

const logger = log4js.getLogger('SS');

error = (err, req, res) => {
  const log = `[${req.method}] ${req.url} [body] ${JSON.stringify(req.body)}
  [Message] ${err.message}`;
  //   console.log(log);
  logger.error(log);
};

module.exports = { error };
