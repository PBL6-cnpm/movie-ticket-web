'use client'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { useState } from 'react'

export default function ProfilePage() {
    const { account } = useAuth()
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        fullName: account?.fullName || '',
        email: account?.email || '',
        phoneNumber: account?.phoneNumber || ''
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = () => {
        // TODO: Implement API call to update profile
        console.log('Saving profile data:', formData)
        setIsEditing(false)
    }

    const handlePasswordSave = () => {
        // TODO: Implement API call to change password
        console.log('Changing password')
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
    }

    const handleCancel = () => {
        setFormData({
            fullName: account?.fullName || '',
            email: account?.email || '',
            phoneNumber: account?.phoneNumber || ''
        })
        setIsEditing(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800">Profile Settings</h1>
                        <p className="text-gray-600 mt-1">Personal Info</p>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Left Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                                <button
                                    onClick={() => {
                                        setActiveTab('profile')
                                        setIsEditing(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeTab === 'profile'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Edit Profile
                                    <svg
                                        className="w-4 h-4 ml-auto"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => {
                                        setActiveTab('password')
                                        setIsEditing(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        activeTab === 'password'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    Password
                                    <svg
                                        className="w-4 h-4 ml-auto"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-sm">
                                {/* Profile Tab */}
                                {activeTab === 'profile' && (
                                    <div className="p-8">
                                        {/* Header with Avatar */}
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-gray-600 text-2xl font-semibold">
                                                        {account?.fullName
                                                            ?.charAt(0)
                                                            .toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    {account?.email}
                                                </h2>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="firstName"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    First Name
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        id="firstName"
                                                        type="text"
                                                        value={
                                                            formData.fullName.split(' ')[0] || ''
                                                        }
                                                        onChange={(e) => {
                                                            const lastName = formData.fullName
                                                                .split(' ')
                                                                .slice(1)
                                                                .join(' ')
                                                            handleInputChange(
                                                                'fullName',
                                                                `${e.target.value} ${lastName}`.trim()
                                                            )
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                                                        placeholder="Shahed"
                                                    />
                                                ) : (
                                                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                                        {formData.fullName.split(' ')[0] ||
                                                            'Not provided'}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="lastName"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Last Name
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        id="lastName"
                                                        type="text"
                                                        value={
                                                            formData.fullName
                                                                .split(' ')
                                                                .slice(1)
                                                                .join(' ') || ''
                                                        }
                                                        onChange={(e) => {
                                                            const firstName =
                                                                formData.fullName.split(' ')[0] ||
                                                                ''
                                                            handleInputChange(
                                                                'fullName',
                                                                `${firstName} ${e.target.value}`.trim()
                                                            )
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                                                        placeholder="Sara"
                                                    />
                                                ) : (
                                                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                                        {formData.fullName
                                                            .split(' ')
                                                            .slice(1)
                                                            .join(' ') || 'Not provided'}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Email Address
                                                </label>
                                                <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                                                    {account?.email}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="phone"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Phone Number
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        id="phone"
                                                        type="tel"
                                                        value={formData.phoneNumber}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                'phoneNumber',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                                                        placeholder="+84123456789"
                                                    />
                                                ) : (
                                                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                                        {formData.phoneNumber || '+84123456789'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 mt-8">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    Edit Details
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Password Tab */}
                                {activeTab === 'password' && (
                                    <div className="p-8">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                            Change Password
                                        </h2>

                                        <div className="space-y-6 max-w-md">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="currentPassword"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Current Password
                                                </label>
                                                <input
                                                    id="currentPassword"
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) =>
                                                        handlePasswordChange(
                                                            'currentPassword',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                                                    placeholder="Enter current password"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="newPassword"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    New Password
                                                </label>
                                                <input
                                                    id="newPassword"
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) =>
                                                        handlePasswordChange(
                                                            'newPassword',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                                                    placeholder="Enter new password"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="confirmPassword"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) =>
                                                        handlePasswordChange(
                                                            'confirmPassword',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handlePasswordSave}
                                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
