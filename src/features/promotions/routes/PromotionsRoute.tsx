import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '@/shared/routes/__root'
import PromotionsPage from '../pages/PromotionsPage'

export const promotionsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/promotions',
    component: PromotionsPage
})
