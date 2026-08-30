import React, { useState } from 'react';
import { 
  CreditCard, Printer, CheckCircle2, AlertCircle, 
  Clock, Plus, Filter, Search, Download, DollarSign,
  Building, Check, Send, ChevronRight, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits, formatCurrencyBDT } from '../translations';
import { TeacherPayroll } from '../types';

export const PayrollModule: React.FC = () => {
  const { 
    payrolls, 
    teachers, 
    disburseSalary, 
    approvePayroll, 
    generateMonthlyPayrollList, 
    lang, 
    currentUser 
  } = useApp();
  const t = translations[lang];

  const [selectedMonth, setSelectedMonth] = useState<string>("August 2026");
  const [selectedPayroll, setSelectedPayroll] = useState<TeacherPayroll | null>(payrolls[0] || null);
  const [showDisburseModal, setShowDisburseModal] = useState<boolean>(false);
  const [targetPayrollId, setTargetPayrollId] = useState<string | null>(null);
  const [disburseMethod, setDisburseMethod] = useState<'bKash' | 'Nagad' | 'Bank Transfer' | 'Cash'>('bKash');
  const [disburseTxnRef, setDisburseTxnRef] = useState<string>("");

  const filteredPayrolls = payrolls.filter(p => p.month === selectedMonth);

  const totalGross = filteredPayrolls.reduce((acc, p) => acc + p.grossSalary, 0);
  const totalNet = filteredPayrolls.reduce((acc, p) => acc + p.netPayable, 0);
  const totalDisbursed = filteredPayrolls.filter(p => p.status === 'disbursed').reduce((acc, p) => acc + p.netPayable, 0);
  const totalPending = filteredPayrolls.filter(p => p.status !== 'disbursed').reduce((acc, p) => acc + p.netPayable, 0);

  const handleOpenDisburse = (payrollId: string) => {
    setTargetPayrollId(payrollId);
    setDisburseTxnRef(`BKASH-PAY-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setShowDisburseModal(true);
  };

  const handleConfirmDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPayrollId) {
      disburseSalary(targetPayrollId, disburseMethod, disburseTxnRef);
      setShowDisburseModal(false);
      setTargetPayrollId(null);
    }
  };

  const handleGenerateNewMonth = () => {
    generateMonthlyPayrollList("September", "সেপ্টেম্বর", 2026);
    setSelectedMonth("September 2026");
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>{t.navPayroll}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "শিক্ষক ও কর্মকর্তা বেতন স্কেল, বাড়ি ভাড়া ও চিকিৎসা ভাতা, বিকাশ/ব্যাংক পে-রোল ও পে-স্লিপ" 
              : "Faculty salary scales in BDT (৳), allowances, bKash/Bank disbursements, and printable payslips"}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>{t.printPayslip}</span>
          </button>
          
          {(currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
            <button
              onClick={handleGenerateNewMonth}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'bn' ? "নতুন মাসের বেতন তৈরি" : "Generate Payroll"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Gross Budget</span>
          <p className="text-lg sm:text-xl font-bold text-white mt-1">
            {formatCurrencyBDT(totalGross, lang)}
          </p>
          <span className="text-[10px] text-slate-500">{filteredPayrolls.length} Faculty Members</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Net Payable</span>
          <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-1">
            {formatCurrencyBDT(totalNet, lang)}
          </p>
          <span className="text-[10px] text-emerald-500 font-semibold">After 10% PF Deductions</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Disbursed via Bank/bKash</span>
          <p className="text-lg sm:text-xl font-bold text-blue-400 mt-1">
            {formatCurrencyBDT(totalDisbursed, lang)}
          </p>
          <span className="text-[10px] text-blue-400 font-semibold">
            {filteredPayrolls.filter(p => p.status === 'disbursed').length} Vouchers Cleared
          </span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Pending Clearance</span>
          <p className="text-lg sm:text-xl font-bold text-amber-400 mt-1">
            {formatCurrencyBDT(totalPending, lang)}
          </p>
          <span className="text-[10px] text-amber-400 font-semibold">
            {filteredPayrolls.filter(p => p.status !== 'disbursed').length} Pending Approval
          </span>
        </div>
      </div>

      {/* Main Grid: Payroll List + Printable Payslip Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Payroll Vouchers Table */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden no-print">
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold">{lang === 'bn' ? "মাসিক বেতন ভাউচার তালিকা" : "Faculty Payroll Roster"}</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs bg-slate-900 text-white font-medium border border-slate-800 rounded-lg px-2.5 py-1 outline-hidden"
              >
                <option value="August 2026">August 2026 (আগস্ট ২০২৬)</option>
                <option value="September 2026">September 2026 (সেপ্টেম্বর ২০২৬)</option>
              </select>
            </div>
            <span className="text-[11px] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded font-bold text-emerald-400">
              BDT Scale 2026
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
            {filteredPayrolls.map((payroll) => {
              const isSelected = selectedPayroll?.id === payroll.id;
              return (
                <div 
                  key={payroll.id}
                  onClick={() => setSelectedPayroll(payroll)}
                  className={`p-4 hover:bg-slate-800/50 transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-slate-800/80 border-l-2 border-emerald-500' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white truncate">
                        {lang === 'bn' ? payroll.teacherNameBangla : payroll.teacherName}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500">
                        {payroll.voucherNo}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{payroll.designation}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      <span className="font-bold text-emerald-400 font-mono">
                        Net: {formatCurrencyBDT(payroll.netPayable, lang)}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">Method: {payroll.paymentMethod || 'Bank'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      payroll.status === 'disbursed' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      payroll.status === 'approved' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                      'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {(payroll.status || 'pending').toUpperCase()}
                    </span>

                    {payroll.status === 'pending' && (currentUser.role === 'super_admin' || currentUser.role === 'admin') && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); approvePayroll(payroll.id); }}
                        className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-500 transition cursor-pointer"
                      >
                        Approve
                      </button>
                    )}

                    {payroll.status === 'approved' && (currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'staff') && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleOpenDisburse(payroll.id); }}
                        className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-500 transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Send className="w-2.5 h-2.5" />
                        Disburse
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRINTABLE OFFICIAL PAYSLIP CARD */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-300 shadow-md">
          {selectedPayroll ? (
            <div className="space-y-4 printable-payslip text-xs text-slate-800">
              
              {/* Payslip Header */}
              <div className="text-center pb-3 border-b-2 border-slate-900">
                <h3 className="font-extrabold text-slate-900 text-sm">{t.institutionNameBangla}</h3>
                <p className="text-[11px] font-bold text-slate-700">{t.institutionName}</p>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-slate-900 text-white font-extrabold text-[10px] tracking-wider uppercase">
                  {lang === 'bn' ? "কর্মকর্তা / শিক্ষক মাসিক বেতন রসিদ" : "Official Monthly Payslip"}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Voucher: {selectedPayroll.voucherNo} | Month: {selectedPayroll.month}
                </p>
              </div>

              {/* Teacher Info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Employee Name</span>
                    <p className="font-extrabold text-slate-900">
                      {lang === 'bn' ? selectedPayroll.teacherNameBangla : selectedPayroll.teacherName}
                    </p>
                    <p className="text-[11px] text-slate-500">{selectedPayroll.designation}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Status</span>
                    <p className="font-bold text-emerald-800">{(selectedPayroll.status || 'pending').toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500">{selectedPayroll.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Earnings */}
                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <p className="font-extrabold text-emerald-900 text-[11px] mb-2 border-b border-emerald-200 pb-1">
                    {lang === 'bn' ? "প্রদেয় ভাতা সমূহ (Earnings)" : "Earnings"}
                  </p>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary:</span>
                      <span className="font-bold">{formatCurrencyBDT(selectedPayroll.basicSalary, lang)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">House Rent (40%):</span>
                      <span className="font-bold">{formatCurrencyBDT(selectedPayroll.houseRentAllowance, lang)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Medical Allowance:</span>
                      <span className="font-bold">{formatCurrencyBDT(selectedPayroll.medicalAllowance, lang)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Conveyance:</span>
                      <span className="font-bold">{formatCurrencyBDT(selectedPayroll.conveyanceAllowance, lang)}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-emerald-200 font-extrabold text-slate-900">
                      <span>Gross Total:</span>
                      <span>{formatCurrencyBDT(selectedPayroll.grossSalary, lang)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                  <p className="font-extrabold text-red-900 text-[11px] mb-2 border-b border-red-200 pb-1">
                    {lang === 'bn' ? "কর্তন সমূহ (Deductions)" : "Deductions"}
                  </p>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Provident Fund (10%):</span>
                      <span className="font-bold">{formatCurrencyBDT(selectedPayroll.providentFundDeduction, lang)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Income Tax:</span>
                      <span className="font-bold">{formatCurrencyBDT(selectedPayroll.taxDeduction, lang)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Advance/Loan:</span>
                      <span className="font-bold">{formatCurrencyBDT(selectedPayroll.advanceLoanDeduction, lang)}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-red-200 font-extrabold text-slate-900">
                      <span>Total Deductions:</span>
                      <span>{formatCurrencyBDT(selectedPayroll.totalDeductions, lang)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Net Payable Banner */}
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase">Net Disbursed Amount</span>
                  <p className="text-base font-black text-amber-300">
                    {formatCurrencyBDT(selectedPayroll.netPayable, lang)}
                  </p>
                </div>
                {selectedPayroll.transactionRef && (
                  <div className="text-right text-[10px] text-slate-300">
                    <p>Ref: {selectedPayroll.transactionRef}</p>
                    <p>{selectedPayroll.disbursedDate}</p>
                  </div>
                )}
              </div>

              {/* Signature Lines */}
              <div className="grid grid-cols-2 pt-10 text-center text-[10px] text-slate-600">
                <div className="border-t border-slate-400 pt-1 mx-2">
                  <p className="font-bold">হিসাব কর্মকর্তার স্বাক্ষর</p>
                  <p className="text-slate-400">Accounts Officer</p>
                </div>
                <div className="border-t border-slate-400 pt-1 mx-2">
                  <p className="font-bold">প্রধান শিক্ষক ও অধ্যক্ষের সিল</p>
                  <p className="text-slate-400">Headmaster Approval</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Select a payroll record to view and print payslip.
            </div>
          )}
        </div>

      </div>

      {/* Disburse Modal */}
      {showDisburseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-800 animate-in fade-in">
            <h3 className="text-base font-semibold text-white mb-1">Confirm Faculty Salary Disbursement</h3>
            <p className="text-xs text-slate-400 mb-4">Execute direct payout via corporate banking or mobile wallet.</p>

            <form onSubmit={handleConfirmDisburse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Payment Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['bKash', 'Nagad', 'Bank Transfer', 'Cash'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        setDisburseMethod(method);
                        setDisburseTxnRef(`${method.toUpperCase()}-PAY-${Math.floor(100000 + Math.random() * 900000)}`);
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        disburseMethod === method 
                          ? 'bg-slate-800 text-white border-slate-700 shadow-xs' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Transaction Reference / Voucher ID</label>
                <input
                  type="text"
                  value={disburseTxnRef}
                  onChange={(e) => setDisburseTxnRef(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisburseModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Disburse</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
