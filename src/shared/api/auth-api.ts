import { apiClient } from './api-client'

export const register = async (email: string, password: string, fullName: string) => {
    if (!email || !password || !fullName) return

    console.log(email + ' ' + password + ' ' + fullName)

    const payload = {
        email,
        password,
        fullName
    }

    return apiClient.post('/auth/register', payload, {
        headers: { 'Content-Type': 'application/json' }
    })
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
