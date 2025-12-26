import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, guestLogin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const handleGuest = () => {
    guestLogin();
    navigate('/');
  }

  const fillUserCredentials = () => {
      setEmail('alex@nexus.com');
      setPassword('password');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="p-8 bg-blue-600 text-center relative overflow-hidden">
           <div className="relative z-10">
               <h1 className="text-3xl font-bold text-white mb-2">BinhMinhWL</h1>
               <p className="text-blue-100">Kết nối - Chia sẻ - AI thông minh</p>
           </div>
           {/* Abstract Decoration */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Form */}
        <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                            placeholder="email@example.com"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Mật khẩu</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                >
                    {isLoading ? <span>Đang xử lý...</span> : <span>Đăng Nhập</span>}
                    {!isLoading && <ChevronRight className="w-4 h-4" />}
                </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                <span className="px-2">hoặc truy cập với vai trò</span>
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            </div>

            <div className="mt-6 space-y-3">
                <button onClick={handleGuest} className="w-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Khách (Guest)</span>
                </button>
            </div>

            {/* Quick Fill for Demo - Removed Admin Quick Login */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-center text-xs text-slate-400 mb-3">Thông tin đăng nhập (Test)</p>
                <div className="flex space-x-3">
                    <button onClick={fillUserCredentials} className="w-full py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600">
                        User Demo (Thành viên)
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;