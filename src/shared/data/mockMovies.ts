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
    cast: string[]
    director: string
    ageLimit?: number
    ageRating?: string
}

export const mockMovies: Movie[] = [
    {
        id: '1',
        title: 'The Matrix: Resurrections',
        description:
            'Neo lives a seemingly ordinary life as Thomas A. Anderson in a world that seems familiar yet strange.',
        poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
        releaseDate: '2024-03-15',
        duration: 148,
        genres: ['Action', 'Sci-Fi'],
        rating: 8.2,
        status: 'now-showing',
        cast: ['Keanu Reeves', 'Carrie-Anne Moss'],
        director: 'Lana Wachowski'
    },
    {
        id: '2',
        title: 'Resident Evil: Welcome to Raccoon City',
        description: 'Returning to the origins of the massively popular RESIDENT EVIL franchise.',
        poster: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
        releaseDate: '2024-02-20',
        duration: 107,
        genres: ['Horror', 'Action'],
        rating: 7.5,
        status: 'now-showing',
        cast: ['Kaya Scodelario', 'Hannah John-Kamen'],
        director: 'Johannes Roberts'
    },
    {
        id: '3',
        title: 'Sword Art Online: Progressive - Aria of a Starless Night',
        description:
            'High school student Asuna struggles to survive after being trapped in the game Sword Art Online.',
        poster: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
        releaseDate: '2024-04-10',
        duration: 97,
        genres: ['Animation', 'Adventure'],
        rating: 8.8,
        status: 'coming-soon',
        cast: ['Yoshitsugu Matsuoka', 'Haruka Tomatsu'],
        director: 'Ayako Kono'
    },
    {
        id: '4',
        title: 'Spider-Man: No Way Home',
        description:
            'Peter Parker seeks help from Doctor Strange when his secret identity is revealed.',
        poster: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
        releaseDate: '2024-01-05',
        duration: 148,
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        rating: 9.1,
        status: 'now-showing',
        cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
        director: 'Jon Watts'
    },
    {
        id: '5',
        title: 'Dune: Part Two',
        description:
            'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.',
        poster: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
        releaseDate: '2024-05-20',
        duration: 166,
        genres: ['Sci-Fi', 'Adventure'],
        rating: 8.9,
        status: 'coming-soon',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
        director: 'Denis Villeneuve'
    },
    {
        id: '6',
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully lives with his newfound family formed on the planet of Pandora.',
        poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg',
        releaseDate: '2024-03-30',
        duration: 192,
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        rating: 8.7,
        status: 'now-showing',
        cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
        director: 'James Cameron'
    },
    {
        id: '7',
        title: 'Top Gun: Maverick',
        description:
            'After thirty years, Maverick is still pushing the envelope as a top naval aviator.',
        poster: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
        releaseDate: '2024-06-15',
        duration: 130,
        genres: ['Action', 'Drama'],
        rating: 9.2,
        status: 'coming-soon',
        cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly'],
        director: 'Joseph Kosinski'
    },
    {
        id: '8',
        title: 'Black Panther: Wakanda Forever',
        description:
            'The people of Wakanda fight to protect their home from intervening world powers.',
        poster: 'https://m.media-amazon.com/images/M/MV5BNTM4NjIxNmEtYWE5NS00NDczLTkyNWQtYThhNmQyZGQzMjM0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BNTM4NjIxNmEtYWE5NS00NDczLTkyNWQtYThhNmQyZGQzMjM0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
        releaseDate: '2024-02-10',
        duration: 161,
        genres: ['Action', 'Adventure', 'Drama'],
        rating: 8.4,
        status: 'now-showing',
        cast: ['Letitia Wright', "Lupita Nyong'o", 'Danai Gurira'],
        director: 'Ryan Coogler'
    },
    {
        id: '9',
        title: 'John Wick: Chapter 4',
        description:
            'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.',
        poster: 'https://m.media-amazon.com/images/M/MV5BMDExZGMyOTMtMDgyYi00NGIwLWJhMTEtOTdkZGFjNmZiMTEwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BMDExZGMyOTMtMDgyYi00NGIwLWJhMTEtOTdkZGFjNmZiMTEwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg',
        releaseDate: '2024-07-12',
        duration: 169,
        genres: ['Action', 'Thriller'],
        rating: 8.9,
        status: 'now-showing',
        cast: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård'],
        director: 'Chad Stahelski'
    },
    {
        id: '10',
        title: 'Fast X',
        description:
            'Over many missions and against impossible odds, Dom Toretto and his family have outsmarted and outdriven every foe.',
        poster: 'https://m.media-amazon.com/images/M/MV5BNzVlYmY5ZTItZTBkZi00NDVjLTlkZTUtMTgwZDEyNmY4ZGQ4XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BNzVlYmY5ZTItZTBkZi00NDVjLTlkZTUtMTgwZDEyNmY4ZGQ4XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
        releaseDate: '2024-08-18',
        duration: 141,
        genres: ['Action', 'Adventure'],
        rating: 7.8,
        status: 'coming-soon',
        cast: ['Vin Diesel', 'Michelle Rodriguez', 'Jason Momoa'],
        director: 'Louis Leterrier'
    },
    {
        id: '11',
        title: 'Oppenheimer',
        description:
            'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        poster: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
        banner: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
        releaseDate: '2024-09-21',
        duration: 180,
        genres: ['Biography', 'Drama', 'History'],
        rating: 9.0,
        status: 'coming-soon',
        cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
        director: 'Christopher Nolan'
    },
    {
        id: '12',
        title: 'Guardians of the Galaxy Vol. 3',
        description:
            'Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own.',
        poster: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        banner: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        releaseDate: '2024-04-28',
        duration: 150,
        genres: ['Action', 'Adventure', 'Comedy'],
        rating: 8.6,
        status: 'now-showing',
        cast: ['Chris Pratt', 'Zoe Saldana', 'Dave Bautista'],
        director: 'James Gunn'
    },
    {
        id: '13',
        title: 'The Flash',
        description:
            'Barry Allen uses his super speed to change the past, but his attempt to save his family creates a world without superheroes.',
        poster: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        banner: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        releaseDate: '2024-06-16',
        duration: 144,
        genres: ['Action', 'Adventure', 'Fantasy'],
        rating: 7.2,
        status: 'now-showing',
        cast: ['Ezra Miller', 'Michael Keaton', 'Sasha Calle'],
        director: 'Andy Muschietti'
    },
    {
        id: '14',
        title: 'Indiana Jones and the Dial of Destiny',
        description:
            'Archaeologist Indiana Jones races against time to retrieve a legendary artifact that can change the course of history.',
        poster: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        banner: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        releaseDate: '2024-10-30',
        duration: 154,
        genres: ['Action', 'Adventure'],
        rating: 8.1,
        status: 'coming-soon',
        cast: ['Harrison Ford', 'Phoebe Waller-Bridge', 'Antonio Banderas'],
        director: 'James Mangold'
    },
    {
        id: '15',
        title: 'Transformers: Rise of the Beasts',
        description:
            'During the 1990s, a new faction of Transformers - the Maximals - join the Autobots as allies in the battle for Earth.',
        poster: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        banner: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        releaseDate: '2024-05-09',
        duration: 127,
        genres: ['Action', 'Adventure', 'Sci-Fi'],
        rating: 7.6,
        status: 'now-showing',
        cast: ['Anthony Ramos', 'Dominique Fishback', 'Luna Lauren Velez'],
        director: 'Steven Caple Jr.'
    },
    {
        id: '16',
        title: 'Mission: Impossible – Dead Reckoning Part One',
        description:
            'Ethan Hunt and his IMF team must track down a terrifying new weapon that threatens all of humanity.',
        poster: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        banner: 'https://cdn-images.vtv.vn/2021/8/10/jack-8-162850540180217894975-16285809025191185121207-1628604928100270201268.jpg',
        releaseDate: '2024-11-12',
        duration: 163,
        genres: ['Action', 'Adventure', 'Thriller'],
        rating: 8.8,
        status: 'coming-soon',
        cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames'],
        director: 'Christopher McQuarrie'
    }
]

export const getFeaturedMovies = (): Movie[] => {
    return mockMovies.filter((movie) => movie.rating >= 8.5)
}

export const getNowShowingMovies = (): Movie[] => {
    return mockMovies.filter((movie) => movie.status === 'now-showing')
}

export const getComingSoonMovies = (): Movie[] => {
    return mockMovies.filter((movie) => movie.status === 'coming-soon')
}
