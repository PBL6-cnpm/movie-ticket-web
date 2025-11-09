export interface ReviewAccount {
    id: string
    fullName?: string | null
    avatarUrl?: string | null
}

export interface ReviewItem {
    id?: string
    rating: number
    comment: string
    createdAt: string
    updatedAt: string
    account: ReviewAccount
    movieId: string
}

export interface ReviewsMeta {
    limit: number
    offset: number
    total: number
    totalPages: number
}

export interface ReviewsResponse {
    items: ReviewItem[]
    meta: ReviewsMeta
}
