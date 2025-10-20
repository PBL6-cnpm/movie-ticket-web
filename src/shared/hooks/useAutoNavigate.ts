const paramHierarchy = ['branchId', 'movieId', 'date', 'showtimeId']

export function useAutoNavigate() {
    const handleNavigation = (paramName: string, value: string | number) => {
        const paramIndex = paramHierarchy.indexOf(paramName)
        const paramsToClear = paramHierarchy.slice(paramIndex + 1)

        // Get current search params
        const currentUrl = new URL(window.location.href)
        const currentParams = new URLSearchParams(currentUrl.search)

        // Set the new parameter value
        currentParams.set(paramName, String(value))

        // Clear all dependent parameters
        for (const param of paramsToClear) {
            currentParams.delete(param)
        }

        // Update the URL
        const newUrl = `${window.location.pathname}?${currentParams.toString()}`
        window.history.replaceState({}, '', newUrl)

        // Force a page refresh/re-render by dispatching a popstate event
        window.dispatchEvent(new PopStateEvent('popstate'))
    }

    return handleNavigation
}
