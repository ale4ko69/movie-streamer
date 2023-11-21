// const mysql = require('mysql2')
// // const util = require('util')
// const config = require('config')
// const { logger } = require('./logger')

// const dbConfig = config.get('dbConfig')

// logger.debug('DB Config', JSON.stringify(dbConfig))
// // Connect to DB
// const pool = mysql.createPool(dbConfig)
// // now get a Promise wrapped instance of that pool
// const promisePool = pool.promise()

// // Ping database to check for common exception errors.
// promisePool.getConnection((err, connection) => {
//   if (err) {
//     if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//       logger.error('Database connection was closed.', err)
//     }
//     if (err.code === 'ER_CON_COUNT_ERROR') {
//       logger.error('Database has too many connections.', err)
//     }
//     if (err.code === 'ECONNREFUSED') {
//       logger.error('Database connection was refused.', err)
//     }
//   }

//   if (connection) {
//     promisePool.releaseConnection(connection)
//   }
// })

// const connection = async () => {
//   try {
//     const conn = await promisePool.getConnection((err, connection) => {
//       if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//           logger.error('Database connection was closed.', err)
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//           logger.error('Database has too many connections.', err)
//         }
//         if (err.code === 'ECONNREFUSED') {
//           logger.error('Database connection was refused.', err)
//         }
//       }

//       if (connection) {
//         promisePool.releaseConnection(connection)
//       }
//     })
//     return conn
//   } catch (error) {
//     console.error(`connection error : ${error.message}`)
//     return null
//   }
// }

// const releaseConnection = async (conn) => {
//   try {
//     await conn.release()
//   } catch (error) {
//     console.error(`release error : ${error.message}`)
//   }
// }

// // module.exports = promisePool
// module.exports = {
//   db: promisePool,
//   getConnection: connection,
//   releaseConnection,
// }
