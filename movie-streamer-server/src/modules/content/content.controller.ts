import { NextFunction, Request, Response } from 'express'

export const contentHome = (req: Request, res: Response, next: NextFunction) => {
  res.sendFile('src/views/index.html', { root: '.' })
}
