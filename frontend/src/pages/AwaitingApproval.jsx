import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import {
    Clock,
    ShieldCheck,
    ExternalLink,
    LogOut,
    CheckCircle2,
    Calendar,
    Globe,
    Edit
} from 'lucide-react';

const AwaitingApproval = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, school } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden relative z-10 border border-slate-100"
            >
                {/* Header Status Bar */}
                <div className="bg-amber-500 px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Clock size={16} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Application Pending Review</span>
                    </div>
                    <div className="flex items-center gap-4">

                        <div className="w-px h-4 bg-white/20"></div>
                        <button
                            onClick={handleLogout}
                            className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline">Logout</span>
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>

                <div className="p-10 md:p-14 text-center">
                    <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 text-indigo-600 relative">
                        <ShieldCheck size={40} />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center">
                            <Clock size={12} className="text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-slate-900 italic uppercase mb-4 tracking-tighter">
                        Verification in Progress
                    </h1>

                    <p className="text-slate-500 font-bold italic text-lg mb-10 max-w-md mx-auto leading-relaxed">
                        Hey <span className="text-indigo-600">{user?.name}</span>, your school setup for <span className="text-indigo-600">"{school?.name}"</span> is complete! We're now reviewing your details.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left uppercase italic font-black text-[10px] tracking-widest">
                        <div className="p-6 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                            <Globe className="text-indigo-600" size={24} />
                            <div>
                                <p className="text-slate-400 mb-1">Subdomain</p>
                                <p className="text-slate-900 text-xs">{school?.subdomain || 'pending'}.geniusschool.com</p>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                            <Calendar className="text-indigo-600" size={24} />
                            <div>
                                <p className="text-slate-400 mb-1">Applied On</p>
                                <p className="text-slate-900 text-xs">{new Date(school?.updatedAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700">
                            <CheckCircle2 className="flex-shrink-0" />
                            <p className="text-xs font-bold text-left italic">
                                Your school website is being staged on our servers. You'll receive an email as soon as it's public!
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href={`http://${school?.subdomain || 'demo'}.localhost:5173`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-5 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Preview Website
                                <ExternalLink size={16} />
                            </a>
                            <button
                                onClick={() => navigate('/dashboard/setup/template')}
                                className="flex-1 py-5 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >

                                Edit Application
                                <Edit size={14} />

                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-8 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Need help? Contact <span className="text-indigo-600">support@geniusschool.com</span>
                    </p>
                </div>
            </motion.div>
        </div >
    );
};

export default AwaitingApproval;
