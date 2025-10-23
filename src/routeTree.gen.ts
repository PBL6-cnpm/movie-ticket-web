import { emailVerificationRoute } from './features/auth/routes/EmailVerification'
import { forgotPasswordRoute } from './features/auth/routes/ForgotPassword'
import { loginRoute } from './features/auth/routes/Login'
import { registerRoute } from './features/auth/routes/Register'
import { verifyEmailRoute } from './features/auth/routes/VerifyEmail'
import { verifyEmailFailureRoute } from './features/auth/routes/VerifyEmailFailure'
import { homeRoute } from './features/home/routes/HomeRoute'
import { actorDetailRoute } from './features/movies/routes/ActorDetailRoute'
import { bookingRoute } from './features/movies/routes/BookingRoute'
import { movieDetailRoute } from './features/movies/routes/MovieDetailRoute'
import { moviesRoute } from './features/movies/routes/MoviesRoute'
import { aboutRoute } from './features/about/routes/AboutRoute'
import { upcomingMoviesRoute } from './features/movies/routes/UpcomingMoviesRoute'
import { nowShowingMoviesRoute } from './features/movies/routes/NowShowingMoviesRoute'
import { promotionsRoute } from './features/promotions/routes/PromotionsRoute'
import { changePasswordRoute, editProfileRoute, profileRoute } from './features/profile/routes'
import { rootRoute } from './shared/routes/__root'

// Create the route tree
export const routeTree = rootRoute.addChildren([
    homeRoute,
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    emailVerificationRoute,
    verifyEmailRoute,
    verifyEmailFailureRoute,
    moviesRoute,
    movieDetailRoute,
    actorDetailRoute,
    profileRoute.addChildren([editProfileRoute, changePasswordRoute]),
    bookingRoute,
    upcomingMoviesRoute,
    nowShowingMoviesRoute,
    promotionsRoute,
    aboutRoute
])
