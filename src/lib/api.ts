import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL, // lấy từ .env
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message)
        return Promise.reject(error)
    }
)

export default api
