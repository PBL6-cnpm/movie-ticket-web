import { createRoute } from '@tanstack/react-router';
import EditProfile from '../pages/EditProfile';
import { profileRoute } from './ProfileRoute';

export const editProfileRoute = createRoute({
    getParentRoute: () => profileRoute,
    path: '/edit',
    component: () => <EditProfile />
})
