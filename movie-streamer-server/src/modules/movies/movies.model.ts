import { db } from '#services/db.js'

export const addMovieInfo = async (movie) => {
    const affectedDocuments = await db.movieInfo.insertOne(movie)
    console.log("Document inserted", affectedDocuments)
}

export const findMovieInfo = async (m_id) => {
   const doc = await db.movieInfo.find({m_id})
   console.log("Document found", doc)
   return doc
}


