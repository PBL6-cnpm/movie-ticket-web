import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../shared/routes/__root'
import MoviesPage from '../pages/MoviesPage'

export const moviesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/movies',
    component: MoviesPage
})
