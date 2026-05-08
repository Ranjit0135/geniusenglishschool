import React from 'react';
import {
    ChevronRight,
    Search,
    User,
    Calendar,
    MoreHorizontal
} from 'lucide-react';

// Mock Data for Notice Board
const notices = [
    {
        date: '16 June, 2019',
        color: '#3db2d5', // Light Blue
        text: 'Great School Great School manag mene esom text of the printing Great School manag mene esom text of the printing manag mene esom text of the printing.',
        author: 'Jennyfar Lopez',
        time: '5 min ago'
    },
    {
        date: '16 June, 2019',
        color: '#ffa001', // Orange
        text: 'Great School Great School manag mene esom text of the printing Great School manag mene esom text of the printing manag mene esom text of the printing.',
        author: 'Jennyfar Lopez',
        time: '5 min ago'
    },
    {
        date: '16 June, 2019',
        color: '#ff007c', // Pink/Red
        text: 'Great School Great School manag mene esom text of the printing Great School manag mene esom text of the printing manag mene esom text of the printing.',
        author: 'Jennyfar Lopez',
        time: '5 min ago'
    },
    {
        date: '16 June, 2019',
        color: '#3db2d5', // Light Blue
        text: 'Great School Great School manag mene esom text of the printing Great School manag mene esom text of the printing manag mene esom text of the printing.',
        author: 'Jennyfar Lopez',
        time: '5 min ago'
    },
];

const Notice = () => {
    return (
        <div className="space-y-8 pb-10">
            {/* Page Title & Breadcrumb */}
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-800">Notice Board</h2>
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-gray-400">Home</span>
                    <ChevronRight size={14} className="text-gray-300" />
                    <span className="text-[#ff9d01]">Notice</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Create A Notice Form */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-800">Create A Notice</h3>
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
                                <label className="text-sm font-bold text-gray-600">Details</label>
                                <textarea
                                    className="w-full bg-[#f8f9fa] border-none rounded-lg px-4 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff9d01]/20 min-h-[120px] resize-none transition-all"
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Posted By</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-[#f8f9fa] border-none rounded-lg px-4 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff9d01]/20 transition-all"
                                    />
                                    <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Date</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        className="w-full bg-[#f8f9fa] border-none rounded-lg px-4 py-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff9d01]/20 transition-all"
                                    />
                                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-[#ff9d01] text-white font-bold rounded-lg px-10 py-4 hover:bg-[#e68a00] transition-all uppercase tracking-widest text-sm shadow-xl shadow-[#ff9d01]/30 active:scale-95 translate-y-0 hover:-translate-y-1"
                                >
                                    Save
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

                {/* Right Column: Notice Board List */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-50 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-800">Notice Board</h3>
                            <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <input
                                type="text"
                                placeholder="Search by Date ..."
                                className="flex-1 bg-[#f8f9fa] border-none rounded-lg px-4 py-4 text-sm font-bold text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff9d01]/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Search by Title ..."
                                className="flex-1 bg-[#f8f9fa] border-none rounded-lg px-4 py-4 text-sm font-bold text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff9d01]/20 transition-all"
                            />
                            <button className="bg-[#ff9d01] text-white font-bold rounded-lg px-10 py-4 hover:bg-[#e68a00] transition-all uppercase tracking-widest text-sm shadow-xl shadow-[#ff9d01]/30 active:scale-95 translate-y-0 hover:-translate-y-1">
                                SEARCH
                            </button>
                        </div>

                        {/* Notices List */}
                        <div className="space-y-8">
                            {notices.map((notice, idx) => (
                                <div key={idx} className="space-y-3 border-b border-gray-50 pb-8 last:border-0 last:pb-0">
                                    <span
                                        className="px-4 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm inline-block tracking-wide"
                                        style={{ backgroundColor: notice.color }}
                                    >
                                        {notice.date}
                                    </span>
                                    <div>
                                        <h5 className="text-[15px] font-bold text-gray-700 leading-relaxed mb-2 hover:text-[#ff9d01] cursor-pointer transition-colors">
                                            {notice.text}
                                        </h5>
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                            {notice.author} <span className="opacity-50">/ {notice.time}</span>
                                        </div>
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

export default Notice;
