import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { ApiResponse } from '@/features/auth/types/base-response.type'
import Axios, { AxiosError, HttpStatusCode, type InternalAxiosRequestConfig } from 'axios'

export const apiClient = Axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

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

const errorInterceptor = async (error: AxiosError) => {
    console.log('API Error Interceptor triggered:', error)
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    let errorObject = {
        success: false,
        statusCode: 500,
        message: 'An unexpected error occurred.'
    }

    if (error.response) {
        const backendError = error.response.data as ApiResponse<null>

        errorObject = {
            ...errorObject,
            ...backendError,
            statusCode: error.response.status
        }

        // Handle token expiration (401 )
        if (error.response.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Create a separate Axios instance to avoid infinite loop
                const refreshClient = Axios.create({
                    baseURL: import.meta.env.VITE_BASE_URL,
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                })

                const refreshResponse = await refreshClient.post('/auth/refresh-tokens', {})
                const tokenData = refreshResponse.data?.data

                // Update token in localStorage and Zustand store
                if (tokenData && tokenData.accessToken) {
                    const { updateAccessToken } = useAuthStore.getState()
                    updateAccessToken(tokenData.accessToken)

                    // Update token in original request
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`
                    }
                }

                // Retry request with new token
                return await apiClient(originalRequest)
            } catch (retryError) {
                // If refresh token fails, log out user
                const { logout } = useAuthStore.getState()
                logout()

                // Redirect to login page
                if (typeof window !== 'undefined') {
                    window.location.href = '/login'
                }

                return Promise.reject(retryError)
            }
        }
    } else if (error.request) {
        errorObject.message = 'Unable to connect to server. Please check your network connection.'
    } else {
        errorObject.message = error.message
    }

    return Promise.reject(errorObject)
}

apiClient.interceptors.request.use(authRequestInterceptor)

// Temporarily disable response interceptor for debugging
// apiClient.interceptors.response.use(responseInterceptor, errorInterceptor)
apiClient.interceptors.response.use((response) => {
    return response
}, errorInterceptor)
