import React, { useState } from 'react';
import { 
  UserCheck, Calendar, Filter, Check, X, 
  Clock, AlertCircle, Send, MessageSquare, 
  Printer, Download, ShieldCheck, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits } from '../translations';
import { AttendanceStatus } from '../types';

export const AttendanceModule: React.FC = () => {
  const { students, attendance, markBatchAttendance, lang, smsBalance } = useApp();
  const t = translations[lang];

  const [selectedClass, setSelectedClass] = useState<string>("Class 9");
  const [selectedSection, setSelectedSection] = useState<string>("Padma");
  const [selectedDate, setSelectedDate] = useState<string>("2026-08-29");
  const [autoSmsAbsent, setAutoSmsAbsent] = useState<boolean>(true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Filter students by selected class & section
  const classStudents = students.filter(
    s => s.className === selectedClass && s.section === selectedSection
  );

  // Build local attendance state initialized from existing records or default 'present'
  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, { status: AttendanceStatus; inTime?: string; remarks?: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; inTime?: string; remarks?: string }> = {};
    classStudents.forEach(s => {
      const existing = attendance.find(a => a.studentId === s.id && a.date === selectedDate);
      if (existing) {
        map[s.id] = { status: existing.status, inTime: existing.inTime, remarks: existing.remarks };
      } else {
        map[s.id] = { status: 'present', inTime: '08:15 AM' };
      }
    });
    return map;
  });

  // Re-sync when filters change
  const handleFilterChange = (newClass: string, newSec: string, newDate: string) => {
    setSelectedClass(newClass);
    setSelectedSection(newSec);
    setSelectedDate(newDate);

    const filtered = students.filter(s => s.className === newClass && s.section === newSec);
    const map: Record<string, { status: AttendanceStatus; inTime?: string; remarks?: string }> = {};
    filtered.forEach(s => {
      const existing = attendance.find(a => a.studentId === s.id && a.date === newDate);
      if (existing) {
        map[s.id] = { status: existing.status, inTime: existing.inTime, remarks: existing.remarks };
      } else {
        map[s.id] = { status: 'present', inTime: '08:15 AM' };
      }
    });
    setStudentStatusMap(map);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        inTime: status === 'late' ? '08:35 AM' : (status === 'present' ? '08:15 AM' : undefined)
      }
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    setStudentStatusMap(prev => {
      const updated = { ...prev };
      classStudents.forEach(s => {
        updated[s.id] = {
          ...updated[s.id],
          status,
          inTime: status === 'present' ? '08:15 AM' : undefined
        };
      });
      return updated;
    });
  };

  const handleSaveAttendance = () => {
    const payload = classStudents.map(s => ({
      studentId: s.id,
      status: studentStatusMap[s.id]?.status || 'present',
      inTime: studentStatusMap[s.id]?.inTime,
      remarks: studentStatusMap[s.id]?.remarks
    }));

    markBatchAttendance(selectedClass, selectedSection, selectedDate, payload, autoSmsAbsent);

    const absentCount = payload.filter(p => p.status === 'absent').length;
    const msg = lang === 'bn' 
      ? `উপস্থিতি সংরক্ষিত হয়েছে! ${absentCount > 0 && autoSmsAbsent ? `${toBanglaDigits(absentCount)}টি অনুপস্থিতি এসএমএস প্রেরিত হয়েছে।` : ''}`
      : `Attendance saved successfully! ${absentCount > 0 && autoSmsAbsent ? `${absentCount} automated SMS dispatched.` : ''}`;
    
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Counts
  const statusList = Object.values(studentStatusMap) as Array<{ status: AttendanceStatus }>;
  const presentCount = statusList.filter(v => v.status === 'present').length;
  const absentCount = statusList.filter(v => v.status === 'absent').length;
  const lateCount = statusList.filter(v => v.status === 'late').length;
  const excusedCount = statusList.filter(v => v.status === 'excused').length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            <span>{t.navAttendance}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "শ্রেণিভিত্তিক ডিজিটাল হাজিরা খাতা ও অভিভাবকের মোবাইলে স্বয়ংক্রিয় এসএমএস সতর্কতা" 
              : "Daily class attendance register with automated Bangla/English SMS alerts to parents"}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>{t.print}</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.save}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessNotice}</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">SMS Balance: {smsBalance}</span>
        </div>
      )}

      {/* Filter & Selector Ribbon */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs no-print">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
          
          {/* Class Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t.selectClass}</label>
            <select
              value={selectedClass}
              onChange={(e) => handleFilterChange(e.target.value, selectedSection, selectedDate)}
              className="w-full text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            >
              <option value="Class 6">Class 6 (৬ষ্ঠ শ্রেণি)</option>
              <option value="Class 7">Class 7 (৭ম শ্রেণি)</option>
              <option value="Class 8">Class 8 (৮ম শ্রেণি)</option>
              <option value="Class 9">Class 9 (৯ম শ্রেণি)</option>
              <option value="Class 10">Class 10 (১০ম শ্রেণি)</option>
            </select>
          </div>

          {/* Section Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t.selectSection}</label>
            <select
              value={selectedSection}
              onChange={(e) => handleFilterChange(selectedClass, e.target.value, selectedDate)}
              className="w-full text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            >
              <option value="Padma">Padma (পদ্মা শাখা)</option>
              <option value="Meghna">Meghna (মেঘনা শাখা)</option>
              <option value="Jamuna">Jamuna (যমুনা শাখা)</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{t.selectDate}</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleFilterChange(selectedClass, selectedSection, e.target.value)}
              className="w-full text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Quick Batch Marking */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Batch Controls</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="flex-1 py-2 px-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-800 transition cursor-pointer"
              >
                {lang === 'bn' ? "সবাই উপস্থিত" : "All Present"}
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="flex-1 py-2 px-2 bg-red-950/80 hover:bg-red-900 text-red-400 text-[11px] font-bold rounded-lg border border-red-800 transition cursor-pointer"
              >
                {lang === 'bn' ? "সবাই অনুপস্থিত" : "All Absent"}
              </button>
            </div>
          </div>

        </div>

        {/* Automated SMS Toggle & Preview */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSmsAbsent}
              onChange={(e) => setAutoSmsAbsent(e.target.checked)}
              className="w-4 h-4 text-emerald-500 rounded border-slate-700 bg-slate-900 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              {t.autoSendAbsenceSMS}
            </span>
          </label>

          <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <span className="text-emerald-400 font-semibold">Teletalk / GP Gateway Active</span>
            <span>•</span>
            <span>৳0.45/SMS</span>
          </div>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.present}</span>
          <span className="text-lg font-bold text-emerald-400">
            {lang === 'bn' ? toBanglaDigits(presentCount) : presentCount}
          </span>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.absent}</span>
          <span className="text-lg font-bold text-red-400">
            {lang === 'bn' ? toBanglaDigits(absentCount) : absentCount}
          </span>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.late}</span>
          <span className="text-lg font-bold text-amber-400">
            {lang === 'bn' ? toBanglaDigits(lateCount) : lateCount}
          </span>
        </div>
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.excused}</span>
          <span className="text-lg font-bold text-blue-400">
            {lang === 'bn' ? toBanglaDigits(excusedCount) : excusedCount}
          </span>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden">
        
        {/* Table Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-white">
              {lang === 'bn' ? `${selectedClass} - ${selectedSection} শাখা দৈনিক হাজিরা` : `${selectedClass} (${selectedSection}) Attendance Register`}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'bn' ? `তারিখ: ${selectedDate} | মোট শিক্ষার্থী: ${toBanglaDigits(classStudents.length)} জন` : `Date: ${selectedDate} | Total: ${classStudents.length} Students`}
            </p>
          </div>
          <span className="text-xs bg-emerald-950/80 px-2.5 py-1 rounded-md font-bold text-emerald-400 border border-emerald-800">
            {presentCount}/{classStudents.length} {t.present}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">{t.rollNo}</th>
                <th className="py-3 px-4">{t.studentName}</th>
                <th className="py-3 px-4 hidden sm:table-cell">{t.guardianContact}</th>
                <th className="py-3 px-4 text-center">{t.status}</th>
                <th className="py-3 px-4 hidden md:table-cell">In-Time / Remarks</th>
                <th className="py-3 px-4 text-right no-print">Auto SMS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {classStudents.map((student) => {
                const currentStatus = studentStatusMap[student.id]?.status || 'present';
                const inTime = studentStatusMap[student.id]?.inTime;

                return (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition">
                    
                    {/* Roll */}
                    <td className="py-3 px-4 text-center font-bold text-white">
                      {lang === 'bn' ? toBanglaDigits(student.roll) : student.roll}
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={student.avatarUrl} 
                          alt={student.nameEnglish} 
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-white">
                            {lang === 'bn' ? student.nameBangla : student.nameEnglish}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {student.studentCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Guardian Mobile */}
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <p className="text-slate-200 font-medium">{student.guardianName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{student.guardianPhone}</p>
                    </td>

                    {/* Interactive Attendance Status Toggle Buttons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                          title="Present"
                        >
                          P
                        </button>

                        {/* Absent */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                            currentStatus === 'absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                          title="Absent"
                        >
                          A
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                          title="Late"
                        >
                          L
                        </button>

                        {/* Excused */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'excused')}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                            currentStatus === 'excused'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                          title="Excused"
                        >
                          E
                        </button>

                      </div>
                    </td>

                    {/* Time / Remarks */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      {currentStatus === 'late' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                          <Clock className="w-3 h-3" />
                          In: {inTime || '08:35 AM'}
                        </span>
                      ) : currentStatus === 'absent' ? (
                        <span className="text-[11px] text-red-400 font-medium italic">
                          Absence SMS Queued
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          On time (08:15 AM)
                        </span>
                      )}
                    </td>

                    {/* Auto SMS Indicator */}
                    <td className="py-3 px-4 text-right no-print">
                      {currentStatus === 'absent' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800">
                          <Send className="w-2.5 h-2.5" />
                          SMS to Guardian
                        </span>
                      ) : currentStatus === 'late' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                          <Send className="w-2.5 h-2.5" />
                          Late SMS
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                          No Alert Needed
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Printable Footer with Official Seal Lines */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 hidden print:block">
          <div className="flex justify-between pt-12 text-center text-xs text-slate-400">
            <div className="border-t border-slate-600 pt-1 w-48">
              <p className="font-bold text-white">শ্রেণি শিক্ষকের স্বাক্ষর</p>
              <p className="text-[10px] text-slate-400">Class Teacher Signature</p>
            </div>
            <div className="border-t border-slate-600 pt-1 w-48">
              <p className="font-bold text-white">প্রধান শিক্ষকের সিল ও স্বাক্ষর</p>
              <p className="text-[10px] text-slate-400">Headmaster Official Seal</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
