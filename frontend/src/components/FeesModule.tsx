import React, { useState, useMemo } from 'react';
import { 
  Receipt, Printer, CheckCircle2, Plus, 
  Search, Filter, CreditCard, DollarSign, 
  Download, Calendar, ShieldCheck, Check,
  GraduationCap, UserCheck, RotateCcw, Sparkles,
  Users, Building2, Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits, formatCurrencyBDT } from '../translations';
import { StudentFeePayment } from '../types';

export const FeesModule: React.FC = () => {
  const { students, teachers, feePayments, recordFeePayment, lang, currentUser } = useApp();
  const t = translations[lang];

  const [selectedPayment, setSelectedPayment] = useState<StudentFeePayment | null>(feePayments[0] || null);
  const [showCollectModal, setShowCollectModal] = useState<boolean>(false);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>("all");
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<string>("all");

  // Collection Form State
  const [collectStudentId, setCollectStudentId] = useState<string>(students[0]?.id || "std-001");
  const [collectMonth, setCollectMonth] = useState<string>("September 2026");
  const [tuitionFee, setTuitionFee] = useState<number>(1500);
  const [examFee, setExamFee] = useState<number>(500);
  const [ictFee, setIctFee] = useState<number>(300);
  const [waiver, setWaiver] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Cash' | 'Bank'>('bKash');

  const totalPayable = tuitionFee + examFee + ictFee - waiver;

  // Extract unique classes dynamically
  const availableClasses = useMemo(() => {
    const classSet = new Set<string>();
    students.forEach(s => { if (s.className) classSet.add(s.className); });
    feePayments.forEach(f => { if (f.className) classSet.add(f.className); });
    return Array.from(classSet).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [students, feePayments]);

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const std = students.find(s => s.id === collectStudentId) || students[0];

    const newPayment: StudentFeePayment = {
      id: `fee-00${feePayments.length + 1}`,
      receiptNo: `MR-2026-${5000 + feePayments.length + 1}`,
      studentId: std.id,
      studentName: std.nameEnglish,
      studentRoll: std.roll,
      className: std.className,
      section: std.section,
      month: collectMonth,
      year: 2026,
      tuitionFee,
      examFee,
      labIctFee: ictFee,
      lateFine: 0,
      waiverDiscount: waiver,
      totalAmount: tuitionFee + examFee + ictFee,
      netAmount: totalPayable,
      paidAmount: totalPayable,
      paymentMethod,
      paymentStatus: 'paid',
      transactionRef: `${paymentMethod.toUpperCase()}-TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      paymentDate: "2026-08-29",
      collectedBy: currentUser.name
    };

    recordFeePayment(newPayment);
    setSelectedPayment(newPayment);
    setShowCollectModal(false);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Find selected teacher object
  const selectedTeacherObj = useMemo(() => {
    if (selectedTeacherFilter === 'all') return null;
    return teachers.find(t => t.id === selectedTeacherFilter || t.nameEnglish === selectedTeacherFilter);
  }, [teachers, selectedTeacherFilter]);

  // Comprehensive Filtering
  const filteredPayments = useMemo(() => {
    return feePayments.filter(f => {
      // 1. Search filter
      const term = (searchTerm || '').toLowerCase().trim();
      const searchMatch = !term || 
        (f.studentName || '').toLowerCase().includes(term) ||
        (f.receiptNo || '').toLowerCase().includes(term) ||
        (f.className || '').toLowerCase().includes(term) ||
        (f.paymentMethod || '').toLowerCase().includes(term) ||
        (f.transactionRef || f.transactionId || '').toLowerCase().includes(term) ||
        (f.collectedBy || '').toLowerCase().includes(term);

      // 2. Class filter
      const classMatch = selectedClassFilter === 'all' || f.className === selectedClassFilter;

      // 3. Teacher filter
      let teacherMatch = true;
      if (selectedTeacherFilter !== 'all' && selectedTeacherObj) {
        const teacherClasses = (selectedTeacherObj.assignedClasses || []).map(ac => ac.className);
        const isClassTaught = teacherClasses.includes(f.className);
        const isCollected = f.collectedBy === selectedTeacherObj.nameEnglish || f.collectedBy === selectedTeacherObj.nameBangla;
        teacherMatch = isClassTaught || isCollected;
      }

      // 4. Payment Method filter
      const methodMatch = selectedMethodFilter === 'all' || f.paymentMethod === selectedMethodFilter;

      return searchMatch && classMatch && teacherMatch && methodMatch;
    });
  }, [feePayments, searchTerm, selectedClassFilter, selectedTeacherFilter, selectedTeacherObj, selectedMethodFilter]);

  // Aggregate statistics for the filtered view
  const filteredTotalCollected = useMemo(() => {
    return filteredPayments.reduce((acc, p) => acc + (p.netAmount || p.amount || 0), 0);
  }, [filteredPayments]);

  const hasActiveFilters = searchTerm !== "" || selectedClassFilter !== "all" || selectedTeacherFilter !== "all" || selectedMethodFilter !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedClassFilter("all");
    setSelectedTeacherFilter("all");
    setSelectedMethodFilter("all");
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span>{t.navFees}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "শ্রেণি ও শিক্ষকভিত্তিক বেতন ফিল্টারিং, বিকাশ/নগদ অটো-পেমেন্ট ও প্রিন্টযোগ্য মানি রিসিট" 
              : "Class & Teacher-wise fee analytics, automated bKash/Nagad payments, and official receipts"}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>{lang === 'bn' ? "রিসিট প্রিন্ট" : "Print Receipt"}</span>
          </button>
          
          {(currentUser.role !== 'guardian' && currentUser.role !== 'student') && (
            <button
              onClick={() => setShowCollectModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'bn' ? "বেতন ফি আদায় করুন" : "Collect Fee"}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards for Filtered Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? "মোট আদায়কৃত অর্থ" : "Total Filtered Collection"}
            </span>
            <p className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {formatCurrencyBDT(filteredTotalCollected, lang)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? "আদায়কৃত রসিদ সংখ্যা" : "Paid Invoices Count"}
            </span>
            <p className="text-xl font-bold text-white font-mono mt-1">
              {lang === 'bn' ? toBanglaDigits(filteredPayments.length) : filteredPayments.length} <span className="text-xs text-slate-400 font-normal">{lang === 'bn' ? "টি" : "Receipts"}</span>
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/80">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {lang === 'bn' ? "সক্রিয় ফিল্টার অবস্থা" : "Active Filter Scope"}
            </span>
            <p className="text-xs font-semibold text-slate-200 mt-1 truncate">
              {selectedClassFilter === 'all' ? (lang === 'bn' ? 'সকল শ্রেণি' : 'All Classes') : selectedClassFilter}
              {' • '}
              {selectedTeacherObj ? (lang === 'bn' ? selectedTeacherObj.nameBangla : selectedTeacherObj.nameEnglish) : (lang === 'bn' ? 'সকল শিক্ষক' : 'All Teachers')}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/80">
            <Filter className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* FILTER RIBBON BAR (Class & Teacher Wise) */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-xs space-y-3 no-print">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? "ফিল্টার অপশন (শ্রেণি ও শিক্ষকভিত্তিক)" : "Filter Fees (Class & Teacher Wise)"}</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? "ফিল্টার রিসেট" : "Reset Filters"}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Class Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? "শ্রেণি নির্বাচন" : "Filter by Class"}</span>
            </label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden transition cursor-pointer"
            >
              <option value="all">{lang === 'bn' ? "সকল শ্রেণি (All Classes)" : "All Classes"}</option>
              {availableClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 2. Teacher Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? "শিক্ষক/শিক্ষিকাভিত্তিক" : "Filter by Teacher"}</span>
            </label>
            <select
              value={selectedTeacherFilter}
              onChange={(e) => setSelectedTeacherFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden transition cursor-pointer"
            >
              <option value="all">{lang === 'bn' ? "সকল শিক্ষক (All Teachers)" : "All Teachers"}</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {lang === 'bn' ? t.nameBangla : t.nameEnglish} ({t.department || t.designation})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Payment Method Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? "পেমেন্ট মাধ্যম" : "Payment Method"}</span>
            </label>
            <select
              value={selectedMethodFilter}
              onChange={(e) => setSelectedMethodFilter(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-hidden transition cursor-pointer"
            >
              <option value="all">{lang === 'bn' ? "সকল মাধ্যম (All Methods)" : "All Methods"}</option>
              <option value="bKash">bKash (বিকাশ)</option>
              <option value="Nagad">Nagad (নগদ)</option>
              <option value="Cash">Cash (নগদ টাকা)</option>
              <option value="Bank">Bank Transfer (ব্যাংক চালান)</option>
            </select>
          </div>

          {/* 4. Student / Receipt Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? "অনুসন্ধান" : "Search Keyword"}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={lang === 'bn' ? "শিক্ষার্থী, রোল বা রশিদ নং..." : "Student, Roll, Txn No..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

        </div>

        {/* Active Teacher Assigned Classes Indicator */}
        {selectedTeacherObj && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-semibold">{lang === 'bn' ? "দায়িত্বপ্রাপ্ত শ্রেণি:" : "Assigned Classes:"}</span>
            {(selectedTeacherObj.assignedClasses || []).map((ac, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[11px] font-bold border border-emerald-800">
                {ac.className} ({ac.section}) - {ac.subject}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Payment History + Official Money Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Payment History List */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden no-print">
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold">{lang === 'bn' ? "বেতন আদায়ের হিসেব ও রশিদ তালিকা" : "Collected Fee Invoices"}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'bn' ? "তালিকা থেকে রশিদ সিলেক্ট করে প্রিন্ট প্রিভিউ দেখুন" : "Select an invoice to preview the official receipt"}
              </p>
            </div>
            <span className="text-xs bg-emerald-950/80 px-2.5 py-1 rounded-md font-bold text-emerald-400 border border-emerald-800 font-mono">
              {lang === 'bn' ? toBanglaDigits(filteredPayments.length) : filteredPayments.length} Receipts
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[560px] overflow-y-auto">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="font-semibold">{lang === 'bn' ? "কোনো বেতন রশিদ পাওয়া যায়নি!" : "No fee invoices match the selected filter criteria."}</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition text-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? "ফিল্টার রিসেট করুন" : "Reset Filter"}</span>
                </button>
              </div>
            ) : (
              filteredPayments.map(fee => {
                const isSelected = selectedPayment?.id === fee.id;
                return (
                  <div
                    key={fee.id}
                    onClick={() => setSelectedPayment(fee)}
                    className={`p-4 hover:bg-slate-800/50 transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-slate-800/80 border-l-2 border-emerald-500' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-white">{fee.studentName}</p>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {fee.receiptNo}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 bg-slate-800 rounded text-slate-300 font-medium">{fee.className}</span>
                        <span>•</span>
                        <span>Sec: {fee.section}</span>
                        <span>•</span>
                        <span>Roll: {lang === 'bn' ? toBanglaDigits(fee.studentRoll) : fee.studentRoll}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{fee.month}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Txn: {fee.transactionRef || fee.transactionId || 'CASH-PAY'} via <strong className="text-slate-400">{fee.paymentMethod}</strong>
                        {fee.collectedBy && ` • Collector: ${fee.collectedBy}`}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-emerald-400 font-mono">
                        {formatCurrencyBDT(fee.netAmount || fee.amount || 0, lang)}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {(fee.paymentStatus || fee.status || 'paid').toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PRINTABLE OFFICIAL MONEY RECEIPT */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-300 shadow-md">
          {selectedPayment ? (
            <div className="space-y-4 printable-receipt text-xs text-slate-800 font-sans">
              
              {/* Receipt Header */}
              <div className="text-center pb-3 border-b-2 border-slate-900">
                <h3 className="font-extrabold text-slate-900 text-sm">{t.institutionNameBangla}</h3>
                <p className="text-[11px] font-bold text-slate-700">{t.institutionName}</p>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-slate-900 text-white font-extrabold text-[10px] tracking-wider uppercase">
                  {lang === 'bn' ? "অফিসিয়াল বেতন মানি রসিদ (Money Receipt)" : "Official Money Receipt"}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Receipt No: <span className="font-bold text-slate-900">{selectedPayment.receiptNo}</span> | Date: {selectedPayment.paymentDate || selectedPayment.paidDate || "2026-08-29"}
                </p>
              </div>

              {/* Student Details Matrix */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">Student Name:</span>
                    <span className="font-extrabold text-slate-900">{selectedPayment.studentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Class & Sec:</span>
                    <span className="font-bold text-slate-900">{selectedPayment.className} ({selectedPayment.section})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Roll Number:</span>
                    <span className="font-bold text-slate-900">{selectedPayment.studentRoll}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Fee Month:</span>
                    <span className="font-bold text-emerald-800">{selectedPayment.month}</span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2 text-right">Amount (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    <tr>
                      <td className="p-2">Monthly Tuition Fee ({selectedPayment.month})</td>
                      <td className="p-2 text-right font-mono font-bold">৳{selectedPayment.tuitionFee || selectedPayment.amount || 1500}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Term Examination & Evaluation Fee</td>
                      <td className="p-2 text-right font-mono font-bold">৳{selectedPayment.examFee || 500}</td>
                    </tr>
                    <tr>
                      <td className="p-2">Digital Lab & ICT Facility Charge</td>
                      <td className="p-2 text-right font-mono font-bold">৳{selectedPayment.labIctFee || 300}</td>
                    </tr>
                    {(selectedPayment.waiverDiscount || 0) > 0 && (
                      <tr className="text-emerald-700 bg-emerald-50 font-bold">
                        <td className="p-2">Special Merit Waiver / Scholarship Discount</td>
                        <td className="p-2 text-right font-mono">-৳{selectedPayment.waiverDiscount}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white font-extrabold">
                    <tr>
                      <td className="p-2 text-xs">Total Net Paid</td>
                      <td className="p-2 text-right text-xs font-mono">
                        {formatCurrencyBDT(selectedPayment.netAmount || selectedPayment.amount || 0, lang)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Method & Transaction Badge */}
              <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-lg text-[10px] text-slate-600 font-medium">
                <div>
                  <span>Method: <strong className="text-slate-900">{selectedPayment.paymentMethod}</strong></span>
                  <span className="block font-mono text-[9px] text-slate-500">Ref: {selectedPayment.transactionRef || selectedPayment.transactionId || 'CASH-PAY'}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[9px]">
                    VERIFIED & PAID
                  </span>
                </div>
              </div>

              {/* Receipt Signatures */}
              <div className="pt-8 flex justify-between items-end text-[9px] text-slate-500">
                <div className="text-center w-28">
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">Accounts Officer</div>
                  <span>{selectedPayment.collectedBy || "Authorized Cashier"}</span>
                </div>
                <div className="text-center w-28">
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-800">Headmaster</div>
                  <span>Seal & Signature</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p>Select a payment from the list to preview the official money receipt.</p>
            </div>
          )}
        </div>

      </div>

      {/* COLLECT FEE MODAL */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-xl p-6 max-w-lg w-full shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'bn' ? "নতুন বেতন ফি আদায় ও রশিদ প্রদান" : "Collect Student Fee & Issue Receipt"}</span>
              </h3>
              <button 
                onClick={() => setShowCollectModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Select Student</label>
                <select
                  value={collectStudentId}
                  onChange={(e) => setCollectStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      Roll {s.roll}: {s.nameEnglish} ({s.className} - {s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Fee Month</label>
                  <select
                    value={collectMonth}
                    onChange={(e) => setCollectMonth(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="August 2026">August 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="October 2026">October 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Tuition Fee (BDT)</label>
                  <input
                    type="number"
                    value={tuitionFee}
                    onChange={(e) => setTuitionFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Exam Fee (BDT)</label>
                  <input
                    type="number"
                    value={examFee}
                    onChange={(e) => setExamFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">ICT / Lab (BDT)</label>
                  <input
                    type="number"
                    value={ictFee}
                    onChange={(e) => setIctFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['bKash', 'Nagad', 'Cash', 'Bank'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 rounded-lg font-semibold border transition cursor-pointer ${
                        paymentMethod === m 
                          ? 'bg-slate-800 text-white border-slate-700 shadow-xs' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-300">
                <span>Net Total to Collect:</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {formatCurrencyBDT(totalPayable, lang)}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition shadow-xs cursor-pointer"
                >
                  Collect & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
