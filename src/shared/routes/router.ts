import { createRouter } from '@tanstack/react-router'

import { rootRoute } from '@/shared/routes/__root'

//features
import { loginRoute, registerRoute } from '@/features/auth/routes'
import { homeRoute } from '@/features/home/routes'

const routeTree = rootRoute.addChildren([homeRoute, loginRoute, registerRoute])

export const router = createRouter({
    routeTree
})
