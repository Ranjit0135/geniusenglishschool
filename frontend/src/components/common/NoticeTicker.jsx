import React from 'react';

const NoticeTicker = () => {
    const notices = [
        "Admissions are open for Academic Session 2024-25!",
        "Parent-Teacher Meeting scheduled for next Saturday.",
        "New Robotics and Coding classes starting from next month.",
        "Congratulations to our students for winning the Inter-School Athletics Championship!"
    ];

    const joinedNotices = notices.join(" | ");

    return (
        <div className="bg-[#ff5e3a] py-2 overflow-hidden border-b border-white/10 relative z-20">
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(10%); }
                        100% { transform: translateX(-100%); }
                    }
                    .animate-marquee {
                        display: inline-block;
                        white-space: nowrap;
                        animation: marquee 100s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>
            <div className="container mx-auto  flex items-center">
                <div className="bg-white text-[#ff5e3a] px-3 py-1 rounded-sm font-bold text-xs uppercase tracking-widest mr-4 whitespace-nowrap z-10 shadow-sm">
                    Notice
                </div>
                <div className="relative flex overflow-x-hidden w-full items-center">
                    <div className="animate-marquee py-1">
                        <span className="text-white font-bold text-sm tracking-wide uppercase">
                            {joinedNotices} &nbsp;&nbsp; | &nbsp;&nbsp; {joinedNotices} &nbsp;&nbsp; | &nbsp;&nbsp;
                        </span>
                        <span className="text-white font-bold text-sm tracking-wide uppercase">
                            {joinedNotices} &nbsp;&nbsp; | &nbsp;&nbsp; {joinedNotices} &nbsp;&nbsp; | &nbsp;&nbsp;
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeTicker;
