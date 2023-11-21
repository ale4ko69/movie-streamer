import { NextFunction, Request, Response } from 'express'
import url from 'url'
import config from '#config/config.js'
import { instAxios } from '#services/axios.js'
import { convertParamsToSearchString } from '#utils/http/common/index.js'
const imdbBaseUrl = config.imdb.api_url;

export const searchInIMDB = async (query: string) => {

    const queryParams = {
        language: config.imdb.language,
        api_key: config.imdb.api_key,
        query
    }


    const strQueryParams = convertParamsToSearchString(queryParams)
    const imdbRequest = `${imdbBaseUrl}/search/movie?${strQueryParams}`
    console.log(imdbRequest)

    const response = await instAxios.get(imdbRequest)
    // const [movie] = result

    return
}
