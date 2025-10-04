import { useAuth } from '@/features/auth/hooks/auth.hook'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Header from '../layout/Header'
import { Footer } from './footer'

export const RootComponent = () => {
    const { account, isAuthenticated } = useAuth()

    const shouldShowHeader = !isAuthenticated || account

    return (
        <>
            {shouldShowHeader && <Header />}
            <main>
                <Outlet />
            </main>
            {shouldShowHeader && <Footer />}
            <TanStackRouterDevtools />
        </>
    )
}
