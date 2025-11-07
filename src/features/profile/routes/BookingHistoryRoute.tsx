import { rootRoute } from '@/shared/routes/__root'
import { createRoute } from '@tanstack/react-router'
import BookingHistoryPage from '../pages/BookingHistoryPage'

// Make booking history a top-level route so it doesn't render the profile layout/sidebar.
export const bookingHistoryRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/profile/bookings',
    component: () => <BookingHistoryPage />
})
