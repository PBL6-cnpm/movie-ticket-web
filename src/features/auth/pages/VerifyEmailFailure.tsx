'use client'

import Button from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { useNavigate } from '@tanstack/react-router'

const VerifyEmailFailure = () => {
    const navigate = useNavigate()
    const handleGoToLogin = () => {
        navigate({ to: '/login' })
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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                            <svg
                                className="w-8 h-8 text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-primary">
                            Email verification failed!
                        </h2>
                        <p className="text-center text-secondary text-sm">
                            We couldn’t verify your email address. Please try again or request a new verification link.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-1 pb-6 text-center">
                            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <svg
                                        className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-6h2v4h-2V7z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-red-300 text-sm font-medium">
                                            Verification failed
                                        </p>
                                        <p className="text-red-200 text-xs mt-1">
                                            The verification link may have expired or already been used. 
                                            Please request a new link from your account settings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={handleGoToLogin}
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
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                                Back to Login
                            </Button>
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
                        © 2024 Cinestech. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailFailure
