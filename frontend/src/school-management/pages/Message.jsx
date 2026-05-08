import React from 'react';
import {
    ChevronRight,
    Search,
    User,
    MoreHorizontal,
    Send
} from 'lucide-react';

const Message = () => {
    return (
        <div className="space-y-8 pb-10">
            {/* Page Title & Breadcrumb */}
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-800">New Message</h2>
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-gray-400">Home</span>
                    <ChevronRight size={14} className="text-gray-300" />
                    <span className="text-[#ff9d01]">Message</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Write New Message */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-800">Write New Message</h3>
                            <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#f8f9fa] border-none rounded-lg px-4 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff9d01]/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Recipient</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search Student, Teacher or Parent..."
                                        className="w-full bg-[#f8f9fa] border-none rounded-lg px-4 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff9d01]/20 transition-all pl-12"
                                    />
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Message</label>
                                <textarea
                                    className="w-full bg-[#f8f9fa] border-none rounded-lg px-4 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff9d01]/20 min-h-[250px] resize-none transition-all"
                                ></textarea>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-[#ff9d01] text-white font-bold rounded-lg px-10 py-4 hover:bg-[#e68a00] transition-all uppercase tracking-widest text-sm shadow-xl shadow-[#ff9d01]/30 active:scale-95 translate-y-0 hover:-translate-y-1 flex items-center gap-2"
                                >
                                    <Send size={16} />
                                    Send Message
                                </button>
                                <button
                                    type="button"
                                    className="bg-[#001731] text-white font-bold rounded-lg px-10 py-4 hover:bg-[#00254d] transition-all uppercase tracking-widest text-sm shadow-xl shadow-[#001731]/30 active:scale-95 translate-y-0 hover:-translate-y-1"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Recent Messages (Optional / Placeholder) */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col h-full max-h-[600px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-800">Successful Message</h3>
                            <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 overflow-y-auto no-scrollbar">
                            {[1, 2, 3, 4, 5].map((item, idx) => (
                                <div key={idx} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="text-sm font-bold text-gray-700">Jessia Rose</h5>
                                        <p className="text-xs text-gray-400 line-clamp-1">Hi, I need your help with...</p>
                                        <span className="text-[10px] font-bold text-[#ff9d01]">10 Min ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
