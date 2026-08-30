import React, { useState } from 'react';
import { 
  History, ShieldCheck, Lock, Search, Filter, 
  Download, Eye, RefreshCw, KeyRound, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits } from '../translations';

export const AuditLogsModule: React.FC = () => {
  const { auditLogs, lang } = useApp();
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("all");

  const filteredLogs = auditLogs.filter(log => {
    const term = (searchTerm || '').toLowerCase();
    const matchesSearch = (log.action || '').toLowerCase().includes(term) ||
      (log.userName || '').toLowerCase().includes(term) ||
      (log.details || '').toLowerCase().includes(term) ||
      (log.ipAddress || '').includes(searchTerm);
    const matchesModule = selectedModule === 'all' || log.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            <span>{t.navAuditLogs}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "অপরিবর্তনযোগ্য অডিট ট্রেইল, AES-256 এনক্রিপ্ট করা সংবেদনশীল ফিল্ড ও জিডিপিআর কমপ্লায়েন্স" 
              : "Immutable audit trail with AES-256 encrypted field hashing and GDPR-compliant security logs"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? "অডিট রিপোর্ট এক্সপোর্ট" : "Export Audit Report"}</span>
          </button>
        </div>
      </div>

      {/* Security Architecture Badge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs text-white">AES-256-GCM Encryption</p>
            <p className="text-[11px] text-slate-400">Student NID & BRN stored with encrypted keys</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs text-white">Role-Based Access Control</p>
            <p className="text-[11px] text-slate-400">Strict permission barrier across all endpoints</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs text-white">Immutable Activity Stream</p>
            <p className="text-[11px] text-slate-400">Every grade, mark, and payroll modification logged</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'bn' ? "লগ খুঁজুন..." : "Search action, user, IP..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-lg outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden cursor-pointer"
          >
            <option value="all">All Modules</option>
            <option value="attendance">Attendance</option>
            <option value="gradebook">Gradebook</option>
            <option value="payroll">Payroll</option>
            <option value="students">Students</option>
            <option value="sms_gateway">SMS Gateway</option>
            <option value="authentication">Auth</option>
          </select>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{log.userName}</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {(log.userRole || 'admin').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {log.action}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-sm text-slate-400 leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
