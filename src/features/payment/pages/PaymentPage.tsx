import PaymentForm from '@/features/payment/components/PaymentForm'
import { useCancelPayment } from '@/features/payment/hooks/usePayment'
import PageTransition from '@/shared/components/ui/PageTransition'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Clock, Loader2 } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

const PAYMENT_SESSION_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

const PaymentPage: React.FC = () => {
    const navigate = useNavigate()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
    const [stripeConfigError, setStripeConfigError] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const cancelPaymentMutation = useCancelPayment()

    useEffect(() => {
        // Retrieve the client secret and booking ID from session storage
        const storedClientSecret = sessionStorage.getItem('payment_client_secret')

        if (storedClientSecret) {
            setClientSecret(storedClientSecret)
        } else {
            console.warn('No client secret found in session storage. Redirecting home.')
            navigate({ to: '/' })
        }
    }, [navigate])

    useEffect(() => {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined

        if (!publishableKey || publishableKey.trim().length === 0) {
            console.error(
                'Stripe publishable key is missing. Please set VITE_STRIPE_PUBLISHABLE_KEY.'
            )
            setStripeConfigError(
                'Payment service is currently unavailable. Please contact support.'
            )
            return
        }

        try {
            const promise = loadStripe(publishableKey)
            setStripePromise(promise)
        } catch (error) {
            console.error('Failed to initialize Stripe:', error)
            setStripeConfigError('Unable to initialize payment securely. Please try again later.')
        }
    }, [])

    const handleCancelAndGoBack = useCallback(async () => {
        const secret = sessionStorage.getItem('payment_client_secret')
        if (secret) {
            try {
                await cancelPaymentMutation.mutateAsync(secret)
                console.log('Payment intent cancelled successfully.')
            } catch (error) {
                console.error('Failed to cancel payment intent:', error)
            }
            
            // Clean up timer key associated with current secret
            sessionStorage.removeItem(`payment_timer_end_${secret}`)
        }
        
        // Clean up client secret after use
        sessionStorage.removeItem('payment_client_secret')

        navigate({ to: '/booking' })
    }, [navigate, cancelPaymentMutation])

    useEffect(() => {
        // Only run timer logic when clientSecret exists
        if (!clientSecret) return;

        const timerKey = `payment_timer_end_${clientSecret}`
        const storedEndTime = sessionStorage.getItem(timerKey)
        let endTime: number

        if (storedEndTime) {
            endTime = parseInt(storedEndTime, 10)
        } else {
            endTime = new Date().getTime() + PAYMENT_SESSION_DURATION
            sessionStorage.setItem(timerKey, endTime.toString())
        }

        const intervalId = setInterval(() => {
            const remaining = endTime - new Date().getTime()
            setTimeLeft(remaining > 0 ? remaining : 0)
        }, 1000);

        // Initial update to avoid 1-second delay
        const initialRemaining = endTime - new Date().getTime()
        setTimeLeft(initialRemaining > 0 ? initialRemaining : 0)

        return () => clearInterval(intervalId)
    }, [clientSecret])

    useEffect(() => {
        if (timeLeft === 0) {
            console.log('Payment session has expired. Cancelling payment.')
            handleCancelAndGoBack()
        }
    }, [timeLeft, handleCancelAndGoBack])

    const formatTime = (ms: number | null): string => {
        if (ms === null || ms <= 0) return '00:00'
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };

    // --- RENDER LOGIC ---
    if (stripeConfigError) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border border-red-200 rounded-lg shadow-sm p-6 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-2xl">
                        !
                    </div>
                    <h2 className="text-xl font-semibold text-red-600">
                        Payment Configuration Error
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{stripeConfigError}</p>
                    <button
                        onClick={() => navigate({ to: '/' })}
                        className="mt-4 inline-flex items-center justify-center px-5 py-2 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    if (!clientSecret || !stripePromise || timeLeft === null) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3 text-slate-700">
                <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
                <p className="text-sm">Preparing secure payment...</p>
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-100">
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleCancelAndGoBack}
                                className="flex items-center gap-2 text-gray-700 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Booking
                            </button>
                            <h1 className="text-xl font-bold text-slate-800">
                                Complete Your Payment
                            </h1>
                            <div className="w-32" /> {/* Spacer */}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-lg mx-auto">
                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center justify-center gap-2 text-gray-600">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Time left to complete payment</span>
                            </div>
                            <p className="text-3xl font-bold text-slate-800 tracking-wider mt-1">
                                {formatTime(timeLeft)}
                            </p>
                        </div>
                        <Elements options={{ clientSecret }} stripe={stripePromise}>
                            <PaymentForm clientSecret={clientSecret} />
                        </Elements>
                    </div>
                </main>
            </div>
        </PageTransition>
    )
}

export default PaymentPage
