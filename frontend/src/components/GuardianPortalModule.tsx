import React, { useState } from 'react';
import { 
  HeartHandshake, MessageSquare, Award, UserCheck, 
  Receipt, Phone, Calendar, Send, CheckCircle2, 
  Clock, CreditCard, ShieldCheck, Sparkles, User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits, formatCurrencyBDT } from '../translations';

export const GuardianPortalModule: React.FC = () => {
  const { students, attendance, grades, feePayments, notices, lang, sendBulkSMS } = useApp();
  const t = translations[lang];

  // Ward selection (default to student 1)
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "std-001");
  const [guardianMessage, setGuardianMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'guardian' | 'teacher'; text: string; time: string }>>([
    { sender: 'guardian', text: 'আসসালামু আলাইকুম স্যার, আগামী সপ্তাহের গণিত মডেল টেস্টের সিলেবাস কি প্রকাশিত হয়েছে?', time: 'Yesterday 04:30 PM' },
    { sender: 'teacher', text: 'ওয়ালাইকুম আসসালাম। হ্যাঁ, গণিত ১ম ও ২য় অধ্যায়ের উপর পরীক্ষা হবে। নোটিশ বোর্ডে দেওয়া হয়েছে।', time: 'Yesterday 05:15 PM' },
    { sender: 'guardian', text: 'অনেক ধন্যবাদ স্যার।', time: 'Today 09:10 AM' }
  ]);
  const [messageSentFeedback, setMessageSentFeedback] = useState<boolean>(false);

  const ward = students.find(s => s.id === selectedStudentId) || students[0] || {
    id: "std-001",
    studentCode: "DIMS-2026-0601",
    roll: 1,
    nameEnglish: "Student",
    nameBangla: "শিক্ষার্থী",
    className: "Class 9",
    section: "Padma",
    gender: "female",
    avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    attendanceRate: 96.8,
    gpa: 5.0,
    lastExamGPA: 5.0,
    guardianName: "Guardian",
    guardianPhone: "+8801712345678"
  };
  const wardAttendance = attendance.filter(a => a.studentId === ward.id);
  const wardGrade = grades.find(g => g.studentId === ward.id);
  const wardFees = feePayments.filter(f => f.studentId === ward.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianMessage.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'guardian',
        text: guardianMessage,
        time: 'Just now'
      }
    ]);
    setGuardianMessage("");
    setMessageSentFeedback(true);
    setTimeout(() => setMessageSentFeedback(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-emerald-400" />
            <span>{t.navGuardianPortal}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "অভিভাবক ও বিদ্যালয়ের সরাসরি যোগাযোগ, উপস্থিতি ট্র্যাকিং এবং অনলাইন ফি প্রদান পোর্টাল" 
              : "Direct guardian-to-teacher communication, attendance tracking, and instant fee payments"}
          </p>
        </div>

        {/* Student Selector for Multi-child Parents */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shadow-xs">
          <User className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-400">Select Child:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="text-xs font-semibold bg-transparent border-none outline-hidden text-white cursor-pointer"
          >
            {students.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {lang === 'bn' ? s.nameBangla : s.nameEnglish} ({s.className})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ward Status Overview Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={ward.avatarUrl} 
              alt={ward.nameEnglish} 
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {lang === 'bn' ? ward.nameBangla : ward.nameEnglish}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {ward.className} ({ward.section})
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                {lang === 'bn' ? `রোল: ${toBanglaDigits(ward.roll)}` : `Roll: ${ward.roll}`} • ID: {ward.studentCode}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {lang === 'bn' ? `অভিভাবক: ${ward.guardianName} (${ward.guardianPhone})` : `Guardian: ${ward.guardianName} (${ward.guardianPhone})`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto text-center">
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Current GPA</span>
              <p className="text-xl font-bold text-amber-400 font-mono">GPA {(ward.gpa ?? ward.lastExamGPA ?? 5.0).toFixed(2)}</p>
              <span className="text-[10px] text-emerald-400 font-semibold">Top 1% Merit</span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attendance</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">{ward.attendanceRate ?? 95}%</p>
              <span className="text-[10px] text-emerald-400 font-semibold">Regular</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid: Direct Chat with Teacher & Ward Academic Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Direct Teacher-Guardian Messaging Box */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xs flex flex-col h-[520px]">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 text-white rounded-t-xl flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                ম
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white">
                  {lang === 'bn' ? "শ্রেণি শিক্ষক (মোহাম্মদ রফিকুল ইসলাম)" : "Class Teacher (Md. Rafiqul Islam)"}
                </h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online for Parent Consultation</span>
                </p>
              </div>
            </div>

            <a
              href="tel:01711223344"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition cursor-pointer"
              title="Call Class Teacher"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60 text-xs">
            {chatMessages.map((msg, idx) => {
              const isGuardian = msg.sender === 'guardian';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isGuardian ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-xl ${
                    isGuardian 
                      ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs' 
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none shadow-xs'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] mt-1 block ${isGuardian ? 'text-emerald-200' : 'text-slate-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 rounded-b-xl flex items-center gap-2">
            <input
              type="text"
              placeholder={lang === 'bn' ? "শিক্ষকের কাছে বার্তা লিখুন..." : "Type message for class teacher..."}
              value={guardianMessage}
              onChange={(e) => setGuardianMessage(e.target.value)}
              className="flex-1 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            />
            <button
              type="submit"
              className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Ward Live Progress & Attendance Cards */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Recent Attendance Logs */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white">
                  {lang === 'bn' ? "সর্বশেষ উপস্থিতি রেকর্ড" : "Recent Attendance Record"}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                Verified by Gate Scanner
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">2026-08-29 (Today)</span>
                  <p className="text-[10px] text-slate-400">In-time: 08:15 AM (Morning Assembly)</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[10px]">
                  PRESENT
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">2026-08-28 (Yesterday)</span>
                  <p className="text-[10px] text-slate-400">In-time: 08:12 AM</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[10px]">
                  PRESENT
                </span>
              </div>
            </div>
          </div>

          {/* Academic Exam Grade Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-white">
                  {lang === 'bn' ? "সর্বশেষ পরীক্ষার ফলাফল (অর্ধবার্ষিক ২০২৬)" : "Mid-Term Examination Result 2026"}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                GPA 5.00 (A+)
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Bangla</span>
                <span className="font-bold text-white">164 / 200 (A+)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">English</span>
                <span className="font-bold text-white">165 / 200 (A+)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">General Math</span>
                <span className="font-bold text-white">85 / 100 (A+)</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Physics</span>
                <span className="font-bold text-white">82 / 100 (A+)</span>
              </div>
            </div>
          </div>

          {/* Fee Invoices & Instant bKash Pay */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-white">
                  {lang === 'bn' ? "মাসিক বেতন ও ফি পরিশোধের হিসেব" : "Tuition Fees & Payments"}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                bKash Merchant Integrated
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              {wardFees.map(fee => (
                <div key={fee.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">{fee.month} Tuition Fee</span>
                    <p className="text-[10px] text-slate-400">Txn: {fee.transactionRef} • {fee.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400 font-mono">{formatCurrencyBDT(fee.netAmount, lang)}</p>
                    <span className="text-[10px] font-bold text-emerald-400">PAID</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
