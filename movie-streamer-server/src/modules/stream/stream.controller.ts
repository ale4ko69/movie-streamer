import { NextFunction, Request, Response } from 'express'
import WebTorrent, { Torrent, TorrentFile } from 'webtorrent'

const client = new WebTorrent()

let state = {
  progress: 0,
  downloadSpeed: 0,
  ratio: 0,
}

let error

interface ErrorWithStatus extends Error {
  status: number
}

client.on('torrent', (torrent: Torrent) => {
  updateState()
})

client.on('error', (err: any) => {
  console.error('err', err.message)
  error = err.message
})

export const streamHome = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    data: 'Start stream router',
  })
}

export const streamState = (req: Request, res: Response, next: NextFunction) => {
  res.sendToUI(updateState())
}

export const streamAdd = (req: Request, res: Response, next: NextFunction) => {
  const { magnet } = req.params

  client.add(magnet, (torrent) => {
    const files = torrent.files.map((data) => ({
      name: data.name,
      length: data.length,
    }))
    res.sendToUI(files)
  })
}

export interface IStreamRequest extends Request {
  params: {
    magnet: string
    fileName: string
  }
  headers: {
    range: string
  }
}

export const streamVideo = async (req: Request, res: Response, next: NextFunction) => {
  const {
    params: { magnet, fileName },
    headers: { range },
  } = req

  if (!range) {
    const err = new Error('Range is not defined, please make rquest from HTML5 player') as ErrorWithStatus
    err.status = 416
    return next(err)
  }

  const torrent = (await client.get(magnet)) as Torrent

  let file = <TorrentFile>{}
  const files = Array.isArray(torrent?.files) ? torrent?.files : [torrent?.files]

  files?.find((item) => {
    if (item.name === fileName) {
      file = item
    }
  })

  if (!file) {
    const err = new Error(`File "${fileName}" not found`) as ErrorWithStatus
    err.status = 500
    return next(err)
  }

  // ---- Range bytes=0-123
  const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-')
  const fileSize = file ? file.length : 0

  const start = startParsed ? Number(startParsed) : 0
  const end = endParsed ? Number(endParsed) : fileSize - 1
  const chunkSize = end - start + 1

  // ---- Headers
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  }

  res.writeHead(206, headers)

  const streamPosition = {
    start,
    end,
  }

  const stream = file.createReadStream(streamPosition)
  stream.pipe(res)

  stream.on('error', (err) => {
    return next(err)
  })
}

// ---- HELPER Functions
const updateState = () => {
  return (state = {
    progress: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio,
  })
}
