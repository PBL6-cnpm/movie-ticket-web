'use client'

import Button from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../hooks/auth.hook'

const EmailVerificationSuccess = () => {
    const navigate = useNavigate()
    const { email } = useSearch({ from: '/email-verification' })
    const [isResending, setIsResending] = useState(false)

    const { resendVerificationEmail } = useAuth()

    const handleOpenGmail = () => {
        window.open('https://mail.google.com/', '_blank')
    }

    const handleGoToLogin = () => {
        navigate({ to: '/login' })
    }

    const handleResendVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsResending(true)

        try {
            console.log('Resend result:')
            const result = await resendVerificationEmail({ email })
            if (result.success) {
                toast.success('Verification email sent successfully!', { position: 'top-right' })
            }
        } catch (error) {
            console.error('Failed to resend email:', error)
            toast.error('Failed to send verification email. Please try again.', {
                position: 'top-right'
            })
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="min-h-screen bg-brand flex items-center justify-center p-4">
            <div className="relative z-10 w-full max-w-md">
                <Card
                    className="backdrop-blur-lg bg-surface border border-surface shadow-2xl"
                    style={{
                        backgroundColor: 'rgba(36, 43, 61, 0.8)',
                        borderColor: 'rgba(36, 43, 61, 0.5)',
                        borderRadius: '1px'
                    }}
                >
                    <CardHeader className="space-y-1 pb-6 text-center">
                        {/* Success Icon */}
                        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-primary">
                            Check your email!
                        </h2>
                        <p className="text-center text-secondary text-sm">
                            {email ? (
                                <>
                                    Please check{' '}
                                    <span className="text-brand-primary font-medium">{email}</span>{' '}
                                    to verify your account
                                </>
                            ) : (
                                'Please check your email to verify your account'
                            )}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="text-center space-y-4">
                            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <svg
                                        className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-blue-300 text-sm font-medium">
                                            Don't see the email?
                                        </p>
                                        <p className="text-blue-200 text-xs mt-1">
                                            Check your spam folder or contact support if you don't
                                            receive it within 10 minutes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={handleOpenGmail}
                                className="w-full btn-primary font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                Open Gmail
                            </Button>

                            <Button
                                onClick={handleGoToLogin}
                                className="w-full bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                                Go to Login Page
                            </Button>

                            <div className="w-full text-center py-2 text-sm text-secondary">
                                Didn't receive the email?{' '}
                                <button
                                    onClick={handleResendVerification}
                                    disabled={isResending}
                                    className="text-brand-primary hover:text-brand-secondary ml-1 font-medium cursor-pointer bg-transparent border-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResending ? (
                                        <span className="inline-flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-1 h-3 w-3 text-brand-primary"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Resend verification'
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t border-surface pt-4">
                            <div className="text-center">
                                <p className="text-xs text-secondary">
                                    Need help?{' '}
                                    <a
                                        href="#"
                                        className="text-brand-primary hover:text-brand-secondary transition-colors"
                                    >
                                        Contact Support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-secondary">
                        © 2025 Cinestech. All rights reserved.
                    </p>
                </div>
            </div>

            {/* React Hot Toast Container */}
            <Toaster />
        </div>
    )
}

export default EmailVerificationSuccess
