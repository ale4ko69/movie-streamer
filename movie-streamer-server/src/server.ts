// const { logger } = require('./services/logger')

// global.base_dir = __dirname
// global.abs_path = (path) => {
//   return base_dir + path
// }
// global.include = (file) => {
//   return require(abs_path(`/${file}`))
// }

// try {
//   logger.debug('Initializing MySql database module')
//   const pool = require('./services/database.js')
// } catch (err) {
//   logger.error(err)
//   process.exit(1) // Non-zero failure code
// }

// async function startup() {
//   logger.debug('Starting application')

//   try {
//     logger.debug('Initializing web server module')
//     await webServer.initialize()
//   } catch (err) {
//     console.error(err)
//     process.exit(1) // Non-zero failure code
//   }
// }

// startup()

// async function shutdown(e) {
//   let err = e
//   console.log('Shutting down')
//   try {
//     console.log('Closing web server module')
//     await webServer.close()
//   } catch (e) {
//     console.log('Encountered error', e)
//     err = err || e
//   }

//   console.log('Exiting process')

//   if (err) {
//     process.exit(1) // Non-zero failure code
//   } else {
//     process.exit(0)
//   }
// }

// process.on('SIGTERM', () => {
//   console.log('Received SIGTERM')
//   shutdown()
// })

// process.on('SIGINT', () => {
//   console.log('Received SIGINT')
//   shutdown()
// })

// process.on('uncaughtException', (err) => {
//   console.log('Uncaught exception')
//   console.error(err)
//   shutdown(err)
// })

// export {};
