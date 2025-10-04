import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../shared/routes/__root'
import ActorDetailPage from '../pages/ActorDetailPage'

export const actorDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/actor/$actorId',
    component: ActorDetailPage
})
