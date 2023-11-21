import { NextFunction, Request, Response } from 'express'
import { rutrackerapi } from '#services/rutracker/rutracker-api.js'
import { kinopoiskapi } from '#services/kinopoisk/kinopoisk-api.js'
import { rutrackerCategories } from '#services/rutracker/rutracker-categories.js'
import config from '#config/config.js'

import { ISearchRequest, IMovieInfoRequest } from './movies.interface.js'
import { addMovieInfo, findMovieInfo } from './movies.model.js'
const { rutrackerCredential } = config

export const searchMovieTorrent = async (req: ISearchRequest, res: Response, next: NextFunction) => {

  // Login
  const isLoggedIn = await rutrackerapi.login(rutrackerCredential?.username, rutrackerCredential?.password)

  if (isLoggedIn) {
    search(req, res, next)
  }
  else {
    res.sendToUI({meta: 'User not logged-in'})
  }
}

export const categoryMovieTorrent = async (req: ISearchRequest, res: Response, next: NextFunction) => {
  res.sendToUI( rutrackerCategories )
}

export const getMovieTorrentInfo = async (req: IMovieInfoRequest, res: Response, next: NextFunction) => {
  const { t } = req.query

  // Find in NEDB

  const doc = await findMovieInfo(t);

  if(doc.length === 1) {
    res.sendToUI(doc[0])
    return;
  }

  // Else Get from Site

  // Login
  await rutrackerapi.login(rutrackerCredential?.username, rutrackerCredential?.password)

  const result = await rutrackerapi.getMovieInfo(t)

  if(result?.m_id){
    await addMovieInfo(result)
  }

  res.sendToUI(result)
}

export const searchKinoMovie = async (req: Request, res: Response, next: NextFunction) => {
  const { nm } = req.query

  const result = await kinopoiskapi.search(nm)

  res.sendToUI(result)
}

export const getKinoMovieInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { nm } = req.query

  const result = await kinopoiskapi.getMovieInfo(nm)

  res.sendToUI(result)
}

export const streamsMovie = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.query

  const result = await kinopoiskapi.streamsUrlMovie(id)

  res.sendToUI(result)
}

const search = async (req: ISearchRequest, res: Response, next: NextFunction) => {
  const { f, nm } = req.query

 const result = await rutrackerapi.search(f, nm, null)

 res.sendToUI(result)
}
