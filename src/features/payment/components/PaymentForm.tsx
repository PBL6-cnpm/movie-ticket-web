import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Loader2 } from 'lucide-react'
import { useState, useEffect, useRef, type FormEvent } from 'react'

interface PaymentFormProps {
    clientSecret: string
}

export default function PaymentForm({ clientSecret }: PaymentFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes in seconds

    // Use useRef to store the end time. This persists across re-renders.
    const endTimeRef = useRef<number>(Date.now() + 5 * 60 * 1000)

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now()
            const remainingTime = Math.round((endTimeRef.current - now) / 1000)

            if (remainingTime <= 0) {
                setTimeLeft(0)
                clearInterval(timer)
                window.location.href = '/booking'
            } else {
                setTimeLeft(remainingTime)
            }
        }, 1000)

        // Clean up the timer when the component unmounts
        return () => clearInterval(timer)
    }, []) // Empty dependency array ensures this effect runs only once on mount

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            console.error('Stripe or Elements not loaded')
            return
        }

        setIsProcessing(true)
        setErrorMessage('')

        try {
            console.log('Confirming payment with clientSecret:', clientSecret)
            
            const returnUrl = new URL('/payment/success', window.location.origin)
            returnUrl.searchParams.set('payment_intent_client_secret', clientSecret)

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnUrl.toString(),
                },
            })

            if (error) {
                console.error('Payment confirmation error:', error)
                
                if (error.type === 'card_error' || error.type === 'validation_error') {
                    setErrorMessage(error.message || 'Payment failed. Please check your card details.')
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.')
                }
                
                setIsProcessing(false)
            }
        } catch (err) {
            console.error('Unexpected error during payment:', err)
            setErrorMessage('An unexpected error occurred. Please try again.')
            setIsProcessing(false)
        }
    }

    // Helper function to format time into MM:SS format
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-semibold text-lg text-yellow-800">Time left to complete payment</p>
                <p className="text-3xl font-mono text-yellow-900 mt-1">{formatTime(timeLeft)}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <PaymentElement 
                    options={{
                        layout: 'tabs'
                    }}
                />
            </div>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Payment Error</p>
                    <p className="text-sm mt-1">{errorMessage}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-slate-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    'Pay Now'
                )}
            </button>

            <p className="text-xs text-gray-500 text-center">
                Your payment information is secured by Stripe. We do not store your card details.
            </p>
        </form>
    )
}