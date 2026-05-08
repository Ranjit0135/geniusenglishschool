import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../redux/authSlice';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    CheckCircle2,
    Shield,
    Loader2
} from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, school } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
    });

    useEffect(() => {
        if (isAuthenticated) {
            if (school?.is_approved) {
                navigate('/school-admin');
            } else {
                navigate('/dashboard');
            }
        }

        // Clear errors and messages when entering the page
        dispatch(clearError());

        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side Validation
        if (!formData.name.trim()) {
            alert('Please enter your Institution Name');
            return;
        }
        if (formData.name.length < 3) {
            alert('Institution Name must be at least 3 characters');
            return;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Please enter a valid email address');
            return;
        }
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        if (!formData.agree) {
            alert('Please agree to the terms and conditions');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const result = await dispatch(signup({
            institutionName: formData.name,
            email: formData.email,
            password: formData.password
        }));

        if (signup.fulfilled.match(result)) {
            navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl opacity-50"></div>

            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] overflow-hidden relative z-10 border border-slate-100">

                {/* Visual Side (Hidden on mobile) */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-indigo-600 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 mb-16">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-indigo-600 text-xl font-black italic">G</span>
                            </div>
                            <span className="text-xl font-black tracking-tight italic uppercase">Genius School</span>
                        </Link>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-black leading-tight italic uppercase tracking-tight">
                                Start Your School's Digital Revolution Today.
                            </h2>
                            <p className="text-indigo-100 font-medium italic text-lg opacity-80">
                                Join hundreds of institutions using Genius School to scale their operations.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4 py-4 px-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
                            <CheckCircle2 className="text-indigo-300 w-6 h-6" />
                            <span className="font-bold text-sm italic">Enterprise-grade security included</span>
                        </div>
                        <div className="flex items-center gap-4 py-4 px-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5">
                            <Shield className="text-indigo-300 w-6 h-6" />
                            <span className="font-bold text-sm italic">GDPR & Student Privacy Compliant</span>
                        </div>
                    </div>

                    {/* Decorative Blobs */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 -left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>
                </div>

                {/* Form Side */}
                <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-center">
                    <div className="mb-10 flex flex-col items-center lg:items-start">
                        <h1 className="text-3xl font-black text-slate-900 italic uppercase mb-2">
                            Create Account
                        </h1>
                        <p className="text-slate-500 font-bold italic text-sm">
                            Already have an account?
                            <Link
                                to="/login"
                                className="ml-2 text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4"
                            >
                                Login
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold italic flex items-center gap-3">
                            <Shield className="w-5 h-5 text-rose-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Institution Name</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Genius International"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl text-slate-900 font-bold italic placeholder:text-slate-300 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="admin@school.com"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl text-slate-900 font-bold italic placeholder:text-slate-300 outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl text-slate-900 font-bold italic placeholder:text-slate-300 outline-none transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl text-slate-900 font-bold italic placeholder:text-slate-300 outline-none transition-all"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pl-2">
                            <input
                                type="checkbox"
                                id="agree"
                                className="mt-1 w-4 h-4 rounded border-2 border-slate-200 text-indigo-600 focus:ring-indigo-600"
                                checked={formData.agree}
                                onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                            />
                            <label htmlFor="agree" className="text-xs font-bold text-slate-500 leading-tight italic">
                                I agree to the <span className="text-indigo-600">Terms of Service</span> and <span className="text-indigo-600">Privacy Policy</span>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
