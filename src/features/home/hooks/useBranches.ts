import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/api/api-client'

interface Branch {
    id: string
    name: string
    address: string
    createdAt: string
    updatedAt: string
}

interface BranchesResponse {
    success: boolean
    statusCode: number
    message: string
    code: string
    data: Branch[]
}

const fetchBranches = async (): Promise<Branch[]> => {
    const response = await apiClient.get<BranchesResponse>('/branches')

    if (response.data.success && response.data.data) {
        return response.data.data
    }

    throw new Error('Failed to fetch branches')
}

export const useBranches = () => {
    return useQuery({
        queryKey: ['branches'],
        queryFn: fetchBranches,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000 // 10 minutes
    })
}

export type { Branch }
