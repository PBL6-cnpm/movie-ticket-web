import { apiClient } from '@/shared/api/api-client'
import Breadcrumb from '@/shared/components/navigation/Breadcrumb'
import PageTransition from '@/shared/components/ui/PageTransition'
import { useQuery } from '@tanstack/react-query'
import { Building, Globe, Mail, Phone, Target, MapPin } from 'lucide-react'

interface Branch {
    id: string;
    name: string;
    address: string;
}

const fetchBranches = async (): Promise<Branch[]> => {
    const response = await apiClient.get('/branches');
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error('Failed to fetch branches');
};

const AboutPage = () => {
    const { data: branches, isLoading: branchesLoading } = useQuery({ 
        queryKey: ['allBranches'], 
        queryFn: fetchBranches 
    });

    const missionData = [
        { icon: Target, text: 'Contribute to the growth of Vietnam\'s film, culture, and entertainment market share.' },
        { icon: Globe, text: 'Develop the best services at optimal prices, suitable for the income of the Vietnamese people.' },
        { icon: Building, text: 'Integrate Vietnamese cinematic art and culture internationally.' }
    ];

    return (
        <PageTransition>
            <div className="bg-[#1a2232] text-white">
                {/* Hero Section */}
                <div className="relative h-80 bg-gradient-to-r from-[#242b3d] to-[#1a2232]">
                    <img src="https://source.unsplash.com/random/1600x900?cinema,audience" alt="Cinema Audience" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                    <div className="relative container-custom h-full flex flex-col justify-center">
                        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'About Us', isActive: true }]} />
                        <h1 className="text-5xl font-bold mt-4">About CineSTECH</h1>
                        <p className="text-lg text-gray-300 mt-2 max-w-3xl">Discover our story, our mission, and our commitment to bringing the best cinematic experiences to Vietnam.</p>
                    </div>
                </div>

                <div className="py-16 lg:py-20">
                    <div className="container-custom space-y-20">
                        {/* Introduction Section */}
                        <section className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">The Nation's Favorite Cinema</h2>
                                <p className="text-gray-300 mb-4">
                                    CineSTECH is one of the most beloved cinema chains in Vietnam, offering a diverse range of entertainment models. Our goal is to be the ultimate entertainment destination for every Vietnamese family.
                                </p>
                                <p className="text-gray-300">
                                    Known as a strong supporter of Vietnamese films, we are dedicated to contributing to the development of the national film industry. Alongside international blockbusters, CineSTECH proudly partners with Vietnamese filmmakers to bring unique local cinematic works closer to the audience.
                                </p>
                            </div>
                            <div className="h-80 rounded-2xl overflow-hidden shadow-2xl">
                                <img src="https://source.unsplash.com/random/800x600?vietnam,film" alt="Film Production" className="w-full h-full object-cover" />
                            </div>
                        </section>

                        {/* Mission Section */}
                        <section>
                            <h2 className="text-3xl font-bold text-center mb-10">Our Mission</h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {missionData.map((item, index) => (
                                    <div key={index} className="bg-[#242b3d] p-8 rounded-2xl border border-white/10 text-center transform hover:-translate-y-2 transition-transform duration-300">
                                        <div className="w-16 h-16 bg-gradient-to-r from-[#fe7e32] to-[#648ddb] rounded-full flex items-center justify-center mx-auto mb-6">
                                            <item.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-gray-300">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Theaters Section */}
                        <section>
                            <h2 className="text-3xl font-bold text-center mb-10">Our Theaters</h2>
                            {branchesLoading ? (
                                <div className="text-center"><p>Loading theaters...</p></div>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {branches?.map((branch, index) => (
                                        <div key={branch.id} className="relative h-64 rounded-2xl overflow-hidden group shadow-lg border border-white/10">
                                            <img src={`https://source.unsplash.com/random/800x600?cinema,exterior&sig=${index}`} alt={branch.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="relative h-full flex flex-col justify-end p-6">
                                                <h3 className="font-bold text-lg text-white">{branch.name}</h3>
                                                <div className="flex items-start gap-2 mt-1 text-gray-300 text-sm">
                                                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                                    <span>{branch.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Headquarters Section */}
                        <section className="bg-[#242b3d] rounded-2xl border border-white/10 overflow-hidden">
                            <div className="grid md:grid-cols-2 items-center">
                                <div className="p-10">
                                    <h2 className="text-3xl font-bold">Our Headquarters</h2>
                                    <p className="text-gray-400 mt-2 mb-6">Get in touch with our main office.</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Phone className="w-5 h-5 text-[#fe7e32]" />
                                            <span>1900 0085</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Mail className="w-5 h-5 text-[#fe7e32]" />
                                            <span>cskh@cinestar.com.vn</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Building className="w-5 h-5 text-[#fe7e32]" />
                                            <span>135 Hai Ba Trung, Saigon, Ward Ben Nghe, District 1, HCMC</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-64 md:h-full">
                                    <img src="https://source.unsplash.com/random/800x600?modern,office" alt="Office Building" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}

export default AboutPage;
