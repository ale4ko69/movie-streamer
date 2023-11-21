import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import * as httpContext from 'express-http-context';
import cors from 'cors'
import logger from 'morgan'
import favicon from 'serve-favicon'

// Router
import router from './routes/index.js'
import { customSendExpress } from '#utils/http/index.js';

const app = express()
const PORT = process.env.PORT || 3000

const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://127.0.0.1'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie'],
}

app.use(cors())
app.use(httpContext.middleware)
app.use(express.json())
app.use(customSendExpress as any);
app.use(logger('dev'))
app.use(express.static('public'))
app.use(favicon('./public/assets/images/favicon.png'))
// app.set('views', path.join(__dirname, 'views'))

// Root Router & Home page
app.use(router)

// if we are here then the specified request is not found
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: Error = new Error('Not Found')
  // err.status = 404
  next(err)
})

app.listen(PORT, () => {
  console.log('Start stream')
  console.log(`http://localhost:${PORT}`)
})
