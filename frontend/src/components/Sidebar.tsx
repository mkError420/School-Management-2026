import React from 'react';
import { 
  LayoutDashboard, UserCheck, Award, CreditCard, 
  Users, Receipt, Bell, ShieldCheck, Database, 
  HeartHandshake, History
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits } from '../translations';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { currentUser, lang, notices } = useApp();
  const t = translations[lang];

  // Role permissions check
  const role = currentUser.role;

  const navItems = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: LayoutDashboard,
      allowedRoles: ['super_admin', 'admin', 'teacher', 'staff', 'guardian', 'student']
    },
    {
      id: 'attendance',
      label: t.navAttendance,
      icon: UserCheck,
      allowedRoles: ['super_admin', 'admin', 'teacher']
    },
    {
      id: 'gradebook',
      label: t.navGradebook,
      icon: Award,
      allowedRoles: ['super_admin', 'admin', 'teacher', 'guardian', 'student']
    },
    {
      id: 'payroll',
      label: t.navPayroll,
      icon: CreditCard,
      allowedRoles: ['super_admin', 'admin', 'staff']
    },
    {
      id: 'students',
      label: t.navStudents,
      icon: Users,
      allowedRoles: ['super_admin', 'admin', 'teacher', 'staff']
    },
    {
      id: 'fees',
      label: t.navFees,
      icon: Receipt,
      allowedRoles: ['super_admin', 'admin', 'staff', 'guardian']
    },
    {
      id: 'guardian_portal',
      label: t.navGuardianPortal,
      icon: HeartHandshake,
      allowedRoles: ['super_admin', 'admin', 'guardian', 'student']
    },
    {
      id: 'notices',
      label: t.navNotices,
      icon: Bell,
      badge: String(notices.length),
      allowedRoles: ['super_admin', 'admin', 'teacher', 'staff', 'guardian', 'student']
    },
    {
      id: 'audit_logs',
      label: t.navAuditLogs,
      icon: History,
      allowedRoles: ['super_admin', 'admin']
    }
  ];

  const visibleItems = navItems.filter(item => item.allowedRoles.includes(role));

  const content = (
    <div className="flex flex-col h-full w-64 select-none" style={{background:'#0B0F1A', borderRight:'1px solid #263450', color:'#ECFCCA'}}>
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between" style={{borderBottom:'1px solid #263450'}}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-md" style={{background:'#FEE685', color:'#0B0F1A', border:'1px solid rgba(254,230,133,0.4)'}}>
            S
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight" style={{color:'#FEE685'}}>
              {lang === 'bn' ? "স্কুল ম্যানেজমেন্ট" : "School Management"}
            </h2>
            <p className="text-[10px] font-medium" style={{color:'#90A1B9'}}>
              {lang === 'bn' ? "এনসিটিবি পাঠ্যক্রম" : "NCTB System"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider px-3 pb-2" style={{color:'#90A1B9'}}>
          {lang === 'bn' ? "মূল মেনু" : "Main Navigation"}
        </div>
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              style={isActive ? {
                background:'rgba(254,230,133,0.12)',
                color:'#FEE685',
                borderLeft:'2px solid #FEE685',
                paddingLeft:'10px'
              } : {
                color:'#90A1B9'
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                {isActive && <div className="w-1.5 h-1.5 rounded-full" style={{background:'#FEE685'}}></div>}
                {!isActive && <Icon className="w-4 h-4" style={{color:'#90A1B9'}} />}
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={isActive ? {background:'rgba(254,230,133,0.15)', color:'#FEE685', border:'1px solid rgba(254,230,133,0.3)'} : {background:'#1A2235', color:'#90A1B9'}}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Security Badge */}
      <div className="p-3 m-3 rounded-xl text-xs" style={{background:'rgba(254,230,133,0.05)', border:'1px solid rgba(254,230,133,0.15)'}}>
        <div className="flex items-center gap-2 font-bold mb-1 text-[11px]" style={{color:'#FEE685'}}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? "নিরাপত্তা ও এনক্রিপশন" : "AES-256 Encrypted"}</span>
        </div>
        <p className="text-[10px] leading-snug" style={{color:'#90A1B9'}}>
          {lang === 'bn' 
            ? "সকল শিক্ষার্থী তথ্য অডিট ট্রেইল ও জিডিপিআর সুরক্ষিত।" 
            : "Protected with immutable audit logs and GDPR standards."}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-20 no-print">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex no-print">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
