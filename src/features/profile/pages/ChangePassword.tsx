'use client'

import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import toast, { Toaster } from 'react-hot-toast'

export default function ChangePassword() {
    const { changePassword, isChangingPassword } = useProfile()

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePasswordSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const result = await changePassword(passwordData)

        if (result && result.success) {
            toast.success(result.message || 'Password changed successfully!', {
                position: 'top-right'
            })
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } else {
            toast.error(result.message || 'Failed to change password.', {
                position: 'top-right'
            })

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        }
    }

    return (
        <div className="p-8">
            <h2 className="text-xl font-semibold text-primary mb-6">Change Password</h2>

            <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                    <label
                        htmlFor="currentPassword"
                        className="block text-sm font-semibold text-primary"
                    >
                        Current Password
                    </label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-surface text-primary"
                        placeholder="Enter current password"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="newPassword"
                        className="block text-sm font-semibold text-primary"
                    >
                        New Password
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-surface text-primary"
                        placeholder="Enter new password"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-semibold text-primary"
                    >
                        Confirm New Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-surface text-primary"
                        placeholder="Confirm new password"
                    />
                </div>

                <div className="pt-4">
                    <button
                        onClick={handlePasswordSave}
                        disabled={isChangingPassword}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>

            <Toaster />
        </div>
    )
}
