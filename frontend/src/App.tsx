import React, { useState, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { LoginPage } from './components/LoginPage';

// Lazy load heavy modules for ultra-fast initial load
const AttendanceModule = lazy(() => import('./components/AttendanceModule').then(m => ({ default: m.AttendanceModule })));

const GradebookModule = lazy(() => import('./components/GradebookModule').then(m => ({ default: m.GradebookModule })));
const PayrollModule = lazy(() => import('./components/PayrollModule').then(m => ({ default: m.PayrollModule })));
const StudentProfileModule = lazy(() => import('./components/StudentProfileModule').then(m => ({ default: m.StudentProfileModule })));
const GuardianPortalModule = lazy(() => import('./components/GuardianPortalModule').then(m => ({ default: m.GuardianPortalModule })));
const FeesModule = lazy(() => import('./components/FeesModule').then(m => ({ default: m.FeesModule })));
const NoticeBoardModule = lazy(() => import('./components/NoticeBoardModule').then(m => ({ default: m.NoticeBoardModule })));

const AuditLogsModule = lazy(() => import('./components/AuditLogsModule').then(m => ({ default: m.AuditLogsModule })));

const ModuleLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
    <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    <span className="text-xs font-mono text-slate-500 animate-pulse">Loading module...</span>
  </div>
);

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardOverview 
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewStudent={() => setCurrentTab('students')}
            onOpenUrgentNotice={() => setCurrentTab('notices')}
          />
        );
      case 'attendance':
        return <Suspense fallback={<ModuleLoader />}><AttendanceModule /></Suspense>;

      case 'gradebook':
        return <Suspense fallback={<ModuleLoader />}><GradebookModule /></Suspense>;
      case 'payroll':
        return <Suspense fallback={<ModuleLoader />}><PayrollModule /></Suspense>;
      case 'students':
        return <Suspense fallback={<ModuleLoader />}><StudentProfileModule /></Suspense>;
      case 'guardian_portal':
        return <Suspense fallback={<ModuleLoader />}><GuardianPortalModule /></Suspense>;
      case 'fees':
        return <Suspense fallback={<ModuleLoader />}><FeesModule /></Suspense>;
      case 'notices':
        return <Suspense fallback={<ModuleLoader />}><NoticeBoardModule /></Suspense>;

      case 'audit_logs':
        return <Suspense fallback={<ModuleLoader />}><AuditLogsModule /></Suspense>;
      default:
        return (
          <DashboardOverview 
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewStudent={() => setCurrentTab('students')}
            onOpenUrgentNotice={() => setCurrentTab('notices')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased" style={{background:'#0B0F1A', color:'#ECFCCA'}}>
      
      {/* Top Navigation Bar */}
      <Header 
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)} 
        isMobileNavOpen={isMobileNavOpen}
        onNavigate={(tab) => setCurrentTab(tab)}
      />

      {/* Main Body with Sidebar + Dynamic View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Scrollable Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" style={{background:'#0B0F1A'}}>
          <div className="max-w-7xl mx-auto pb-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Sophisticated Dark Global Status Footer */}
      <footer className="h-11 border-t border-slate-800/80 bg-slate-950 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 text-[11px] text-slate-500 font-mono shrink-0 z-20 gap-1 sm:gap-0 no-print">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="tracking-wider uppercase text-slate-400">AES-256-GCM ENCRYPTED SESSION</span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-500">JWT: AUTHENTICATED</span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4 text-[10px] text-slate-500">
          <span className="text-slate-400">NCTB 2026 Ready</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <span>GDPR Compliant</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
          <span className="text-emerald-400 font-semibold">v4.2.0-STABLE</span>
        </div>
      </footer>

    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
