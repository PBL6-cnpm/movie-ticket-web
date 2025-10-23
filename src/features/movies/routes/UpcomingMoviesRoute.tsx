import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/shared/routes/__root'
import UpcomingMoviesPage from '../pages/UpcomingMoviesPage'

export const upcomingMoviesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/movies/upcoming',
    component: UpcomingMoviesPage
})
