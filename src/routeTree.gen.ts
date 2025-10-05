import { emailVerificationRoute } from './features/auth/routes/EmailVerification'
import { forgotPasswordRoute } from './features/auth/routes/ForgotPassword'
import { loginRoute } from './features/auth/routes/Login'
import { registerRoute } from './features/auth/routes/Register'
import { verifyEmailRoute } from './features/auth/routes/VerifyEmail'
import { homeRoute } from './features/home/routes/HomeRoute'
import { actorDetailRoute } from './features/movies/routes/ActorDetailRoute'
import { movieDetailRoute } from './features/movies/routes/MovieDetailRoute'
import { moviesRoute } from './features/movies/routes/MoviesRoute'
import { rootRoute } from './shared/routes/__root'

// Create the route tree
export const routeTree = rootRoute.addChildren([
    homeRoute,
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    emailVerificationRoute,
    verifyEmailRoute,
    moviesRoute,
    movieDetailRoute,
    actorDetailRoute
])
