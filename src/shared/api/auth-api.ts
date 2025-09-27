import { apiClient } from './api-client'

export const register = async (email: string, password: string) => {
    if (!email || !password) return

    console.log(email + ' ' + password)

    return apiClient.post(
        '/auth/register',
        { email, password },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    )
}

export const login = async (email: string, password: string) => {
    if (!email || !password) return

    console.log(email + ' ' + password)

    return apiClient.post(
        '/auth/login',
        { email, password },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    )
}
