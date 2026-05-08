import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, resendOtp, clearError } from '../redux/authSlice';
import {
    KeyRound,
    ArrowRight,
    Loader2,
    Mail,
    ArrowLeft,
    CheckCircle2,
    Shield
} from 'lucide-react';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [resendSuccess, setResendSuccess] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const emailParam = query.get('email');
        if (!emailParam) {
            navigate('/signup');
        } else {
            setEmail(emailParam);
        }

        return () => {
            dispatch(clearError());
        };
    }, [location.search, navigate, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(verifyOtp({ email, otp }));
        if (verifyOtp.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    const handleResend = async () => {
        const result = await dispatch(resendOtp({ email }));
        if (resendOtp.fulfilled.match(result)) {
            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Aesthetic */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl opacity-50"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[500px] bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] p-8 md:p-12 relative z-10 border border-slate-100"
            >
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                        <KeyRound className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 italic uppercase mb-2">Verify Identity</h1>
                    <p className="text-slate-500 font-bold italic text-sm max-w-[300px]">
                        We've sent a 6-digit verification code to
                        <br />
                        <span className="text-indigo-600 underline decoration-2 underline-offset-4">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold italic flex items-center gap-3">
                        <Shield className="w-5 h-5 text-rose-600" />
                        <span>{error}</span>
                    </div>
                )}

                {resendSuccess && (
                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-bold italic flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>A new verification code has been sent!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-3 block">Enter Verification Code</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                className="w-full py-6 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[24px] text-4xl font-black italic tracking-[0.5em] placeholder:text-slate-200 outline-none transition-all text-center"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Activate Account
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <div className="flex flex-col gap-4 items-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={loading}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : "Didn't get the code? Resend"}
                        </button>

                        <button
                            onClick={() => navigate('/signup')}
                            className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign Up
                        </button>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-bold text-slate-400 italic">
                        By proceeding, you agree to our Terms of Service.
                        <br />
                        © 2026 Genius School Platform.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOtp;
