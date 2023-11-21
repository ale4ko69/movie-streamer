// // const https = require('https')
// const http = require('http')
// const fs = require('fs')
// const path = require('path')
// const express = require('express')
// const cookieParser = require('cookie-parser')
// const partialResponse = require('express-partial-response')
// const favicon = require('serve-favicon')
// const bodyParser = require('body-parser')
// const session = require('express-session')
// const { v4: uuidv4 } = require('uuid')
// // const helmet       = require('helmet');
// // const morgan    = require('morgan');
// // const config = require('config')
// const cors = require('cors')
// const i18n = require('i18n')
// const router = require('../routes/index')
// const { logger } = require('./logger')

// const { port, root, localeI18n, corsSecurity } = config.get('webserverConfig')

// let httpServer

// const options = {
//   pfx: fs.readFileSync('./LocalWebKey.pfx'),
//   passphrase: process.env.CERT_PASSPHRASE,
// }

// i18n.configure({
//   // setup some locales - other locales default to en silently
//   locales: localeI18n.locales,

//   // sets a custom cookie name to parse locale settings from
//   cookie: localeI18n.cookie,

//   // you may alter a site wide default locale
//   defaultLocale: localeI18n.defaultLocale,

//   // where to store json files - defaults to './locales'
//   directory: localeI18n.directory,
// })

// const corsOptionsDelegate = (req, callback) => {
//   let corsOptions

//   if (corsSecurity.whiteHostlist.includes(req.header('Origin'))) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }

//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

// function initialize() {
//   return new Promise((resolve, reject) => {
//     const app = express()

//     /**
//      * Register '.ejs' extension with The Mustache Express
//      * Pass the path for your partial directory and
//      * the extension of the partials within the mustache-express method
//      */
//     app.set('view engine', 'ejs')
//     app.set('views', path.join(root, 'views'))
//     /*
//      * https://www.npmjs.com/package/express-partial-response
//      * Express Middleware will allow you to send a subset of a JSON object instead of the entire object from your HTTP services.
//      * {"firstName":"Mohandas","lastName":"Gandhi","aliases":[{"firstName":"Mahatma","lastName":"Gandhi"},{"firstName":"Bapu"}]}
//      * Example http://localhost:4000?fields=lastName
//      */
//     app.use(partialResponse())

//     /** Cookies */
//     app.use(cookieParser())

//     /** Body Parser */
//     app.use(bodyParser.json()) // to support JSON-encoded bodies
//     app.use(
//       bodyParser.urlencoded({
//         // to support URL-encoded bodies
//         extended: true,
//       }),
//     )

//     app.use(express.static('public'))
//     app.use(express.static('locales'))
//     app.use(express.static('root'))

//     app.use(favicon('./public/admin/favicon.ico'))

//     // i18n init parses req for language headers, cookies, etc.
//     app.use(i18n.init)

//     // app.use(express.static(path.join(root, 'fileserver/userfiles/uploads')));
//     app.use(cors(corsOptionsDelegate))

//     app.options('*', cors())

//     app.use((req, res, next) => {
//       res.setHeader('X-Frame-Options', `frame-ancestors ${corsSecurity.frameAncestors}`)
//       res.setHeader('Access-Control-Allow-Origin', `*`)
//       next()
//     })

//     // app.use(helmet.frameguard({
//     //   action: 'frame-ancestors',
//     //   domain: 'localhost:5000'
//     // }));

//     app.set('trust proxy', 1) // trust first proxy
//     app.use(
//       session({
//         genid(req) {
//           return uuidv4() // use UUIDs for session IDs
//         },
//         secret: 'fgsdfs908weiorjhtirjtgl;ssadg',
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: true },
//       }),
//     )

//     // Root Router & Home page
//     app.use(router)

//     // app.get(adminRootUrl, (req, res) => {
//     //   res.send('HELLO API ADMIN - Auto Update Is Work. Start!!!')
//     // })

//     // if we are here then the specified request is not found
//     app.use((req, res, next) => {
//       const err = new Error('Not Found')
//       // err.status = 404
//       next(err)
//     })

//     // all other requests are not implemented.
//     app.use((err, req, res, next) => {
//       res.status(err.status || 501)
//       res.json({
//         error: {
//           code: err.status || 501,
//           message: err.message,
//         },
//       })
//     })

//     // Create HTTP Server
//     httpServer = http.createServer(options, app)

//     httpServer
//       .listen(port)
//       .on('listening', () => {
//         logger.debug(`Web server listening on http://localhost:${port}`)
//         resolve('')
//       })
//       .on('error', (err) => {
//         logger.error(`Web server Error: ${err}`)
//         reject(err)
//       })
//   })
// }

// module.exports.initialize = initialize

// function close() {
//   return new Promise((resolve, reject) => {
//     httpServer.close((err) => {
//       if (err) {
//         reject(err)
//         return
//       }
//       resolve('')
//     })
//   })
// }

// module.exports.close = close
