import { rootRoute } from '@/shared/routes/__root'
import { createRoute } from '@tanstack/react-router'
import MyReviewsPage from '../pages/MyReviewsPage'

export const myReviewsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/profile/reviews',
    component: () => <MyReviewsPage />
})
