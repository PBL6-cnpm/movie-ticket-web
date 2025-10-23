import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import NewHeader from './header/NewHeader'
import { Footer } from './footer'

export const RootComponent = () => {
    return (
        <>
            <NewHeader />
            <main>
                <Outlet />
            </main>
            <Footer />
            <TanStackRouterDevtools />
        </>
    )
}
