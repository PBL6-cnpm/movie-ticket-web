import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import PaymentForm from '@/features/payment/components/PaymentForm'
import { useCancelPayment } from '@/features/payment/hooks/usePayment'
import PageTransition from '@/shared/components/ui/PageTransition'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const PaymentPage: React.FC = () => {
    const navigate = useNavigate()
    const [clientSecret, setClientSecret] = useState<string | null>(null)
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

    const handleCancelAndGoBack = async () => {
        if (clientSecret) {
            try {
                await cancelPaymentMutation.mutateAsync(clientSecret)
                console.log('Payment intent cancelled successfully.')
            } catch (error) {
                console.error('Failed to cancel payment intent:', error)
            }
        }
        // Clean up session storage
        sessionStorage.removeItem('payment_client_secret')

        navigate({ to: '/booking' })
    }

    if (!clientSecret) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
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
                            <h1 className="text-xl font-bold text-slate-800">Complete Your Payment</h1>
                            <div className="w-32" /> {/* Spacer */}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-lg mx-auto">
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