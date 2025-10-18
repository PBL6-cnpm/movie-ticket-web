'use client'

import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function ProfileLayout() {
    const location = useLocation()

    // Redirect to edit profile if accessing /profile directly
    useEffect(() => {
        if (location.pathname === '/profile') {
            window.location.href = '/profile/edit'
        }
    }, [location.pathname])

    const isActiveTab = (path: string) => {
        return location.pathname === path
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container-custom py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-primary">Profile Settings</h1>
                        <p className="text-secondary mt-1">Personal Info</p>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Left Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-surface rounded-lg shadow-sm p-4 space-y-2 border border-border">
                                <Link
                                    to="/profile/edit"
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        isActiveTab('/profile/edit')
                                            ? 'bg-primary text-white'
                                            : 'text-primary hover:bg-accent hover:text-primary'
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
                                </Link>

                                <Link
                                    to="/profile/change-password"
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        isActiveTab('/profile/change-password')
                                            ? 'bg-primary text-white'
                                            : 'text-primary hover:bg-accent hover:text-primary'
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
                                </Link>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="bg-surface rounded-lg shadow-sm border border-border">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
