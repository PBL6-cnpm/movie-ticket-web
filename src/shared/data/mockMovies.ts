export interface Movie {
    id: string
    title: string
    description: string
    poster: string
    banner?: string
    releaseDate: string
    duration: number
    genres: string[]
    rating: number
    status: 'now-showing' | 'coming-soon' | 'ended'
    trailer?: string
    actors: string[]
    director: string
    ageLimit?: number
    ageRating?: string
}
