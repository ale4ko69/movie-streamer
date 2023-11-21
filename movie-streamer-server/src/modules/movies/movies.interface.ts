import { Request } from 'express'

export interface ISearchRequest extends Request {
  query: {
    f: string
    nm: string
  }
}
export interface IMovieInfoRequest extends Request {
  query: {
    t: string
  }
}

export interface IMovieInfo {
  m_id: string;
  m_title: string;
  m_poster: string;
  m_country: string;
  m_genre: [number];
  m_year: number;
  m_duration: string;
  m_translate: string;
  m_subtitle: string;
  m_originalAudio: string;
  m_director: string;
  m_cast: string;
  m_description: string;
  m_formatVideo: string;
  m_qualityVideo: string;
  m_torrent: string;
  m_magnet: string;
}

export interface ISearchMovie {
  m_state: string;
  m_category: string;
  m_categoryId: number;
  m_id: number;
  m_title: string;
  m_size: string;
  m_seeds: string;
  m_leechs: string;
  m_url: string;
}

