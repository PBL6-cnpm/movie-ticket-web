import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../shared/routes/__root'
import BookingPage from '../pages/BookingPage'

type BookingSearchParams = {
    branchId?: string
    movieId?: string
    date?: string
    showtimeId?: string
}

export const bookingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/booking',
    validateSearch: (search: Record<string, unknown>): BookingSearchParams => ({
        branchId:
            typeof search.branchId === 'string' && search.branchId.length > 0
                ? search.branchId
                : undefined,
        movieId:
            typeof search.movieId === 'string' && search.movieId.length > 0
                ? search.movieId
                : undefined,
        date: typeof search.date === 'string' && search.date.length > 0 ? search.date : undefined,
        showtimeId:
            typeof search.showtimeId === 'string' && search.showtimeId.length > 0
                ? search.showtimeId
                : undefined
    }),
    component: () => {
        return <BookingPage />
    }
})
