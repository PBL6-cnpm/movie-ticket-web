interface AuthButtonsProps {
    onLogin?: () => void
    onSignup?: () => void
}

export default function AuthButtons({ onLogin }: AuthButtonsProps) {
    return (
        <div className="hidden md:flex items-center px-6 py-1">
            <a href="/login" className="btn-primary text-sm" onClick={onLogin}>
                Login
            </a>
        </div>
    )
}
