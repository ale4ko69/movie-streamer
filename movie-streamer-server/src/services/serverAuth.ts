// const jwt = require('jsonwebtoken')
// const { db } = require('./database')
// const { logger } = require('./logger')
// const { createFlatObj } = require('../utils/index')

// require('dotenv').config()

// const { JWT_SECRET, JWT_HEADER_TOKEN } = process.env

// // function for creating tokens
// function signToken(user) {
//   delete user.fldPASSWORD_USER
//   const newUser = createFlatObj(user)
//   return jwt.sign(newUser, JWT_SECRET)
// }

// // function for verifying tokens
// function verifyToken(req, res, next) {
//   // grab token from either headers, req.body, or query string
//   const token = req.get(JWT_HEADER_TOKEN) || req.body.token || req.query.token

//   // if no token present, deny access
//   if (!token) return res.json({ success: false, message: 'No token provided' })

//   // otherwise, try to verify token
//   jwt.verify(token, JWT_SECRET, async (err, decodedData) => {
//     // if problem with token verification, deny access
//     if (err) return res.json({ success: false, message: 'Invalid token' })

//     const { getVerifyUser } = require('../models/admin/User')

//     // otherwise, search for user by id that was embedded in token
//     const isUser = await getVerifyUser(req, res, next, decodedData.fldID_USER)

//     if (isUser) {
//       next()
//     } else {
//       next(err)
//     }
//   })
// }

// module.exports = {
//   signToken,
//   verifyToken,
// }
