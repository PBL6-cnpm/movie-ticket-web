import { createRouter } from '@tanstack/react-router'

import { rootRoute } from '@/shared/routes/__root'

//features
import {
    emailVerificationSuccessRoute,
    forgotPasswordRoute,
    loginRoute,
    registerRoute,
    verifyEmailSuccessRoute
} from '@/features/auth/routes'
import { homeRoute } from '@/features/home/routes'

const routeTree = rootRoute.addChildren([
    homeRoute,
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    emailVerificationSuccessRoute,
    verifyEmailSuccessRoute
])

export const router = createRouter({
    routeTree
})
