import * as authApi from '@/shared/api/auth-api'
import type { CredentialResponse } from '@react-oauth/google'
import { useAuthStore } from '../stores/auth.store'
import type { Account } from '../types/account.type'
import type {
    LoginCredentials,
    RegisterCredentials,
    RequestEmailCredential
} from '../types/auth.type'
import type {
    ApiResponse,
    AxiosErrorResponse,
    AxiosSuccessResponse
} from '../types/base-response.type'
import { validateEmail, validatePassword } from '../utils/auth.util'
import { HttpStatusCode } from 'axios'

export const useAuth = () => {
    const {
        account,
        isLoading,
        isAuthenticated,
        error,
        login,
        logout,
        setLoading,
        setError,
        clearError
    } = useAuthStore()

    const handleLogin = async (
        credentials: LoginCredentials
    ): Promise<AxiosSuccessResponse<Account | string> | AxiosErrorResponse> => {
        try {
            setLoading(true)
            clearError()

            if (!validateEmail(credentials.email)) {
                throw new Error('Invalid email format')
            }

            if (!validatePassword(credentials.password)) {
                throw new Error('Password must be at least 6 characters')
            }

            // Call the actual API
            const data = (await authApi.login(credentials.email, credentials.password)).data.data

            console.log('Login API response:', data.message)

            console.log('Login successful:', data)

            login(data.account, data.accessToken)

            if (data.message) {
                return {
                    success: true,
                    message: data.message,
                    data: data.account
                }
            }

            return {
                success: true,
                data: data.account
            }
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Login failed'

            console.log('Login error:', errorMessage)

            setError(errorStatusCode !== HttpStatusCode.InternalServerError ? errorMessage : 'Login failed')

            return {
                success: false,
                statusCode: errorStatusCode,
                message: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSocialLogin = async (
        credentialResponse: CredentialResponse
    ): Promise<AxiosSuccessResponse<Account | string> | AxiosErrorResponse> => {
        try {
            setLoading(true)
            clearError()

            // Call the actual API
            const idToken = credentialResponse.credential
            if (!idToken) {
                throw new Error('Google login failed: No token received')
            }
            const data = (await authApi.socialLogin(idToken)).data.data

            console.log('Login successful:', data)

            login(data.account, data.accessToken)

            return {
                success: true,
                data: data.account
            }
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Social login failed'

            console.log('Login error:', errorMessage)

            setError(errorStatusCode !== HttpStatusCode.InternalServerError ? errorMessage : 'Social login failed')

            return {
                success: false,
                statusCode: errorStatusCode,
                message: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (
        credentials: RegisterCredentials
    ): Promise<AxiosSuccessResponse<Account> | AxiosErrorResponse> => {
        try {
            setLoading(true)
            clearError()

            if (!validateEmail(credentials.email)) {
                throw new Error('Invalid email format')
            }

            if (!validatePassword(credentials.password)) {
                throw new Error('Password must be at least 6 characters')
            }

            if (credentials.password !== credentials.confirmPassword) {
                throw new Error('Passwords do not match')
            }

            if (!credentials.fullName || credentials.fullName.trim().length === 0) {
                throw new Error('Full name is required')
            }

            // Call the actual API
            const data = (
                await authApi.register(
                    credentials.email,
                    credentials.password,
                    credentials.fullName,
                    credentials.confirmPassword
                )
            ).data.data

            return { success: true, data }
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Registration failed'

            console.log('Registration error:', errorMessage)

            setError(errorStatusCode !== HttpStatusCode.InternalServerError ? errorMessage : 'Registration failed')

            return {
                success: false,
                statusCode: errorStatusCode,
                message: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResendVerificationEmail = async (
        credentials: RequestEmailCredential
    ): Promise<AxiosSuccessResponse<null> | AxiosErrorResponse> => {
        try {
            setLoading(true)
            clearError()

            if (!validateEmail(credentials.email)) {
                throw new Error('Invalid email format')
            }

            // Call the actual API
            await authApi.resendVerificationEmail(credentials.email)

            return {
                success: true,
                data: null
            }
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Resend verification email failed'

            console.log('Resend verification email error:', errorMessage)

            setError(errorStatusCode !== HttpStatusCode.InternalServerError ? errorMessage : 'Resend verification email failed')

            return {
                success: false,
                statusCode: errorStatusCode,
                message: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (
        credentials: RequestEmailCredential
    ): Promise<AxiosSuccessResponse<null> | AxiosErrorResponse> => {
        try {
            setLoading(true)
            clearError()

            if (!validateEmail(credentials.email)) {
                throw new Error('Invalid email format')
            }

            // Call the actual API
            await authApi.forgotPassword(credentials.email)

            return {
                success: true,
                data: null
            }
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Request failed'

            setError(errorStatusCode !== HttpStatusCode.InternalServerError ? errorMessage : 'Request failed')

            return {
                success: false,
                statusCode: errorStatusCode,
                message: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true)
            clearError()
            await authApi.logout()
            logout()
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Logout failed'

            setError(errorStatusCode !== HttpStatusCode.InternalServerError ? errorMessage : 'Logout failed')

            return {
                success: false,
                statusCode: errorStatusCode,
                message: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        account,
        isLoading,
        isAuthenticated,
        error,
        login: handleLogin,
        socialLogin: handleSocialLogin,
        register: handleRegister,
        resendVerificationEmail: handleResendVerificationEmail,
        forgotPassword: handleForgotPassword,
        logout: handleLogout,
        clearError
    }
}
