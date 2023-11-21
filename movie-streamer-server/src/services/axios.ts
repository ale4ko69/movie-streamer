import axios from 'axios'

const axiosInstance = axios.create({
  maxRedirects: 0,
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && [301, 302].includes(error.response.status)) {
      const redirectUrl = error.response.headers.location
      return axiosInstance.get(redirectUrl, {
        headers: {
          cookie: error.response.headers['set-cookie'],
        },
      })
    }
    return Promise.reject(error)
  },
)

export const instAxios = axiosInstance
