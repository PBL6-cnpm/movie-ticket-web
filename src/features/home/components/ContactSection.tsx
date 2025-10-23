import { Send } from 'lucide-react'
import React from 'react'

const ContactSection: React.FC = () => {
    return (
        <div className="py-16 lg:py-20 bg-[#1a2232]/50">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white">Contact Us</h2>
                    <p className="text-gray-400 mt-2">Have a question or feedback? We'd love to hear from you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Contact Form */}
                    <div className="bg-[#242b3d] p-8 rounded-2xl shadow-lg border border-white/10">
                        <form>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                <input type="text" placeholder="Your Name" className="w-full bg-[#1a2232] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fe7e32]" />
                                <input type="email" placeholder="Your Email" className="w-full bg-[#1a2232] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fe7e32]" />
                            </div>
                            <textarea placeholder="Your Message" rows={5} className="w-full bg-[#1a2232] border border-gray-700 rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:ring-2 focus:ring-[#fe7e32]"></textarea>
                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#fe7e32] to-[#648ddb] text-white font-bold py-3 rounded-lg hover:scale-105 transition-transform duration-300">
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 text-gray-300">
                        <div className="p-6 bg-[#242b3d] rounded-2xl border border-white/10">
                            <h3 className="font-bold text-white text-lg mb-2">Address</h3>
                            <p>470 Tran Dai Nghia, Ngu Hanh Son, Da Nang</p>
                        </div>
                        <div className="p-6 bg-[#242b3d] rounded-2xl border border-white/10">
                            <h3 className="font-bold text-white text-lg mb-2">Email</h3>
                            <p>support@cinestech.me</p>
                        </div>
                        <div className="p-6 bg-[#242b3d] rounded-2xl border border-white/10">
                            <h3 className="font-bold text-white text-lg mb-2">Phone</h3>
                            <p>(+84) 123 456 789</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactSection
