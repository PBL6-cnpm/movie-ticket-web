import { Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Footer } from './footer'
import NewHeader from './header/NewHeader'

export const RootComponent = () => {
    const location = useLocation()

    // Reset scroll position when route changes
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            })
        }, 0)

        return () => clearTimeout(timer)
    }, [location.pathname])

    return (
        <>
            <NewHeader />
            <main>
                <Outlet />
            </main>
            <Footer />
            {/* <TanStackRouterDevtools /> */}
        </>
    )
}
