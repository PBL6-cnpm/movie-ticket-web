import ProtectedRoute from '@/features/auth/routes/ProtectedRoute'
import { rootRoute } from '@/shared/routes/__root'
import { createRoute } from '@tanstack/react-router'
import CustomerDashboard from '../components/CustomerDashboard'

export const customerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/customer',
    component: () => (
        <ProtectedRoute requiredRoles={['user']}>
            <CustomerDashboard />
        </ProtectedRoute>
    )
})
