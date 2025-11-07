'use client'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { apiClient } from '@/shared/api/api-client'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Calendar, ChevronDown, Clapperboard, Info, LogOut, MapPin, Popcorn, Ticket, User } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import GlobalSearch from './GlobalSearch'

const subNavLinks = [
    // { name: 'Select Cinema', path: '#', icon: MapPin },
    { name: 'Showtimes', path: '#', icon: Calendar }
]

interface Branch {
    id: string
    name: string
    address: string
}

const fetchBranches = async (): Promise<Branch[]> => {
    const response = await apiClient.get('/branches')
    if (response.data.success) {
        return response.data.data
    }
    throw new Error('Failed to fetch branches')
}

const NewHeader: React.FC = () => {
    const { account, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false)
    const branchMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const userMenuRef = useRef<HTMLDivElement>(null)

    const { data: branches, isLoading: branchesLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: fetchBranches,
        enabled: isBranchMenuOpen, // Only fetch when the menu is hovered
        staleTime: 1000 * 60 * 5 // 5 minutes
    })

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate({ to: '/' })
    }

    const handleBranchMenuEnter = () => {
        if (branchMenuTimeoutRef.current) {
            clearTimeout(branchMenuTimeoutRef.current)
        }
        setIsBranchMenuOpen(true)
    }

    const handleBranchMenuLeave = () => {
        branchMenuTimeoutRef.current = setTimeout(() => {
            setIsBranchMenuOpen(false)
        }, 200)
    }

    const toggleUserMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsUserMenuOpen(!isUserMenuOpen)
    }

    // Reset dropdown when user logs in
    useEffect(() => {
        setIsUserMenuOpen(false)
    }, [isAuthenticated])

    return (
        <header className="bg-[#1a2232] shadow-lg sticky top-0 z-50 border-b border-white/10">
            {/* Main Header */}
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Left Side: Logo & CTAs */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-2xl font-bold text-white">
                            Cine<span className="text-[#fe7e32]">STECH</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#242b3d] border border-gray-700 rounded-full text-sm text-white hover:bg-[#fe7e32] hover:border-[#fe7e32] transition-colors cursor-pointer">
                                <Popcorn className="w-4 h-4 text-[#fe7e32]" />
                                <span>Order Refreshment</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#fe7e32] text-white rounded-full text-sm font-semibold hover:bg-[#e56e29] transition-all cursor-pointer">
                                <Ticket className="w-4 h-4" />
                                <span>Book Ticket</span>
                            </button>
                        </div>
                    </div>
                    {/* Right Side: Search & Auth */}
                    <div className="flex items-center gap-4">
                        <GlobalSearch />

                        {/* Auth Section */}
                        <div className="border-l border-gray-700 pl-4">
                            {isAuthenticated && account ? (
                                <div className="relative" ref={userMenuRef}>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={account.avatarUrl || '/default-avatar.png'}
                                            alt="User"
                                            onClick={toggleUserMenu}
                                            className="w-9 h-9 rounded-full object-cover cursor-pointer"
                                        />
                                        <ChevronDown
                                            className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#242b3d] rounded-lg shadow-xl border border-white/10 py-2 animate-in fade-in zoom-in-95">
                                            <div className="px-3 py-2 border-b border-gray-700">
                                                <p className="text-sm font-semibold text-white truncate">
                                                    {account.fullName}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate">
                                                    {account.email}
                                                </p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#1a2232] hover:text-white"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <User className="w-4 h-4" /> Profile
                                            </Link>
                                            <Link
                                                to="/profile/bookings"
                                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-[#1a2232] hover:text-white"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Clapperboard className="w-4 h-4" /> Bookings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-[#1a2232] hover:text-red-500"
                                            >
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-gray-700/50 rounded-full hover:bg-gray-600/50 transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub Header */}
            <div className="bg-[#242b3d] border-t border-b border-white/5">
                <div className="container-custom">
                    <div className="flex items-center justify-between h-12">
                        <div className="flex items-center gap-8">
                            <div
                                onMouseEnter={handleBranchMenuEnter}
                                onMouseLeave={handleBranchMenuLeave}
                                className="relative h-full flex items-center"
                            >
                                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                    <MapPin className="w-4 h-4 text-[#648ddb]" />
                                    <span>Select Cinema</span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${isBranchMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {isBranchMenuOpen && (
                                    <div className="absolute top-full mt-2 w-72 bg-[#242b3d] rounded-lg shadow-xl border border-white/10 py-2 animate-in fade-in zoom-in-95">
                                        {branchesLoading ? (
                                            <div className="flex justify-center items-center h-24">
                                                <div className="w-6 h-6 border-2 border-[#fe7e32] border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            branches?.map((branch) => (
                                                <Link
                                                    key={branch.id}
                                                    to="/"
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#1a2232] hover:text-white truncate"
                                                >
                                                    {branch.name} -{' '}
                                                    <span className="text-xs text-gray-500">
                                                        {branch.address}
                                                    </span>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            {subNavLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={'/'}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {' '}
                                    <link.icon className="w-4 h-4 text-[#648ddb]" />
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                        </div>
                        <div>
                            <Link
                                to="/about"
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                <Info className="w-4 h-4 text-[#648ddb]" />
                                <span>About</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default NewHeader
