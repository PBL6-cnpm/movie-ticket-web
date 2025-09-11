'use client'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import Button from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

const CustomerDashboard = () => {
    const { user } = useAuth()

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-600 mb-4">Hello Customer! 🎬</h1>
                <p className="text-xl text-gray-600">Welcome back, {user?.name}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                        <span className="text-2xl">🍿</span>
                        Customer Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center">
                            <span className="text-xl mb-1">🎬</span>
                            <span className="text-sm">Browse Movies</span>
                        </Button>

                        <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center">
                            <span className="text-xl mb-1">🎫</span>
                            <span className="text-sm">Book Tickets</span>
                        </Button>

                        <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center">
                            <span className="text-xl mb-1">📋</span>
                            <span className="text-sm">My Bookings</span>
                        </Button>

                        <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center">
                            <span className="text-xl mb-1">⭐</span>
                            <span className="text-sm">My Reviews</span>
                        </Button>

                        <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center">
                            <span className="text-xl mb-1">⚙️</span>
                            <span className="text-sm">Profile Settings</span>
                        </Button>

                        <Button className="h-20 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center">
                            <span className="text-xl mb-1">💰</span>
                            <span className="text-sm">Top Up Coins</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-gray-600">
                        <p className="mb-2">Enjoy your movie experience with us!</p>
                        <div className="flex justify-center gap-4 text-sm">
                            <span>Account: {user?.account_id}</span>
                            <span>•</span>
                            <span>Branch: {user?.branch_id}</span>
                            <span>•</span>
                            <span>Coins: {user?.coin}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CustomerDashboard
