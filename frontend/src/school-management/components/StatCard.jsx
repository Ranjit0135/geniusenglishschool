import React from 'react';

const StatCard = ({ icon: Icon, label, value, color, iconBg }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-sm`} style={{ backgroundColor: iconBg }}>
                    <Icon size={28} className="text-white" style={{ color: color }} />
                </div>
                <div>
                    <p className="text-[14px] font-bold text-gray-400 capitalize mb-1">{label}</p>
                    <h4 className="text-2xl font-bold text-gray-800 leading-none">{value}</h4>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
