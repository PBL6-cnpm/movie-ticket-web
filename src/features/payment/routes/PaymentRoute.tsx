import { rootRoute } from '@/shared/routes/__root'
import { createRoute } from '@tanstack/react-router'
import PaymentPage from '../pages/PaymentPage'

export const paymentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/payment',
    component: PaymentPage
})
