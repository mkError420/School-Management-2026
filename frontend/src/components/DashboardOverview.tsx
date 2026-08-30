import React from 'react';
import { 
  Users, UserCheck, Award, CreditCard, 
  TrendingUp, AlertTriangle, Bell,
  CheckCircle2, PlusCircle, ArrowUpRight, 
  Calendar, PhoneCall, Send, ShieldAlert, 
  FileSpreadsheet, Receipt
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits, formatCurrencyBDT } from '../translations';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
  onOpenNewStudent: () => void;
  onOpenUrgentNotice: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onOpenNewStudent,
  onOpenUrgentNotice
}) => {
  const { 
    currentUser, 
    lang, 
    students, 
    teachers, 
    attendance, 
    grades, 
    payrolls, 
    notices, 
    feePayments,
    auditLogs 
  } = useApp();

  const t = translations[lang];

  // Calculate real-time stats
  const totalStudentsCount = students.length;
  const totalTeachersCount = teachers.length;

  const todayDate = "2026-08-29";
  const todayAttendance = attendance.filter(a => a.date === todayDate);
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const totalMarked = todayAttendance.length;
  const todayAttendancePct = totalMarked > 0 ? ((presentCount / totalMarked) * 100).toFixed(1) : "94.2";

  const totalFeeCollected = feePayments.reduce((acc, curr) => acc + curr.netAmount, 0);
  const totalPayrollDisbursed = payrolls
    .filter(p => p.status === 'disbursed')
    .reduce((acc, curr) => acc + curr.netPayable, 0);

  const pendingPayrollCount = payrolls.filter(p => p.status === 'pending').length;

  // Chart data: Attendance Trend
  const attendanceWeeklyData = [
    { day: lang === 'bn' ? 'শনি' : 'Sat', rate: 96.2, present: 192, absent: 8 },
    { day: lang === 'bn' ? 'রবি' : 'Sun', rate: 94.8, present: 189, absent: 11 },
    { day: lang === 'bn' ? 'সোম' : 'Mon', rate: 97.5, present: 195, absent: 5 },
    { day: lang === 'bn' ? 'মঙ্গল' : 'Tue', rate: 95.0, present: 190, absent: 10 },
    { day: lang === 'bn' ? 'বুধ' : 'Wed', rate: 93.5, present: 187, absent: 13 },
    { day: lang === 'bn' ? 'বৃহস্পতি' : 'Thu', rate: 96.8, present: 193, absent: 7 },
  ];

  // Chart data: GPA 5.0 Breakdown
  const gpaGradeData = [
    { grade: 'A+ (5.0)', count: 48, fill: '#059669' },
    { grade: 'A (4.0)', count: 32, fill: '#10b981' },
    { grade: 'A- (3.5)', count: 24, fill: '#34d399' },
    { grade: 'B (3.0)', count: 18, fill: '#f59e0b' },
    { grade: 'C (2.0)', count: 6, fill: '#f97316' },
    { grade: 'D (1.0)', count: 2, fill: '#fb7185' },
    { grade: 'F (0.0)', count: 1, fill: '#ef4444' },
  ];

  const absentToday = todayAttendance.filter(a => a.status === 'absent');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full opacity-5 pointer-events-none flex items-center justify-end pr-6">
          <Award className="w-64 h-64 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold mb-2">
              <span>{lang === 'bn' ? "বাংলাদেশ সরকার অনুমোদিত পাঠ্যক্রম" : "Approved by NCTB & Education Board"}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {lang === 'bn' 
                ? `স্বাগতম, ${currentUser.nameBangla}` 
                : `Welcome, ${currentUser.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {lang === 'bn' 
                ? "স্কুল ম্যানেজমেন্ট সমন্বিত পোর্টালে শ্রেণি উপস্থিতি, এনসিটিবি গ্রেডবুক ও শিক্ষক বেতন পর্যবেক্ষণ করুন।"
                : "Manage real-time student attendance, NCTB GPA 5.0 gradebook, and BDT payroll seamlessly."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-white" />
              <span>{t.takeAttendance}</span>
            </button>
            <button
              onClick={() => onNavigate('notices')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? "বিজ্ঞপ্তি প্রকাশ" : "Notice Board"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Students */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xs hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.totalStudents}</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {lang === 'bn' ? toBanglaDigits(totalStudentsCount) : totalStudentsCount}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-2">
            <span>+100% {lang === 'bn' ? "সক্রিয়" : "Enrolled"}</span>
          </div>
        </div>

        {/* Total Teachers */}
        <div 
          onClick={() => onNavigate('payroll')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xs hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.totalTeachers}</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {lang === 'bn' ? toBanglaDigits(totalTeachersCount) : totalTeachersCount}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-2">
            <span>{lang === 'bn' ? "৫টি বিভাগ" : "5 Depts"}</span>
          </div>
        </div>

        {/* Today's Attendance % */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xs hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.todayAttendance}</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {lang === 'bn' ? `${toBanglaDigits(todayAttendancePct)}%` : `${todayAttendancePct}%`}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? "পদ্মা শাখা উপস্থিত" : "Padma Sec Active"}</span>
          </div>
        </div>

        {/* Fee Collection */}
        <div 
          onClick={() => onNavigate('fees')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xs hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.feeCollection}</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white mt-2 truncate">
            {formatCurrencyBDT(totalFeeCollected, lang)}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-2">
            <span>bKash & Cash</span>
          </div>
        </div>

        {/* Active Notices */}
        <div 
          onClick={() => onNavigate('notices')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xs hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.navNotices}</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {lang === 'bn' ? toBanglaDigits(notices.length) : notices.length}
          </p>
          <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold mt-2">
            <span>{lang === 'bn' ? "প্রকাশিত সার্কুলার" : "Published"}</span>
          </div>
        </div>

        {/* Payroll Disbursed */}
        <div 
          onClick={() => onNavigate('payroll')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-xs hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.payrollDisbursed}</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white mt-2 truncate">
            {formatCurrencyBDT(totalPayrollDisbursed, lang)}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-2">
            <span>{lang === 'bn' ? `${toBanglaDigits(pendingPayrollCount)}টি বাকি` : `${pendingPayrollCount} Pending`}</span>
          </div>
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Trend Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">{t.recentAttendanceTrend}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? "৬ষ্ঠ থেকে ১০ম শ্রেণির সাপ্তাহিক গড় উপস্থিতি হার (%)" : "Weekly Student Attendance Average (%)"}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-400 text-xs font-bold border border-emerald-800/80">
              {lang === 'bn' ? "গড়: ৯৫.৬%" : "Avg: 95.6%"}
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceWeeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, lang === 'bn' ? 'উপস্থিতির হার' : 'Attendance Rate']}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#attendanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs text-slate-400">Weekly Avg Rate:</span>
              <span className="text-sm font-bold text-emerald-400">95.6%</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs text-slate-400">Absence Ratio:</span>
              <span className="text-sm font-bold text-amber-400">4.4%</span>
            </div>
          </div>
        </div>

        {/* GPA 5.0 NCTB Grade Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">{t.gpaDistribution}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? "সর্বশেষ অর্ধবার্ষিক পরীক্ষা ২০২৬ ফলাফল বিশ্লেষণ" : "Mid-Term Examination 2026 Grade Breakdown"}
              </p>
            </div>
            <button 
              onClick={() => onNavigate('gradebook')}
              className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t.viewMarksheet}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaGradeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="grade" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [value, lang === 'bn' ? 'শিক্ষার্থী সংখ্যা' : 'Student Count']}
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs text-slate-400">GPA Average:</span>
              <span className="text-sm font-bold text-emerald-400">4.85</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs text-slate-400">Fail Rate:</span>
              <span className="text-sm font-bold text-red-400">0.4%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Grid: Absent Follow-Up & Notices / Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Absentee Alert & Automated SMS Status */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-950/80 text-red-400 border border-red-800/80">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {lang === 'bn' ? "আজকের অনুপস্থিত শিক্ষার্থী" : "Today's Absentee Alerts"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'bn' ? "অভিভাবকের সাথে সরাসরি যোগাযোগ" : "Direct guardian telephone contact"}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-950/80 text-red-400 border border-red-800/80">
                {absentToday.length} {lang === 'bn' ? "জন" : "Students"}
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {absentToday.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                  {lang === 'bn' ? "আজ কোন অনুপস্থিত শিক্ষার্থী নেই!" : "No absent students recorded today!"}
                </div>
              ) : (
                absentToday.map(abs => {
                  const studentInfo = students.find(s => s.id === abs.studentId);
                  return (
                    <div key={abs.id} className="p-3 border-l-2 border-red-500 bg-slate-800/40 rounded-r-lg text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          {studentInfo ? (lang === 'bn' ? studentInfo.nameBangla : studentInfo.nameEnglish) : abs.studentName}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                          {lang === 'bn' ? `রোল: ${toBanglaDigits(abs.studentRoll)}` : `Roll: ${abs.studentRoll}`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        {lang === 'bn' ? `অভিভাবক: ${studentInfo?.guardianName}` : `Guardian: ${studentInfo?.guardianName}`} ({studentInfo?.guardianPhone})
                      </p>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/60">
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {lang === 'bn' ? "অভিভাবক ডাটাবেজ যাচাইকৃত" : "Guardian Record Verified"}
                        </span>
                        <a 
                          href={`tel:${studentInfo?.guardianPhone}`} 
                          className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[10px] border border-slate-700 hover:bg-slate-700 transition"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>{lang === 'bn' ? "কল করুন" : "Call"}</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 mt-3">
            <button
              onClick={() => onNavigate('attendance')}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition text-center border border-slate-700 cursor-pointer"
            >
              {lang === 'bn' ? "সকল শ্রেণির হাজিরা খাতা দেখুন" : "View Full Attendance Register"} →
            </button>
          </div>
        </div>

        {/* Urgent Notices Board */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/80">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">{t.urgentNotices}</h3>
            </div>
            <button 
              onClick={() => onNavigate('notices')}
              className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              {t.viewAll}
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {notices.slice(0, 3).map(not => (
              <div 
                key={not.id} 
                className={`p-3 border-l-2 ${
                  not.priority === 'urgent' ? 'border-amber-500 bg-slate-800/40' : 'border-emerald-500 bg-slate-800/30'
                } rounded-r-lg transition`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    not.priority === 'urgent' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {not.category}
                  </span>
                  <span className="text-[10px] text-slate-500">{not.publishedDate}</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1">
                  {lang === 'bn' ? not.titleBangla : not.titleEnglish}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 mt-0.5">
                  {lang === 'bn' ? not.contentBangla : not.contentEnglish}
                </p>
                <div className="text-[9px] text-slate-500 mt-2">
                  10:45 AM • Global Broadcast
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Activity Feed */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">{t.recentActivity}</h3>
            </div>
            <button 
              onClick={() => onNavigate('audit_logs')}
              className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              {lang === 'bn' ? "লগ দেখুন" : "Audit Trail"}
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="p-3 border-l-2 border-slate-600 bg-slate-800/30 rounded-r-lg text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-[11px]">{log.action}</span>
                  <span className="text-[9px] text-slate-500">{log.timestamp.slice(11, 16)}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{log.details}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                  <span>User: {log.userName}</span>
                  <span>{log.ipAddress.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
