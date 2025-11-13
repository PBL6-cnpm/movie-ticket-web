import type { ApiResponse } from '@/features/auth/types/base-response.type'
import { apiClient } from '@/shared/api/api-client'
import { HttpStatusCode } from 'axios'
import { useCallback, useState } from 'react'

export interface BookingData {
    id: string
    totalBookingPrice: number
    dateTimeBooking: string
    qrUrl: string | null
    status: string // Added status for potential future use
    checkInStatus: boolean
    showTime: {
        id: string
        timeStart: string
        showDate: string
        movie: {
            id: string
            name: string
            poster: string
        }
    }
    seats: Array<{
        id: string
        name: string
        typeSeat: {
            id: string
            name: string
        }
        room: {
            id: string
            name: string
        }
    }>
    refreshmentss: Array<{ // Corrected to be an array type
        id: string;
        name: string;
        price: number;
    }>
}

export interface BookingsResponse {
    items: BookingData[];
    meta: {
        limit: number;
        offset: number;
        total: number;
        totalPages: number;
    }
}

export const useBooking = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const clearError = () => setError(null)

    const getBookings = useCallback(async (page = 1, limit = 5) => {
        setIsLoading(true)
        clearError()

        const offset = (page - 1) * limit;

        try {
            const response = await apiClient.get<ApiResponse<BookingsResponse>>(
                '/bookings',
                {
                    params: { limit, offset }
                }
            )
            
            const bookingsData = response.data.data

            return {
                success: true,
                data: bookingsData,
                message: response.data.message || 'Bookings retrieved successfully'
            }
        } catch (error: unknown) {
            const apiError = error as ApiResponse<null>
            const errorStatusCode = apiError.statusCode
            const errorMessage = apiError.message || 'Retrieve bookings failed'

            console.error('Retrieve Bookings error:', errorMessage)

            setError(
                errorStatusCode !== HttpStatusCode.InternalServerError
                    ? errorMessage
                    : 'Retrieve bookings failed'
            )

            return {
                success: false,
                message: errorMessage,
                data: null
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        isLoading,
        error,
        getBookings,
        clearError
    }
}