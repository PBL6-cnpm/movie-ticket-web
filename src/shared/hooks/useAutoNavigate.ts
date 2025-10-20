const paramHierarchy = ['branchId', 'movieId', 'date', 'showtimeId']

export function useAutoNavigate() {
    const handleNavigation = (paramName: string, value: string | number) => {
        const paramIndex = paramHierarchy.indexOf(paramName)
        const paramsToClear = paramHierarchy.slice(paramIndex + 1)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newSearch: Record<string, any> = { [paramName]: value }
        for (const param of paramsToClear) {
            newSearch[param] = undefined
        }

        // Use replace to avoid type issues with search parameter
        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${new URLSearchParams(
                Object.entries(newSearch)
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => [key, String(value)])
            ).toString()}`
        )
    }

    return handleNavigation
}
