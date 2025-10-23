import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/shared/routes/__root'
import NowShowingMoviesPage from '../pages/NowShowingMoviesPage'

export const nowShowingMoviesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/movies/now-showing',
    component: NowShowingMoviesPage
})