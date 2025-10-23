import { mockPromotions } from '@/shared/data/mockPromotions'
import { Link } from '@tanstack/react-router'
import { Ticket, ArrowRight } from 'lucide-react'
import React from 'react'

const PromotionsSection: React.FC = () => {
    return (
        <div className="py-16 lg:py-20 bg-[#1a2232]/50">
            <div className="container-custom">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-[#fe7e32] to-[#648ddb] rounded-full"></div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white">Deals & Promotions</h2>
                    </div>
                    <Link to="/promotions" className="text-sm font-semibold text-[#fe7e32] hover:text-white transition-colors flex items-center gap-1">
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockPromotions.map((promo) => (
                        <div
                            key={promo.id}
                            className="group relative bg-[#242b3d] rounded-2xl overflow-hidden shadow-lg border border-transparent hover:border-[#fe7e32]/50 transition-all duration-300"
                        >
                            <div className="relative h-48">
                                <img
                                    src={promo.imageUrl}
                                    alt={promo.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            </div>
                            <div className="p-6">
                                <div className="absolute -top-5 right-5 w-12 h-12 bg-[#fe7e32] rounded-full flex items-center justify-center border-4 border-[#242b3d] group-hover:scale-110 transition-transform duration-300">
                                    <Ticket className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 pr-8">{promo.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2">{promo.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PromotionsSection
