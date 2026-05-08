import { useState } from 'react';
import api from '../api';
import { Lock, Mail, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
        } catch (err) {
            setError(err.response?.data?.message || 'The credentials you entered do not match our records.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="w-full max-w-[480px] animate-in fade-in zoom-in duration-1000">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-primary/5 mb-6 ring-1 ring-slate-100 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                        <h1 className="text-3xl font-black text-primary italic tracking-tighter relative">
                            GENIUS <span className="text-secondary not-italic ml-1">ADMIN</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium tracking-tight">Access the central command for Genius English School</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[3rem] p-10 lg:p-14 shadow-[0_32px_128px_-16px_rgba(25,47,89,0.15)] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>

                    <div className="mb-10">
                        <h2 className="text-2xl font-black text-primary mb-2">Welcome Back</h2>
                        <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={16} className="text-secondary" /> Secured Environment
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[13px] font-bold text-center animate-in shake duration-500">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Administrator Email</label>
                                <div className="relative group/input">
                                    <Mail size={18} className="text-slate-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@genius.edu.np"
                                        className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-primary placeholder:text-slate-300 focus:bg-white focus:border-primary transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Private Key (Password)</label>
                                <div className="relative group/input">
                                    <Lock size={18} className="text-slate-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-primary placeholder:text-slate-300 focus:bg-white focus:border-primary transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:bg-secondary hover:shadow-secondary/20 transition-all active:scale-95 flex items-center justify-center gap-4 group/btn"
                        >
                            {isLoading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Enter Control Panel</span>
                                    <Sparkles size={16} className="text-accent group-hover:scale-125 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                            System Restricted Access &copy; {new Date().getFullYear()} Genius English School
                        </p>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-10 flex justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <a href="#" className="hover:text-primary transition-colors">Security Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Technical Support</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
