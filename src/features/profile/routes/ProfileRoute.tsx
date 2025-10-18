import ProtectedRoute from '@/features/auth/routes/ProtectedRoute'
import { rootRoute } from '@/shared/routes/__root'
import { createRoute } from '@tanstack/react-router'
import ProfileLayout from '../components/ProfileLayout'

// Parent route for profile
export const profileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/profile',
    component: () => (
        <ProtectedRoute>
            <ProfileLayout />
        </ProtectedRoute>
    )
})
