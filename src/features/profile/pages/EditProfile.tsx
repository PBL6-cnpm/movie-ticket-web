'use client'

import { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useProfile } from '../hooks/useProfile'

export default function EditProfile() {
    const { account, updateProfile, isUpdatingProfile } = useProfile()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: ''
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (account) {
            setFormData({
                fullName: account.fullName || '',
                phoneNumber: account.phoneNumber || ''
            })
            setPreviewUrl(account.avatarUrl || null)
        }
    }, [account])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)
        }
    }

    const handleSave = async () => {
        const hasChanges =
            formData.fullName !== account?.fullName ||
            formData.phoneNumber !== account?.phoneNumber ||
            selectedFile !== null

        if (!hasChanges) {
            setIsEditing(false)
            return
        }

        const result = await updateProfile({
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            avatarUrl: selectedFile || undefined
        })

        if (result.success) {
            setIsEditing(false)
            setSelectedFile(null)
            toast.success(result.message || 'Profile updated successfully!', { position: 'top-right' })
        } else {
            toast.error(result.message || 'Update profile failed', { position: 'top-right' })
        }
    }

    const handleCancel = () => {
        if (account) {
            setFormData({
                fullName: account.fullName || '',
                phoneNumber: account.phoneNumber || ''
            })
            setPreviewUrl(account.avatarUrl || null)
            setSelectedFile(null)
        }
        setIsEditing(false)
    }

    if (!account) return null

    return (
        <div className="p-8">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            {/* ... Phần Avatar không đổi ... */}
            <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                    <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="User Avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <span className="text-primary text-2xl font-semibold">
                                {formData.fullName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                    {isEditing && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                            aria-label="Upload new avatar"
                        >
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
                        </button>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-primary">{account.email}</h2>
                </div>
            </div>

            <div className="space-y-2 pb-6">
                <label htmlFor="email" className="block text-sm font-semibold text-primary">
                    Email Address
                </label>
                <div className="w-full px-3 py-2 bg-accent border border-border rounded-lg text-secondary font-medium">
                    {account.email}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-primary">
                        Full Name
                    </label>
                    {isEditing ? (
                        <input
                            id="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-surface text-primary"
                            placeholder="Full name"
                        />
                    ) : (
                        <div className="w-full px-3 py-2 bg-accent border border-border rounded-lg text-primary font-medium">
                            {formData.fullName || 'Not provided'}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-primary">
                        Phone Number
                    </label>
                    {isEditing ? (
                        <input
                            id="phone"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-surface text-primary"
                            placeholder="+84123456789"
                        />
                    ) : (
                        <div className="w-full px-3 py-2 bg-accent border border-border rounded-lg text-primary font-medium">
                            {formData.phoneNumber || 'Not provided'}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 border border-border rounded-lg text-primary hover:bg-accent transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isUpdatingProfile}
                            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg disabled:bg-orange-300 disabled:cursor-not-allowed"
                        >
                            {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg"
                    >
                        Edit Details
                    </button>
                )}
            </div>
            <Toaster />
        </div>
    )
}
