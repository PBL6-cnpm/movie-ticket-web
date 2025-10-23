'use client'

import Button from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../hooks/auth.hook'

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const { forgotPassword, isLoading, error } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await forgotPassword({ email })
        if (result.success) {
            setSuccess(true)
        }
    }

    const renderContent = () => {
        if (success) {
            return (
                <Card className="w-full max-w-md bg-surface/80 backdrop-blur-lg border-none shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Check Your Email</h2>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-secondary mb-6">
                            We've sent a new password to your email address. If you don't see the email, please check your spam folder.
                        </p>
                        <Button onClick={() => navigate({ to: '/login' })} className="w-full btn-primary font-medium py-3">
                            Back to Login
                        </Button>
                        <button onClick={() => setSuccess(false)} className="mt-4 text-sm text-brand-primary hover:text-brand-secondary transition-colors">
                            Try a different email
                        </button>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card className="w-full max-w-md bg-surface/80 backdrop-blur-lg border-none shadow-2xl">
                <CardHeader className="text-center">
                    <h2 className="text-2xl font-bold text-primary">Forgot Password?</h2>
                    <p className="text-secondary text-sm pt-1">
                        Enter your email and we'll help you out.
                    </p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 text-red-300 text-sm rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-secondary">Email Address</label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="input-field bg-[#1a2232] border-gray-700"
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <Button type="submit" disabled={isLoading} className="w-full btn-primary font-medium py-3">
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </div>
                    </form>
                    <div className="text-center mt-6">
                        <button onClick={() => navigate({ to: '/login' })} className="text-sm text-brand-primary hover:text-brand-secondary transition-colors">
                            Back to Login
                        </button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-brand">
            <div className="hidden lg:block relative">
                <img 
                    src="https://source.unsplash.com/random/1600x900?abstract,security,dark"
                    alt="Abstract security background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a2232] via-[#1a2232]/80 to-[#1a2232]"></div>
                <div className="absolute top-8 left-8 text-2xl font-bold text-white">
                    Cine<span className="text-[#fe7e32]">STECH</span>
                </div>
            </div>
            <div className="flex items-center justify-center p-4">
                {renderContent()}
            </div>
        </div>
    )
}

export default ForgotPasswordForm
