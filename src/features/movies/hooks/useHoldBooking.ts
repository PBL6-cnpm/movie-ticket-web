import { useMutation } from '@tanstack/react-query'

import type { ApiResponse } from '@/features/auth/types/base-response.type'
import { apiClient } from '@/shared/api/api-client'

export interface HoldBookingPayload {
    showTimeId: string
    seatIds: string[]
    voucherCode?: string | null
    refreshmentsOption: Array<{
        refreshmentId: string
        quantity: number
    }>
}

export interface HoldBookingData {
    bookingId: string
    totalPrice: number
    message: string
}

const holdBooking = async (payload: HoldBookingPayload): Promise<ApiResponse<HoldBookingData>> => {
    const { data } = await apiClient.post<ApiResponse<HoldBookingData>>('/bookings/hold', payload)
    return data
}

export const useHoldBooking = () => {
    return useMutation({
        mutationFn: holdBooking
    })
}
