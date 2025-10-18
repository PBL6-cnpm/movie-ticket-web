import { useAuthStore } from '@/features/auth/stores/auth.store'
import type { ApiResponse } from '@/features/auth/types/base-response.type'
import { apiClient } from '@/shared/api/api-client'
import { HttpStatusCode } from 'axios'
import { useState } from 'react'

interface UpdateProfileData {
    fullName: string
    phoneNumber?: string
    avatarUrl?: File
}

interface ChangePasswordData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export const useProfile = () => {
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { account, updateAccount } = useAuthStore()

    const clearError = () => setError(null)

    const updateProfile = async (data: UpdateProfileData) => {
        setIsUpdatingProfile(true)
        clearError()

        try {
            if (!data.fullName || data.fullName.trim().length === 0) {
                throw new Error('Full name is required')
            }

            const formData = new FormData()
            formData.append('fullName', data.fullName.trim())

            if (data.phoneNumber) {
                formData.append('phoneNumber', data.phoneNumber.trim())
            }
            if (data.avatarUrl) {
                formData.append('avatarUrl', data.avatarUrl)
            }

            const response = await apiClient.put(
                '/accounts/me',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            )

            const updatedAccount = response.data.data

            if (updatedAccount) {
                updateAccount({...updatedAccount})
            }

            return {
                success: true,
                data: updatedAccount,
                message: response.data.message || 'Profile updated successfully'
            }
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Update profile failed'

            console.log('Update Profile error:', errorMessage)

            setError(
                errorStatusCode !== HttpStatusCode.InternalServerError
                    ? errorMessage
                    : 'Update profile failed'
            )

            return {
                success: false,
                message: errorMessage
            }
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const changePassword = async (data: ChangePasswordData) => {
        setIsChangingPassword(true)
        clearError()

        try {
            if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
                throw new Error('Please fill in all password fields')
            }

            await apiClient.put<ApiResponse<null>>('/accounts/me/passwords', data)

            return {
                success: true,
                message: 'Password changed successfully'
            }
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Change password failed'

            console.log('Change Password error:', errorMessage)

            setError(
                errorStatusCode !== HttpStatusCode.InternalServerError
                    ? errorMessage
                    : 'Change password failed'
            )

            return {
                success: false,
                message: errorMessage
            }
        } finally {
            setIsChangingPassword(false)
        }
    }

    return {
        account,
        isLoading: isUpdatingProfile || isChangingPassword,
        isUpdatingProfile,
        isChangingPassword,
        error,
        updateProfile,
        changePassword,
        clearError
    }
}
