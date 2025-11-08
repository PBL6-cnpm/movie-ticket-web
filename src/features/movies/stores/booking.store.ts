import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface BookingState {
    branchId?: string
    movieId?: string
    date?: string
    showtimeId?: string
    redirectUrl?: string
}

interface BookingStore extends BookingState {
    setBookingState: (state: BookingState) => void
    clearBookingState: () => void
}

export const useBookingStore = create<BookingStore>()(
    persist(
        (set) => ({
            branchId: undefined,
            movieId: undefined,
            date: undefined,
            showtimeId: undefined,
            redirectUrl: undefined,
            setBookingState: (state) =>
                set((prev) => ({
                    ...prev,
                    ...state
                })),
            clearBookingState: () =>
                set({
                    branchId: undefined,
                    movieId: undefined,
                    date: undefined,
                    showtimeId: undefined,
                    redirectUrl: undefined
                })
        }),
        {
            name: 'booking-storage',
            storage: createJSONStorage(() => sessionStorage) // Use sessionStorage to clear on browser close
        }
    )
)
