import React, { useState } from 'react';
import {
  Shield, Lock, User as UserIcon, Eye, EyeOff, CheckCircle2,
  AlertCircle, ArrowRight, GraduationCap, Globe, Sparkles,
  School, KeyRound, Users, HelpCircle, Check, Info,
  FileText, Database, ShieldCheck, Landmark, Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { UserRole } from '../types';

interface DemoAccount {
  role: UserRole;
  titleEn: string;
  titleBn: string;
  username: string;
  nameEn: string;
  nameBn: string;
  badgeColor: string;
  avatar: string;
}

const demoAccounts: DemoAccount[] = [
  {
    role: 'super_admin',
    titleEn: 'Super Admin',
    titleBn: 'প্রধান প্রশাসক',
    username: 'superadmin',
    nameEn: 'Md. Zahirul Islam',
    nameBn: 'মোঃ জহিরুল ইসলাম',
    badgeColor: 'from-purple-500/20 to-purple-700/30 text-purple-300 border-purple-500/40',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'admin',
    titleEn: 'Principal / Headmaster',
    titleBn: 'প্রধান শিক্ষক ও অধ্যক্ষ',
    username: 'principal_anwar',
    nameEn: 'Prof. Md. Anwar Hossain',
    nameBn: 'অধ্যাপক মোঃ আনোয়ার হোসেন',
    badgeColor: 'from-emerald-500/20 to-emerald-700/30 text-emerald-300 border-emerald-500/40',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'teacher',
    titleEn: 'Senior Teacher',
    titleBn: 'সিনিয়র শিক্ষক',
    username: 'tariqul_math',
    nameEn: 'Md. Tariqul Islam',
    nameBn: 'মোঃ তারিকুল ইসলাম',
    badgeColor: 'from-blue-500/20 to-blue-700/30 text-blue-300 border-blue-500/40',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'staff',
    titleEn: 'Accounts Officer',
    titleBn: 'হিসাবরক্ষণ কর্মকর্তা',
    username: 'accounts.hasan',
    nameEn: 'Kamrul Hasan',
    nameBn: 'কামরুল হাসান',
    badgeColor: 'from-amber-500/20 to-amber-700/30 text-amber-300 border-amber-500/40',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'guardian',
    titleEn: 'Guardian / Parent',
    titleBn: 'অভিভাবক',
    username: 'guardian_rafiq',
    nameEn: 'Rafiqul Islam',
    nameBn: 'রফিকুল ইসলাম',
    badgeColor: 'from-teal-500/20 to-teal-700/30 text-teal-300 border-teal-500/40',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    role: 'student',
    titleEn: 'Student',
    titleBn: 'শিক্ষার্থী',
    username: 'student_sadia',
    nameEn: 'Sadia Sultana',
    nameBn: 'সাদিয়া সুলতানা',
    badgeColor: 'from-indigo-500/20 to-indigo-700/30 text-indigo-300 border-indigo-500/40',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
  }
];

export const LoginPage: React.FC = () => {
  const { login, lang, toggleLang } = useApp();
  const t = translations[lang];

  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSelectDemo = (acc: DemoAccount) => {
    setSelectedRole(acc.role);
    setUsername(acc.username);
    setPassword('admin123');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে ইউজারনেম বা মোবাইল নম্বর দিন।' : 'Please enter your username or phone number.');
      return;
    }
    if (!password) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড দিন।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await login(username, password, selectedRole);
      if (result.success) {
        setSuccessMsg(result.message || (lang === 'bn' ? 'লগইন সফল হয়েছে! রিডাইরেক্ট হচ্ছে...' : 'Login successful! Redirecting...'));
      } else {
        setErrorMsg(result.message || (lang === 'bn' ? 'ভুল ক্রেডেনশিয়াল!' : 'Invalid credentials!'));
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error occurred');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setIsLoading(true);
    setErrorMsg(null);
    const acc = demoAccounts.find(a => a.role === role);
    if (acc) {
      setUsername(acc.username);
      setSelectedRole(role);
      const res = await login(acc.username, 'admin123', role);
      if (!res.success) {
        setIsLoading(false);
        setErrorMsg(res.message || 'Quick login failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden font-sans">

      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Branding Bar */}
      <header className="px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                {lang === 'bn' ? 'বিডি স্কুল ম্যানেজমেন্ট সিস্টেম' : 'BD School Management System'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 uppercase">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {lang === 'bn' ? 'ঢাকা মডেল উচ্চ বিদ্যালয় ও কলেজ (EIIN: 108244)' : 'Dhaka Model High School & College (EIIN: 108244)'}
            </p>
          </div>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NCTB 2026 Ready</span>
          </div>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold border border-slate-800 transition"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Presentation Column */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>{lang === 'bn' ? 'স্মার্ট বাংলাদেশ এডুকেশন পোর্টাল' : 'Smart Bangladesh Education Portal'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {lang === 'bn' ? (
                <>আধুনিক ডিজিটাল বিদ্যালয় ব্যবস্থাপনা ও <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">স্মার্ট অ্যাকাউন্টিং</span></>
              ) : (
                <>Next-Generation Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">School Management</span></>
              )}
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'অনলাইন ও অফলাইন উভয় মাধ্যমে উপস্থিতি ট্র্যাকিং, এনসিটিবি গ্রেডবুক, শিক্ষার্থী প্রোফাইল ও শিক্ষক বেতন ব্যবস্থাপনা।'
                : 'Unified cloud ERP featuring real-time attendance tracking, NCTB GPA 5.0 gradebook, BDT teacher payroll, and 17-digit BDRIS encrypted dossiers.'}
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{lang === 'bn' ? 'স্মার্ট উপস্থিতি' : 'Smart Attendance'}</h4>
                  <p className="text-[11px] text-slate-400">{lang === 'bn' ? 'রিয়েলটাইম হাজিরা ট্র্যাকিং' : 'Real-time daily tracking'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{lang === 'bn' ? 'এনসিটিবি গ্রেডবুক' : 'NCTB Gradebook'}</h4>
                  <p className="text-[11px] text-slate-400">{lang === 'bn' ? 'জিপিএ ৫.০ ও প্রোগ্রেস কার্ড' : 'GPA 5.0 & Report cards'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{lang === 'bn' ? 'বেতন ও ফিস (BDT)' : 'Payroll & Accounts'}</h4>
                  <p className="text-[11px] text-slate-400">{lang === 'bn' ? 'বিকাশ / নগদ ও ইনভয়েস' : 'bKash/Nagad & Slips'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{lang === 'bn' ? 'নিরাপত্তা ও জিডিপিআর' : 'AES-256 Security'}</h4>
                  <p className="text-[11px] text-slate-400">{lang === 'bn' ? '১৭ ডিজিট জন্মনিবন্ধন এনক্রিপ্ট' : 'BDRIS Encrypted Storage'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Form Card */}
          <div className="lg:col-span-6 w-full">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">

              {/* Form Title & Subtitle */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {lang === 'bn' ? 'পোর্টাল সাইন ইন' : 'Portal Sign In'}
                  </h2>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {lang === 'bn' ? 'নিরাপদ সেশন' : 'Secure Session'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn'
                    ? 'আপনার ইউজার আইডি এবং পাসওয়ার্ড দিয়ে লগইন করুন।'
                    : 'Click any demo role below.'}
                </p>
              </div>

              {/* Quick-Select Demo Roles Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {lang === 'bn' ? ' টেস্ট লগইন অ্যাকাউন্ট নির্বাচন করুন' : ' Quick 1-Click Role Login'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Pass: admin123
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {demoAccounts.map((acc) => {
                    const isSelected = selectedRole === acc.role;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleSelectDemo(acc)}
                        className={`flex flex-col items-center p-2 rounded-xl transition border text-center relative ${isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-950'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        title={`Click to fill: ${acc.titleEn} (${acc.username})`}
                      >
                        <img
                          src={acc.avatar}
                          alt={acc.titleEn}
                          className="w-7 h-7 rounded-full object-cover mb-1 ring-1 ring-slate-700"
                        />
                        <span className="text-[10px] font-bold truncate max-w-full">
                          {lang === 'bn' ? acc.titleBn.split(' ')[0] : acc.titleEn.split(' ')[0]}
                        </span>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error & Success Alerts */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <div className="flex-1 font-medium">{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div className="flex-1 font-medium">{successMsg}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Username / Phone / Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {lang === 'bn' ? 'ইউজারনেম / ফোন নম্বর / ইমেইল' : 'Username / Phone / Email'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={lang === 'bn' ? 'যেমন: superadmin বা 01700000001' : 'e.g. superadmin or 01700000001'}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white text-sm placeholder-slate-500 transition font-medium"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition"
                    >
                      {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white text-sm placeholder-slate-500 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500"
                    />
                    <span className="text-xs text-slate-400 font-medium">
                      {lang === 'bn' ? 'সেশন মনে রাখুন' : 'Remember my session'}
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    256-Bit SSL
                  </span>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gray-500 hover:bg-gray-600 hover:from-gray-500 hover:to-gray-600 text-white font-bold text-sm shadow-lg shadow-gray-500/60 hover:shadow-gray-600/40 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{lang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Authenticating...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{lang === 'bn' ? 'পোর্টাল প্রবেশ করুন' : 'Sign In to Portal'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Quick Super Admin Login */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('super_admin')}
                    className="text-xs text-slate-400 hover:text-emerald-400 transition font-medium inline-flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'bn' ? '১-ক্লিকে সুপার অ্যাডমিন ড্যাশবোর্ডে যান' : '1-Click Direct Super Admin Access →'}</span>
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                {lang === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার নির্দেশিকা' : 'Password Recovery Assistance'}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {lang === 'bn'
                ? 'বিদ্যালয়ের নিরাপত্তা বিধিমালার কারণে স্বয়ংক্রিয় পাসওয়ার্ড পরিবর্তন নিয়ন্ত্রিত। অনুগ্রহ করে বিদ্যালয় প্রধান শিক্ষক অথবা সিস্টেম অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।'
                : 'For institutional safety, student & faculty credentials are reset centrally by the Headmaster or School IT Administrator.'}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-400 mb-5">
              <p><strong className="text-slate-200">Default Super Admin:</strong> `superadmin` / `admin123`</p>
              <p><strong className="text-slate-200">Default Principal:</strong> `principal_anwar` / `admin123`</p>
              <p><strong className="text-slate-200">School IT Desk:</strong> +880 1700-000001 (Dhaka)</p>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              {lang === 'bn' ? 'বুঝেছি, বন্ধ করুন' : 'Got it, Close'}
            </button>
          </div>
        </div>
      )}

      {/* Global Status Footer */}
      <footer className="px-4 sm:px-8 py-3 border-t border-slate-800/80 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono z-10 gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Bangladesh School System</span>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span>EIIN: 108244</span>
          <span>•</span>
          <span>BDRIS AES-256 Compliant</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">{new Date().getFullYear()} Production</span>
        </div>
      </footer>

    </div>
  );
};
