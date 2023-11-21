// const winston = require('winston')
// const DailyRotateFile = require('winston-daily-rotate-file')
// const moment = require('moment')
// const config = require('config')

// const environment = config.util.getEnv('NODE_ENV') || 'dev'
// const { logPath, datePattern, levels } = config.get('loggerConfig')

// const myFormat = winston.format.printf((info) => {
//   const { timestamp, level, message, ...meta } = info
//   const time = moment(timestamp).format()
//   return `[${time}] [${level}-${environment}] [message]${message} [data] ${meta[0] ? JSON.stringify(meta[0]) : 'Empty'}`
// })

// const logFormat = winston.format.combine(
//   winston.format.timestamp(),
//   winston.format.align(),
//   winston.format.json(),
//   myFormat,
// )

// const fileTransport = new winston.transports.DailyRotateFile({
//   filename: logPath,
//   datePattern,
//   prepend: true,
//   handleExceptions: true,
//   zippedArchive: false,
//   json: false,
//   maxSize: '20m',
//   maxFiles: '15d',
//   level: levels.debug,
// })

// const consoleTransport = new winston.transports.Console({
//   handleExceptions: true,
//   level: levels.debug,
// })

// winston.loggers.add('Logger', {
//   format: logFormat,
//   transports: [fileTransport, consoleTransport],
// })

// winston.loggers.add('httplog', {
//   format: winston.format.combine(winston.format.label({ label: 'Http Log' }), winston.format.json()),
//   transports: [
//     new winston.transports.File({
//       filename: './log/node/webadmin-winston.log',
//       level: levels.debug,
//       prepend: true,
//       handleExceptions: true,
//       zippedArchive: false,
//       json: true,
//       maxSize: '20m',
//       maxFiles: '15d',
//     }),
//   ],
// })

// const logger = winston.loggers.get('Logger')
// const httplog = winston.loggers.get('httplog')

// process.on('unhandledRejection', function (err) {
//   logger.error(err)
// })

// exports.logger = logger
// exports.httplog = httplog
