import { rootRoute } from '@/shared/routes/__root'
import { createRoute } from '@tanstack/react-router'
import MovieDetailPage from '../pages/MovieDetailPage'

export const movieDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/movie/$movieId',
    component: MovieDetailPage
})
