import React, { useState } from 'react';
import { 
  Receipt, Printer, CheckCircle2, Plus, 
  Search, Filter, CreditCard, DollarSign, 
  Download, Calendar, ShieldCheck, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits, formatCurrencyBDT } from '../translations';
import { StudentFeePayment } from '../types';

export const FeesModule: React.FC = () => {
  const { students, feePayments, recordFeePayment, lang, currentUser } = useApp();
  const t = translations[lang];

  const [selectedPayment, setSelectedPayment] = useState<StudentFeePayment | null>(feePayments[0] || null);
  const [showCollectModal, setShowCollectModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Collection Form State
  const [collectStudentId, setCollectStudentId] = useState<string>(students[0]?.id || "std-001");
  const [collectMonth, setCollectMonth] = useState<string>("September 2026");
  const [tuitionFee, setTuitionFee] = useState<number>(1500);
  const [examFee, setExamFee] = useState<number>(500);
  const [ictFee, setIctFee] = useState<number>(300);
  const [waiver, setWaiver] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Cash' | 'Bank'>('bKash');

  const totalPayable = tuitionFee + examFee + ictFee - waiver;

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

  const filteredPayments = feePayments.filter(f => {
    const term = (searchTerm || '').toLowerCase();
    return (f.studentName || '').toLowerCase().includes(term) ||
      (f.receiptNo || '').toLowerCase().includes(term) ||
      (f.className || '').toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            <span>{t.navFees}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "শিক্ষার্থী বেতন আদায়, বিকাশ/নগদ অটো-পেমেন্ট ও প্রিন্টযোগ্য মানি রিসিট" 
              : "Student fee collection, automated bKash/Nagad payments, and official money receipts"}
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

      {/* Main Grid: Payment History + Official Money Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Payment History List */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden no-print">
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <h2 className="text-sm font-semibold">{lang === 'bn' ? "বেতন আদায়ের হিসেব ও রশিদ তালিকা" : "Collected Fee Invoices"}</h2>
            <span className="text-xs text-emerald-400 font-mono">
              {filteredPayments.length} Receipts
            </span>
          </div>

          <div className="p-3 border-b border-slate-800 bg-slate-900">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={lang === 'bn' ? "শিক্ষার্থীর নাম বা রশিদ নম্বর..." : "Search student or receipt no..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
            {filteredPayments.map(fee => {
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
                      <span className="text-[10px] font-mono text-slate-500">{fee.receiptNo}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {fee.className} ({fee.section}) • Roll: {fee.studentRoll} • {fee.month}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Txn: {fee.transactionRef} via {fee.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400 font-mono">
                      {formatCurrencyBDT(fee.netAmount, lang)}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {(fee.paymentStatus || 'paid').toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
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
                  {lang === 'bn' ? "অফিসিয়াল বেতন মানি রসিদ (Money Receipt)" : "Official Money Receipt"}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Receipt No: <span className="font-bold text-slate-900">{selectedPayment.receiptNo}</span> | Date: {selectedPayment.paymentDate}
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
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3">Tuition Fee (মাসিক টিউশন ফি)</td>
                      <td className="py-2 px-3 text-right font-semibold">{formatCurrencyBDT(selectedPayment.tuitionFee, lang)}</td>
                    </tr>
                    {selectedPayment.examFee > 0 && (
                      <tr>
                        <td className="py-2 px-3">Exam Fee (পরীক্ষার ফি)</td>
                        <td className="py-2 px-3 text-right font-semibold">{formatCurrencyBDT(selectedPayment.examFee, lang)}</td>
                      </tr>
                    )}
                    {selectedPayment.labIctFee > 0 && (
                      <tr>
                        <td className="py-2 px-3">ICT / Lab Session Fee</td>
                        <td className="py-2 px-3 text-right font-semibold">{formatCurrencyBDT(selectedPayment.labIctFee, lang)}</td>
                      </tr>
                    )}
                    {selectedPayment.waiverDiscount > 0 && (
                      <tr className="text-emerald-700">
                        <td className="py-2 px-3">Special Waiver / Merit Scholarship</td>
                        <td className="py-2 px-3 text-right font-bold">-{formatCurrencyBDT(selectedPayment.waiverDiscount, lang)}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-900 text-white font-extrabold text-xs">
                      <td className="py-2.5 px-3">Total Paid (পরিশোধিত অর্থ)</td>
                      <td className="py-2.5 px-3 text-right text-amber-300">
                        {formatCurrencyBDT(selectedPayment.netAmount, lang)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Transaction Footer */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] flex justify-between items-center text-emerald-900">
                <div>
                  <span className="font-bold">Payment Method: {selectedPayment.paymentMethod}</span>
                  <p className="font-mono text-slate-600">Txn ID: {selectedPayment.transactionRef}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                  CLEARED
                </span>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-8 text-center text-[10px] text-slate-600">
                <div className="border-t border-slate-400 pt-1 mx-2">
                  <p className="font-bold">হিসাব শাখায় গ্রহণকারী</p>
                  <p className="text-slate-400">Cashier / Collector</p>
                </div>
                <div className="border-t border-slate-400 pt-1 mx-2">
                  <p className="font-bold">প্রধান শিক্ষক ও সিল</p>
                  <p className="text-slate-400">Headmaster Official Seal</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Select an invoice to preview printable money receipt.
            </div>
          )}
        </div>

      </div>

      {/* COLLECT FEE MODAL */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-800">
            <h3 className="text-base font-semibold text-white mb-1">Student Fee Collection Entry</h3>
            <p className="text-xs text-slate-400 mb-4">Record tuition, exams, and lab fees with automatic receipt generation.</p>

            <form onSubmit={handleRecordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Select Student</label>
                <select
                  value={collectStudentId}
                  onChange={(e) => setCollectStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      Roll {s.roll}: {s.nameEnglish} ({s.className})
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
