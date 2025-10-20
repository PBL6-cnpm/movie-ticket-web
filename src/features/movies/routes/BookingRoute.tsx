import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../shared/routes/__root'
import BookingPage from '../pages/BookingPage'

export const bookingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/booking/$movieId/$showtimeId',
    component: () => {
        // Get params from the route context
        const params = bookingRoute.useParams()
        return <BookingPage movieId={params.movieId} showtimeId={params.showtimeId} />
    }
})
