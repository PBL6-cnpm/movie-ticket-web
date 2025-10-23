import { mockPromotions } from '@/shared/data/mockPromotions'
import PageTransition from '@/shared/components/ui/PageTransition'
import Breadcrumb from '@/shared/components/navigation/Breadcrumb'
import { CheckCircle2 } from 'lucide-react'

const PromotionsPage = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-[#1a2232] text-white">
                <div className="container-custom py-8">
                    <Breadcrumb
                        items={[
                            { label: 'Home', path: '/' },
                            { label: 'Promotions', isActive: true }
                        ]}
                    />
                    <div className="mt-6 mb-8">
                        <h1 className="text-4xl font-bold">Deals & Promotions</h1>
                        <p className="text-gray-400 mt-2">Check out our latest offers to make your movie experience even better.</p>
                    </div>

                    <div className="space-y-12">
                        {mockPromotions.map((promo, index) => (
                            <div key={promo.id} className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in slide-in-from-bottom duration-500`} style={{animationDelay: `${index * 150}ms`}}>
                                <div className={`relative rounded-2xl overflow-hidden shadow-2xl h-80 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                                    <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-[#fe7e32] mb-4">{promo.title}</h2>
                                    <p className="text-gray-300 mb-6">{promo.description}</p>
                                    <div className="space-y-3">
                                        {promo.fullDetails.map((detail, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                                                <span>{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}

export default PromotionsPage
