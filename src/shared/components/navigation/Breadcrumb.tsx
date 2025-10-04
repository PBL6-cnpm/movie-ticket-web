import { Link } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'
import React from 'react'

interface BreadcrumbItem {
    label: string
    path?: string
    isActive?: boolean
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
    return (
        <nav
            className={`flex items-center space-x-2 text-sm text-secondary mb-6 ${className}`}
            aria-label="Breadcrumb"
        >
            {/* Home Icon */}
            <Link
                to="/"
                className="flex items-center text-secondary hover:text-brand-primary transition-colors duration-200"
            >
                <Home className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                    {item.path && !item.isActive ? (
                        <Link
                            to={item.path}
                            className="text-secondary hover:text-brand-primary transition-colors duration-200 capitalize"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span
                            className={`capitalize ${item.isActive ? 'text-brand-primary font-medium' : 'text-secondary'}`}
                        >
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    )
}

export default Breadcrumb
