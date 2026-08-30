import React, { useState } from 'react';
import { 
  Bell, Plus, Calendar, Tag, AlertTriangle, 
  Send, MessageSquare, CheckCircle2, User, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import { SchoolNotice } from '../types';

export const NoticeBoardModule: React.FC = () => {
  const { notices, addNotice, lang, currentUser } = useApp();
  const t = translations[lang];

  const [showNewNoticeModal, setShowNewNoticeModal] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formTitleEnglish, setFormTitleEnglish] = useState("");
  const [formTitleBangla, setFormTitleBangla] = useState("");
  const [formContentEnglish, setFormContentEnglish] = useState("");
  const [formContentBangla, setFormContentBangla] = useState("");
  const [formCategory, setFormCategory] = useState<SchoolNotice['category']>("academic");
  const [formPriority, setFormPriority] = useState<SchoolNotice['priority']>("normal");
  const [formTarget, setFormTarget] = useState<SchoolNotice['targetAudience']>("all");
  const [sendSmsBroadcast, setSendSmsBroadcast] = useState<boolean>(true);

  const handleSubmitNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: SchoolNotice = {
      id: `notice-00${notices.length + 1}`,
      titleEnglish: formTitleEnglish,
      titleBangla: formTitleBangla,
      contentEnglish: formContentEnglish,
      contentBangla: formContentBangla,
      category: formCategory,
      priority: formPriority,
      targetAudience: formTarget,
      publishedBy: currentUser.name,
      publishedDate: "2026-08-29",
      smsBroadcastSent: sendSmsBroadcast
    };

    addNotice(newNotice);
    setShowNewNoticeModal(false);
    setFormTitleEnglish("");
    setFormTitleBangla("");
    setFormContentEnglish("");
    setFormContentBangla("");
  };

  const filteredNotices = notices.filter(n => filterCategory === 'all' || n.category === filterCategory);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            <span>{t.navNotices}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "একাডেমিক সার্কুলার, ছুটির নোটিশ ও জরুরি আবহাওয়া সতর্কতা প্রচার" 
              : "Official circulars, holiday calendars, and urgent SMS push broadcasts"}
          </p>
        </div>

        {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'teacher') && (
          <button
            onClick={() => setShowNewNoticeModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? "নতুন নোটিশ প্রকাশ" : "Publish Notice"}</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        {['all', 'academic', 'exam', 'holiday', 'administrative', 'emergency'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              filterCategory === cat 
                ? 'bg-slate-800 text-white border-slate-700 shadow-xs' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {(cat || '').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotices.map((notice) => (
          <div 
            key={notice.id} 
            className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  notice.priority === 'urgent' ? 'bg-red-950 text-red-400 border border-red-800' :
                  notice.priority === 'high' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-blue-950 text-blue-400 border border-blue-800'
                }`}>
                  {(notice.category || 'general').toUpperCase()} • {(notice.priority || 'normal').toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {notice.publishedDate}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mt-1">
                {lang === 'bn' ? notice.titleBangla : notice.titleEnglish}
              </h3>
              
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                {lang === 'bn' ? notice.contentBangla : notice.contentEnglish}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Published by: <strong className="text-slate-300">{notice.publishedBy}</strong></span>
              {notice.smsBroadcastSent && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  SMS Sent
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PUBLISH NOTICE MODAL */}
      {showNewNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-xl p-6 max-w-lg w-full shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-semibold text-white">Publish New School Notice</h3>
              <button 
                onClick={() => setShowNewNoticeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Title (Bangla) *</label>
                <input
                  type="text"
                  required
                  value={formTitleBangla}
                  onChange={(e) => setFormTitleBangla(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden font-bangla focus:ring-1 focus:ring-emerald-500"
                  placeholder="যেমন: পবিত্র ঈদুল ফিতর উপলক্ষে বিদ্যালয় ছুটি সংক্রান্ত"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={formTitleEnglish}
                  onChange={(e) => setFormTitleEnglish(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  placeholder="e.g. Notice regarding Holy Eid-ul-Fitr Vacation"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                    <option value="administrative">Admin</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Target</label>
                  <select
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">All</option>
                    <option value="guardians">Guardians</option>
                    <option value="teachers">Teachers</option>
                    <option value="students">Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Notice Body (Bangla) *</label>
                <textarea
                  rows={2}
                  required
                  value={formContentBangla}
                  onChange={(e) => setFormContentBangla(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-3 outline-hidden font-bangla focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Notice Body (English)</label>
                <textarea
                  rows={2}
                  value={formContentEnglish}
                  onChange={(e) => setFormContentEnglish(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-3 outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={sendSmsBroadcast}
                  onChange={(e) => setSendSmsBroadcast(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-950 border-slate-800"
                />
                <span className="font-medium text-slate-300">Auto-broadcast SMS alert to parents</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewNoticeModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition shadow-xs cursor-pointer"
                >
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
