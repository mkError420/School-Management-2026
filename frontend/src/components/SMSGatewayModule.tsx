import React, { useState } from 'react';
import { 
  MessageSquare, Send, CheckCircle2, AlertTriangle, 
  Smartphone, Radio, Clock, RefreshCw, FileText, 
  Search, ShieldCheck, Sparkles, Filter, Copy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits, formatCurrencyBDT } from '../translations';

export const SMSGatewayModule: React.FC = () => {
  const { smsLogs, smsBalance, sendBulkSMS, students, lang } = useApp();
  const t = translations[lang];

  const [broadcastType, setBroadcastType] = useState<'all' | 'class' | 'custom'>('all');
  const [selectedClass, setSelectedClass] = useState<string>("Class 9");
  const [messageBangla, setMessageBangla] = useState<string>("সম্মানিত অভিভাবক, জরুরি আবহাওয়া সতর্কতার কারণে আগামীকাল বিদ্যালয়ের সকল শ্রেণির পাঠদান স্থগিত থাকবে। - ঢাকা মডেল হাই স্কুল");
  const [messageEnglish, setMessageEnglish] = useState<string>("Dear Guardian, all classes are suspended tomorrow due to extreme weather conditions. - Dhaka Model High School");
  const [activeTemplateTab, setActiveTemplateTab] = useState<'templates' | 'broadcast' | 'logs'>('logs');
  const [searchLog, setSearchLog] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [broadcastSentFeedback, setBroadcastSentFeedback] = useState<string | null>(null);

  // Calculate character length
  const banglaCharCount = messageBangla.length;
  const englishCharCount = messageEnglish.length;
  const banglaSmsParts = Math.ceil(banglaCharCount / 70) || 1;
  const englishSmsParts = Math.ceil(englishCharCount / 160) || 1;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    let targetStudents = students;
    if (broadcastType === 'class') {
      targetStudents = students.filter(s => s.className === selectedClass);
    }
    
    const phones = targetStudents.map(s => s.guardianPhone);
    const studentMap = targetStudents.reduce((acc, s) => {
      acc[s.guardianPhone] = s.nameEnglish;
      return acc;
    }, {} as Record<string, string>);

    sendBulkSMS(phones, messageBangla, messageEnglish, studentMap);

    const feedback = lang === 'bn' 
      ? `সফলভাবে ${toBanglaDigits(phones.length)} জন অভিভাবকের মোবাইলে এসএমএস পাঠানো হয়েছে!`
      : `Broadcast SMS successfully dispatched to ${phones.length} guardians!`;
    setBroadcastSentFeedback(feedback);
    setTimeout(() => setBroadcastSentFeedback(null), 4000);
  };

  const filteredLogs = smsLogs.filter(log => {
    const term = (searchLog || '').toLowerCase();
    const matchesSearch = (log.recipientPhone || '').includes(searchLog) || 
      (log.studentName || '').toLowerCase().includes(term) ||
      (log.messageBangla || '').toLowerCase().includes(term);
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            <span>{lang === 'bn' ? "টেলিটক ও জিপি এসএমএস গেটওয়ে" : "Automated SMS Gateway & Broadcast"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "অভিভাবকের মোবাইলে বাংলা/ইংরেজি ইউনিকোড নোটিফিকেশন, জরুরি বিজ্ঞপ্তি ও ডেলিভারি লগ" 
              : "Automated parent notifications, NCTB absentee alerts, and carrier dispatch logs"}
          </p>
        </div>

        {/* SMS Credit Card */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xs border border-slate-800">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {lang === 'bn' ? "অবশিষ্ট এসএমএস ক্রেডিট" : "Active SMS Balance"}
            </p>
            <p className="text-base font-bold text-white">
              {lang === 'bn' ? toBanglaDigits(smsBalance) : smsBalance} <span className="text-xs text-slate-400 font-normal">SMS</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTemplateTab('logs')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTemplateTab === 'logs' 
              ? 'border-emerald-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{lang === 'bn' ? "এসএমএস প্রেরণের তালিকা ও লগ" : "Dispatch Logs & Reports"}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px]">
            {smsLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTemplateTab('broadcast')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTemplateTab === 'broadcast' 
              ? 'border-emerald-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{lang === 'bn' ? "জরুরি বাল্ক এসএমএস ব্রডকাস্ট" : "Emergency Bulk SMS"}</span>
        </button>

        <button
          onClick={() => setActiveTemplateTab('templates')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTemplateTab === 'templates' 
              ? 'border-emerald-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'bn' ? "স্বয়ংক্রিয় টেমপ্লেট কনফিগারেশন" : "Dynamic Templates"}</span>
        </button>
      </div>

      {/* Success Feedback Alert */}
      {broadcastSentFeedback && (
        <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{broadcastSentFeedback}</span>
        </div>
      )}

      {/* TAB 1: DISPATCH LOGS */}
      {activeTemplateTab === 'logs' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={lang === 'bn' ? "মোবাইল নম্বর বা বার্তা খুঁজুন..." : "Search phone or message..."}
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 text-white border border-slate-800 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              >
                <option value="all">{lang === 'bn' ? "সকল ধরনের বার্তা" : "All Notification Types"}</option>
                <option value="attendance_absence">{lang === 'bn' ? "অনুপস্থিতির সতর্কতা" : "Absence Alerts"}</option>
                <option value="attendance_late">{lang === 'bn' ? "দেরি সতর্কতা" : "Late Entry Alerts"}</option>
                <option value="exam_result">{lang === 'bn' ? "পরীক্ষার ফল" : "Exam Results"}</option>
                <option value="school_broadcast">{lang === 'bn' ? "স্কুল নোটিশ ব্রডকাস্ট" : "School Broadcast"}</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">{t.recipient}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? "বার্তার ধরন" : "Type"}</th>
                    <th className="py-3 px-4">{t.message}</th>
                    <th className="py-3 px-4 text-center">{lang === 'bn' ? "অক্ষর ও খরচ" : "Chars & Cost"}</th>
                    <th className="py-3 px-4 text-center">{t.deliveryStatus}</th>
                    <th className="py-3 px-4 text-right">{t.date}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{log.studentName}</p>
                        <p className="text-[11px] font-mono text-slate-400">{log.recipientPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          (log.type || '').includes('absence') ? 'bg-red-950/80 text-red-400 border-red-800/80' :
                          (log.type || '').includes('late') ? 'bg-amber-950/80 text-amber-400 border-amber-800/80' :
                          (log.type || '').includes('result') ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' :
                          'bg-blue-950/80 text-blue-400 border-blue-800/80'
                        }`}>
                          {(log.type || 'sms').replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-slate-200 line-clamp-2 leading-relaxed">
                          {lang === 'bn' ? log.messageBangla : (log.messageEnglish || log.messageBangla)}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Ref: {log.gatewayResponseId || 'GP-SMS-9921'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <p className="font-semibold text-white">{log.characterCount ?? 0} chars</p>
                        <p className="text-[10px] text-emerald-400 font-semibold font-mono">৳{(log.costBDT ?? 0.35).toFixed(2)}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {(log.status || 'delivered').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-[11px] text-slate-400 whitespace-nowrap">
                        {log.sentAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BROADCAST SMS DISPATCH */}
      {activeTemplateTab === 'broadcast' && (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
              <Send className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {lang === 'bn' ? "জরুরি নোটিশ / আবহাওয়া সতর্কতা ব্রডকাস্ট" : "Broadcast Urgent Notification to Parents"}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? "সকল বা নির্দিষ্ট শ্রেণির শিক্ষার্থীর অভিভাবকের ফোনে একযোগে এসএমএস পাঠান" : "Instantly deliver SMS alerts to parent phone numbers"}
              </p>
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Target Audience</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setBroadcastType('all')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    broadcastType === 'all' 
                      ? 'bg-slate-800 text-white border-slate-700 shadow-xs' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {lang === 'bn' ? "সমগ্র বিদ্যালয় (সকল অভিভাবক)" : "Entire School (All Parents)"}
                </button>

                <button
                  type="button"
                  onClick={() => setBroadcastType('class')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    broadcastType === 'class' 
                      ? 'bg-slate-800 text-white border-slate-700 shadow-xs' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {lang === 'bn' ? "নির্দিষ্ট শ্রেণি" : "Specific Class"}
                </button>
              </div>
            </div>

            {broadcastType === 'class' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t.selectClass}</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="Class 6">Class 6 (৬ষ্ঠ শ্রেণি)</option>
                  <option value="Class 7">Class 7 (৭ম শ্রেণি)</option>
                  <option value="Class 8">Class 8 (৮ম শ্রেণি)</option>
                  <option value="Class 9">Class 9 (৯ম শ্রেণি)</option>
                  <option value="Class 10">Class 10 (১০ম শ্রেণি)</option>
                </select>
              </div>
            )}

            {/* Bangla SMS Box */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? "বাংলা ইউনিকোড বার্তা (Unicode SMS)" : "Bangla Message (Unicode)"}
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {banglaCharCount} chars ({banglaSmsParts} SMS part)
                </span>
              </div>
              <textarea
                rows={3}
                value={messageBangla}
                onChange={(e) => setMessageBangla(e.target.value)}
                className="w-full text-xs bg-slate-950 text-white border border-slate-800 rounded-lg p-3 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                required
              />
            </div>

            {/* English SMS Box */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? "ইংরেজি সংস্করণ (English ASCII)" : "English Version (Standard GSM)"}
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {englishCharCount} chars ({englishSmsParts} SMS part)
                </span>
              </div>
              <textarea
                rows={2}
                value={messageEnglish}
                onChange={(e) => setMessageEnglish(e.target.value)}
                className="w-full text-xs bg-slate-950 text-white border border-slate-800 rounded-lg p-3 focus:ring-1 focus:ring-emerald-500 outline-hidden"
              />
            </div>

            {/* Cost & Dispatch estimate */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-white">{lang === 'bn' ? "আনুমানিক প্রাপক" : "Estimated Recipients"}</p>
                <p className="text-slate-400 text-[11px]">
                  {broadcastType === 'all' ? students.length : students.filter(s => s.className === selectedClass).length} {lang === 'bn' ? "জন অভিভাবক" : "Guardians"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400 font-mono">
                  {formatCurrencyBDT((broadcastType === 'all' ? students.length : students.filter(s => s.className === selectedClass).length) * 0.45, lang)}
                </p>
                <p className="text-[10px] text-slate-500">@ ৳0.45 per SMS</p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'bn' ? "এখনই বাল্ক এসএমএস সম্প্রচার করুন" : "Dispatch Broadcast SMS Now"}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: AUTOMATED TEMPLATES */}
      {activeTemplateTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Absent Template */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">1. Student Absence Alert (অনুপস্থিতি)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">Active</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800">
              সম্মানিত অভিভাবক, আপনার সন্তান {`{student_name}`} (রোল {`{roll}`}, শ্রেণি {`{class}`}) আজ {`{date}`} বিদ্যালয়ে অনুপস্থিত ছিল। - ঢাকা মডেল হাই স্কুল
            </div>
            <p className="text-[11px] text-slate-400">
              Trigger: Automatically fired when teacher marks student 'Absent' during morning assembly attendance.
            </p>
          </div>

          {/* Late Entry Template */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">2. Late Entry Notice (বিলম্ব আগমন)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">Active</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800">
              সম্মানিত অভিভাবক, আপনার সন্তান {`{student_name}`} আজ {`{in_time}`} মিনিটে দেরিতে বিদ্যালয়ে প্রবেশ করেছে। - ঢাকা মডেল হাই স্কুল
            </div>
            <p className="text-[11px] text-slate-400">
              Trigger: Automatically fired when gatekeeper or class teacher marks 'Late'.
            </p>
          </div>

          {/* Exam Result Published Template */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">3. Exam Result Notification (ফলাফল প্রকাশ)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">Active</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800">
              অভিনন্দন! {`{student_name}`} {`{exam_name}`} পরীক্ষায় GPA {`{gpa}`} পেয়ে মেধা তালিকায় {`{position}`}ম স্থান অর্জন করেছে। - ঢাকা মডেল হাই স্কুল
            </div>
            <p className="text-[11px] text-slate-400">
              Trigger: Dispatched when teacher finalizes NCTB marksheet tabulations.
            </p>
          </div>

          {/* Fee Due Reminder */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-white">4. Monthly Fee Due Reminder (মাসিক বেতন রিমাইন্ডার)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">Active</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800">
              সম্মানিত অভিভাবক, {`{student_name}`}-এর {`{month}`} মাসের বকেয়া বেতন ৳{`{amount}`} আগামী ১০ তারিখের মধ্যে বিকাশ বা হিসাব শাখায় জমা দেওয়ার অনুরোধ করা হলো।
            </div>
            <p className="text-[11px] text-slate-400">
              Trigger: Dispatched by Accounts Officer on the 5th of each month.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
