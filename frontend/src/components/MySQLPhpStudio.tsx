import React, { useState } from 'react';
import { 
  Database, Code2, Download, Copy, Check, 
  Server, ShieldCheck, Sparkles, Terminal, FileCode,
  PackageCheck, FolderArchive, Layers, ArrowRight, ExternalLink
} from 'lucide-react';
import { generateMySQLSchemaSQL, generatePHPBackendCode } from '../utils/sqlPhpGenerator';
import { downloadCompleteProjectZip } from '../utils/zipExporter';
import { useApp } from '../context/AppContext';

export const MySQLPhpStudio: React.FC = () => {
  const { lang } = useApp();
  const [activeTab, setActiveTab] = useState<'sql' | 'php'>('sql');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const sqlCode = generateMySQLSchemaSQL();
  const phpCode = generatePHPBackendCode();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullZip = async () => {
    setIsZipping(true);
    try {
      await downloadCompleteProjectZip();
    } catch (err) {
      console.error("ZIP download error:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            <span>{lang === 'bn' ? "মাইএসকিউএল ও পিএইচপি ব্যাকএন্ড স্টুডিও" : "MySQL & PHP 8.2 Backend Studio"}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "প্রোডাকশন-রেডি MySQL DDL স্কিমা এবং পিএইচপি পিডিও (PDO) রেস্ট এপিআই সোর্স কোড জেনারেটর" 
              : "Ready-to-deploy MySQL schema for phpMyAdmin with utf8mb4 Bangla support & PHP 8.2 PDO REST backend"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-download-full-project-zip"
            onClick={handleDownloadFullZip}
            disabled={isZipping}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
          >
            <FolderArchive className="w-4 h-4" />
            <span>{isZipping ? (lang === 'bn' ? "জিপ প্রস্তুত হচ্ছে..." : "Preparing ZIP...") : (lang === 'bn' ? "সম্পূর্ণ প্রজেক্ট জিপ ডাউনলোড (.ZIP)" : "Download Full Project (.ZIP)")}</span>
          </button>

          <button
            onClick={() => handleCopy(activeTab === 'sql' ? sqlCode : phpCode)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
          
          <button
            onClick={() => handleDownloadSingle(activeTab === 'sql' ? 'sonar_pathshala_schema.sql' : 'api_backend.php', activeTab === 'sql' ? sqlCode : phpCode)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>{activeTab === 'sql' ? ".SQL" : ".PHP"}</span>
          </button>
        </div>
      </div>

      {/* Hero Download Card */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/60 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-emerald-600/20 border border-emerald-500/40 rounded-xl text-emerald-400 shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {lang === 'bn' ? "পূর্ণাঙ্গ প্রজেক্ট প্যাকেজ (.ZIP) সংকলন" : "Complete Full-Stack ERP Archive (.ZIP)"}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                {lang === 'bn' 
                  ? "প্যাকেজে রয়েছে: ১) রিয়্যাক্ট ১৯ + টাইপস্ক্রিপ্ট ফ্রন্টএন্ড, ২) পিএইচপি ৮.২ পিডিও আরইএসটি ব্যাকএন্ড এপিআই ও নোড সার্ভার, ৩) মাইএসকিউএল ৮.০ ডিডিএল স্কিমা (বাংলা ও বিডিআরআইএস সমর্থনসহ), ৪) ডকার কম্পোজ এবং ইন্সটলেশন নির্দেশিকা।"
                  : "Package includes: 1) React 19 + TypeScript frontend source, 2) PHP 8.2 PDO REST backend + Express server, 3) MySQL 8.0 DDL schema with Bangla unicode & seed data, 4) Docker Compose & phpMyAdmin guides."}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-emerald-400" /> Frontend + Backend + Database</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Argon2id & AES-256</span>
                <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5 text-purple-400" /> phpMyAdmin / cPanel / Docker</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
            <a
              href="/sonarpathshala_complete_project.zip"
              download="sonarpathshala_complete_project.zip"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'bn' ? "জিপ ফাইল ডাউনলোড করুন (125 KB)" : "Direct ZIP Download (125 KB)"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-white">Full phpMyAdmin & CPanel / LAMP / XAMPP Compatibility</p>
            <p className="text-slate-400 text-[11px]">
              Strict Foreign Key Constraints, Indexed roll numbers, utf8mb4_unicode_ci for native Bangla, Argon2id security.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
          <ShieldCheck className="w-4 h-4" />
          <span>Prepared PDO Queries</span>
        </div>
      </div>

      {/* Code Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('sql')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'sql' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MySQL 8.0+ DDL Schema (schema.sql)</span>
        </button>

        <button
          onClick={() => setActiveTab('php')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'php' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>PHP 8.2+ PDO REST API Endpoints (api.php)</span>
        </button>
      </div>

      {/* Code Display Console */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-slate-200 font-semibold">
              {activeTab === 'sql' ? 'sonar_pathshala_schema.sql' : 'backend_api.php'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">UTF-8 • Production Ready</span>
        </div>

        <pre className="p-5 text-xs text-emerald-400 font-mono overflow-x-auto max-h-[600px] leading-relaxed select-all">
          {activeTab === 'sql' ? sqlCode : phpCode}
        </pre>
      </div>

    </div>
  );
};
