import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../shared/routes/__root'
import VerifyEmailFailure from '../pages/VerifyEmailFailure'

export const verifyEmailFailureRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/verify-email-failure',
    component: VerifyEmailFailure
})
