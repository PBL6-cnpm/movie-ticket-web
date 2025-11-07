import { rootRoute } from '@/shared/routes/__root'
import { createRoute } from '@tanstack/react-router'
import PaymentSuccessPage from '../pages/PaymentSuccessPage'

export const paymentSuccessRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/payment/success',
    component: PaymentSuccessPage
})
