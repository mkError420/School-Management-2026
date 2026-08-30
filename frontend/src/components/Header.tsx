import React, { useState } from 'react';
import { 
  Globe, Shield, Bell, Wifi, WifiOff, RefreshCw, 
  LogOut, UserCheck, ChevronDown, CheckCircle2,
  BookOpen, AlertTriangle, Download,
  Menu, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits } from '../translations';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenRoleModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenNotice?: () => void;
  onNavigate?: (tab: string) => void;
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenRoleModal = () => {}, 
  onOpenAuthModal = () => {}, 
  onOpenNotice = () => {},
  onNavigate = (_tab: string) => {},
  onToggleMobileNav = () => {},
  isMobileNavOpen = false
}) => {
  const { 
    currentUser, 
    lang, 
    toggleLang, 
    isOffline, 
    toggleOfflineMode, 
    offlineQueue, 
    syncOfflineQueue, 
    notices,
    logout 
  } = useApp();

  const t = translations[lang];
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const roleColors: Record<UserRole, string> = {
    super_admin: "bg-purple-950/80 text-purple-300 border-purple-800/80",
    admin: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
    teacher: "bg-blue-950/80 text-blue-300 border-blue-800/80",
    staff: "bg-amber-950/80 text-amber-300 border-amber-800/80",
    guardian: "bg-teal-950/80 text-teal-300 border-teal-800/80",
    student: "bg-indigo-950/80 text-indigo-300 border-indigo-800/80"
  };

  const roleLabels: Record<UserRole, string> = {
    super_admin: t.roleSuperAdmin,
    admin: t.roleAdmin,
    teacher: t.roleTeacher,
    staff: t.roleStaff,
    guardian: t.roleGuardian,
    student: t.roleStudent
  };

  const unreadNotices = notices.filter(n => n.priority === 'urgent' || n.priority === 'high');

  return (
    <header style={{background:'#0B0F1A', borderBottom:'1px solid #263450'}} className="sticky top-0 z-30 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* ── Hamburger / Close (mobile only) ── */}
          <div className="flex items-center gap-3 cursor-pointer">
            <button
              onClick={onToggleMobileNav}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition"
              style={{background: isMobileNavOpen ? 'rgba(254,230,133,0.15)' : 'rgba(255,255,255,0.05)', border:'1px solid #263450', color:'#FEE685'}}
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />}
            </button>

            {/* School Brand & EIIN */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg" style={{background:'linear-gradient(135deg, #FEE685 0%, #D4B800 100%)', border:'1px solid rgba(254,230,133,0.4)'}}>
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black tracking-tight leading-none" style={{color:'#0B0F1A'}}>SM</span>
                  <span className="text-[10px] font-bold leading-none mt-0.5" style={{color:'#0B0F1A'}}>ERP</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight" style={{color:'#FEE685'}}>
                    {lang === 'bn' ? t.appName : "School Management"}
                  </h1>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium" style={{background:'rgba(254,230,133,0.08)', color:'#FEE685', border:'1px solid rgba(254,230,133,0.25)'}}>
                    {t.institutionEIIN}
                  </span>
                </div>
                <p className="text-xs hidden sm:block" style={{color:'#90A1B9'}}>
                  {lang === 'bn' ? t.institutionNameBangla : t.institutionName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            


            {/* Offline Sync Mode Switcher */}
            <div className="flex items-center">
              <button
                onClick={toggleOfflineMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                style={isOffline 
                  ? {background:'rgba(217,119,6,0.15)', color:'#FCD34D', border:'1px solid rgba(217,119,6,0.4)'} 
                  : {background:'rgba(254,230,133,0.08)', color:'#FEE685', border:'1px solid rgba(254,230,133,0.25)'}}
                title={isOffline ? "Click to connect to online network" : "Click to test offline rural synchronization mode"}
              >
                {isOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 animate-pulse" style={{color:'#FCD34D'}} />
                    <span className="hidden sm:inline">{t.offline}</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5" style={{color:'#FEE685'}} />
                    <span className="hidden sm:inline">{t.online}</span>
                  </>
                )}
              </button>

              {/* Pending Sync Queue Button */}
              {offlineQueue.length > 0 && (
                <button
                  onClick={syncOfflineQueue}
                  className="ml-1.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition animate-bounce shadow-md"
                  title="Sync local cached data to Central Database"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>
                    {lang === 'bn' ? toBanglaDigits(offlineQueue.length) : offlineQueue.length} {t.syncNow}
                  </span>
                </button>
              )}
            </div>



            {/* Language Toggle (বাংলা / English) */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition"
              title="Toggle Bengali / English"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Notice / Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotices.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-slate-950"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{t.urgentNotices}</span>
                    <span className="text-xs bg-red-950/80 text-red-300 border border-red-800/80 font-semibold px-2 py-0.5 rounded-full">
                      {unreadNotices.length} {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                    {notices.map((notice) => (
                      <div 
                        key={notice.id} 
                        onClick={() => { setShowNotifications(false); onNavigate('notices'); }}
                        className="p-3 hover:bg-slate-800/50 cursor-pointer transition"
                      >
                        <div className="flex items-start gap-2">
                          {notice.priority === 'urgent' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-200 truncate">
                              {lang === 'bn' ? notice.titleBangla : notice.titleEnglish}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                              {lang === 'bn' ? notice.contentBangla : notice.contentEnglish}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                              <span>{notice.publishedDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-slate-800 text-center">
                    <button 
                      onClick={() => { setShowNotifications(false); onNavigate('notices'); }}
                      className="text-xs text-emerald-400 font-bold hover:underline"
                    >
                      {t.viewAll} {t.navNotices} →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill & Current User */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition"
              >
                <img 
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                    {lang === 'bn' ? currentUser.nameBangla : currentUser.name}
                  </p>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold border ${roleColors[currentUser.role]}`}>
                    {roleLabels[currentUser.role]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-white truncate">
                      {lang === 'bn' ? currentUser.nameBangla : currentUser.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email || currentUser.phone}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold border ${roleColors[currentUser.role]}`}>
                      {roleLabels[currentUser.role]}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => { setShowUserMenu(false); onOpenRoleModal(); }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-emerald-400 hover:bg-slate-800/60 flex items-center gap-2 transition"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>{t.switchRole}</span>
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); onOpenAuthModal(); }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-300 hover:bg-slate-800/60 flex items-center gap-2 transition"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>Sign in with another account</span>
                    </button>

                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => { setShowUserMenu(false); logout(); }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-950/40 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
