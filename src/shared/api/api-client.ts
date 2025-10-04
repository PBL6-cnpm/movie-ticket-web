import Axios, { type InternalAxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_BASE_URL

// if (!import.meta.env.VITE_API_TOKEN) {
//     throw new Error('env variable not set: VITE_API_TOKEN')
// }
if (!baseURL) {
    throw new Error('env variable not set: VITE_SERVER_URL or VITE_BASE_URL')
}

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    const apiToken = import.meta.env.VITE_API_TOKEN
    if (apiToken && config.headers) {
        config.headers.authorization = apiToken
    }

    return config
}

export const apiClient = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})
export const axios = Axios.create({
    baseURL
})

apiClient.interceptors.request.use(authRequestInterceptor)
