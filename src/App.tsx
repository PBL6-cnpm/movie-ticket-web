import { QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { queryClient } from '@/shared/api/query-client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Create a new router instance
const router = createRouter({
    routeTree
})

// Register things like loading components, error boundaries, etc
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

function App() {
    return <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
}

export default App
