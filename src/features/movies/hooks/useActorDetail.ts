import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/api/api-client'
import type { ActorDetailResponse } from '../../../shared/types/movies.types'

export const useActorDetail = (actorId: string | null) => {
    return useQuery({
        queryKey: ['actor', actorId],
        queryFn: async () => {
            if (!actorId) return null
            const response = await apiClient.get<ActorDetailResponse>(`/actors/${actorId}`)
            console.log('Actor API Response:', response.data)
            return response.data.data
        },
        enabled: !!actorId,
        staleTime: 5 * 60 * 1000 // 5 minutes
    })
}
