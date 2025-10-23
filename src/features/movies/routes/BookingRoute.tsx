import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../shared/routes/__root'
import BookingPage from '../pages/BookingPage'

export const bookingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/booking',
    component: () => {
        return <BookingPage />
    }
})
