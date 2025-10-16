import { createRoute } from '@tanstack/react-router';
import ChangePassword from '../pages/ChangePassword';
import { profileRoute } from './ProfileRoute';

// Change password route
export const changePasswordRoute = createRoute({
    getParentRoute: () => profileRoute,
    path: '/change-password',
    component: () => <ChangePassword />
})
