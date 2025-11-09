import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../shared/routes/__root'
import BranchShowtimesPage from '../pages/BranchShowtimesPage'

export const branchShowtimesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/branches/$branchId/showtimes',
    component: BranchShowtimesPage
})
