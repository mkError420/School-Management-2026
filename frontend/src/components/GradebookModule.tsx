import React, { useState } from 'react';
import { 
  Award, Printer, Download, Plus, CheckCircle2, 
  FileSpreadsheet, Sparkles, BookOpen, AlertCircle, 
  User, Check, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits } from '../translations';
import { ExamGradeRecord, SubjectMarks } from '../types';

export const GradebookModule: React.FC = () => {
  const { students, grades, publishExamGrade, lang, currentUser } = useApp();
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'view_marksheet' | 'entry' | 'tabulation'>('view_marksheet');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(grades[0]?.studentId || students[0]?.id || "std-001");
  const [selectedExamType, setSelectedExamType] = useState<ExamGradeRecord['examType']>("mid_term");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedClass, setSelectedClass] = useState<string>("Class 9");
  const [selectedSection, setSelectedSection] = useState<string>("Padma");

  // Selected student record
  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const activeGradeRecord = grades.find(g => g.studentId === selectedStudentId && g.examType === selectedExamType);

  // New Grade Entry Form State
  const defaultSubjects: SubjectMarks[] = [
    { subjectCode: "101", subjectName: "Bangla 1st Paper", subjectNameBangla: "বাংলা ১ম পত্র", writtenMarks: 55, mcqMarks: 25, practicalMarks: 0, obtainedMarks: 80, fullMarks: 100, grade: "A+", gradePoint: 5.0 },
    { subjectCode: "102", subjectName: "Bangla 2nd Paper", subjectNameBangla: "বাংলা ২য় পত্র", writtenMarks: 58, mcqMarks: 26, practicalMarks: 0, obtainedMarks: 84, fullMarks: 100, grade: "A+", gradePoint: 5.0 },
    { subjectCode: "107", subjectName: "English 1st Paper", subjectNameBangla: "ইংরেজি ১ম পত্র", writtenMarks: 80, mcqMarks: 0, practicalMarks: 0, obtainedMarks: 80, fullMarks: 100, grade: "A+", gradePoint: 5.0 },
    { subjectCode: "108", subjectName: "English 2nd Paper", subjectNameBangla: "ইংরেজি ২য় পত্র", writtenMarks: 85, mcqMarks: 0, practicalMarks: 0, obtainedMarks: 85, fullMarks: 100, grade: "A+", gradePoint: 5.0 },
    { subjectCode: "109", subjectName: "General Mathematics", subjectNameBangla: "সাধারণ গণিত", writtenMarks: 60, mcqMarks: 25, practicalMarks: 0, obtainedMarks: 85, fullMarks: 100, grade: "A+", gradePoint: 5.0 },
    { subjectCode: "136", subjectName: "Physics", subjectNameBangla: "পদার্থবিজ্ঞান", writtenMarks: 40, mcqMarks: 20, practicalMarks: 22, obtainedMarks: 82, fullMarks: 100, grade: "A+", gradePoint: 5.0 },
    { subjectCode: "137", subjectName: "Chemistry", subjectNameBangla: "রসায়ন", writtenMarks: 42, mcqMarks: 20, practicalMarks: 20, obtainedMarks: 82, fullMarks: 100, grade: "A+", gradePoint: 5.0 },
    { subjectCode: "126", subjectName: "Higher Mathematics (4th Subject)", subjectNameBangla: "উচ্চতর গণিত (৪র্থ বিষয়)", writtenMarks: 40, mcqMarks: 20, practicalMarks: 20, obtainedMarks: 80, fullMarks: 100, grade: "A+", gradePoint: 5.0, isOptional: true }
  ];

  const [entrySubjects, setEntrySubjects] = useState<SubjectMarks[]>(defaultSubjects);
  const [entryRemarks, setEntryRemarks] = useState<string>("Attentive and disciplined student.");

  // NCTB Grade conversion helper
  const calculateSubjectGrade = (marks: number): { grade: SubjectMarks['grade']; gp: number } => {
    if (marks >= 80) return { grade: 'A+', gp: 5.0 };
    if (marks >= 70) return { grade: 'A', gp: 4.0 };
    if (marks >= 60) return { grade: 'A-', gp: 3.5 };
    if (marks >= 50) return { grade: 'B', gp: 3.0 };
    if (marks >= 40) return { grade: 'C', gp: 2.0 };
    if (marks >= 33) return { grade: 'D', gp: 1.0 };
    return { grade: 'F', gp: 0.0 };
  };

  const handleSubjectMarkChange = (index: number, field: 'writtenMarks' | 'mcqMarks' | 'practicalMarks', value: number) => {
    setEntrySubjects(prev => {
      const updated = [...prev];
      const sub = { ...updated[index], [field]: value };
      const total = Number(sub.writtenMarks || 0) + Number(sub.mcqMarks || 0) + Number(sub.practicalMarks || 0);
      const { grade, gp } = calculateSubjectGrade(total);
      sub.obtainedMarks = total;
      sub.grade = grade;
      sub.gradePoint = gp;
      updated[index] = sub;
      return updated;
    });
  };

  // Compute Overall GPA (handling 4th subject)
  const computeOverallResults = (subs: SubjectMarks[]) => {
    const mainSubs = subs.filter(s => !s.isOptional);
    const fourthSub = subs.find(s => s.isOptional);

    const hasFailed = subs.some(s => !s.isOptional && s.grade === 'F');
    const totalMarks = subs.reduce((acc, s) => acc + s.obtainedMarks, 0);
    const totalFullMarks = subs.reduce((acc, s) => acc + s.fullMarks, 0);

    if (hasFailed) {
      return { gpa: 0.0, finalGrade: 'F' as const, isPassed: false, totalMarks, totalFullMarks };
    }

    const mainGpSum = mainSubs.reduce((acc, s) => acc + s.gradePoint, 0);
    let fourthBonus = 0;
    if (fourthSub && fourthSub.gradePoint > 2.0) {
      fourthBonus = fourthSub.gradePoint - 2.0;
    }

    const gpaRaw = (mainGpSum + fourthBonus) / (mainSubs.length || 1);
    const finalGpa = Math.min(5.0, Number((gpaRaw || 0).toFixed(2)));

    let finalGrade: SubjectMarks['grade'] = 'F';
    if (finalGpa >= 5.0) finalGrade = 'A+';
    else if (finalGpa >= 4.0) finalGrade = 'A';
    else if (finalGpa >= 3.5) finalGrade = 'A-';
    else if (finalGpa >= 3.0) finalGrade = 'B';
    else if (finalGpa >= 2.0) finalGrade = 'C';
    else if (finalGpa >= 1.0) finalGrade = 'D';

    return { gpa: finalGpa, finalGrade, isPassed: true, totalMarks, totalFullMarks };
  };

  const handlePublishGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const result = computeOverallResults(entrySubjects);

    publishExamGrade({
      studentId: currentStudent.id,
      studentName: currentStudent.nameEnglish,
      studentRoll: currentStudent.roll,
      className: currentStudent.className,
      section: currentStudent.section,
      examType: selectedExamType,
      examYear: selectedYear,
      subjects: entrySubjects,
      totalMarks: result.totalMarks,
      totalFullMarks: result.totalFullMarks,
      percentage: Number((((result.totalMarks || 0) / (result.totalFullMarks || 1)) * 100).toFixed(1)),
      gpa: result.gpa,
      finalGrade: result.finalGrade,
      isPassed: result.isPassed,
      positionInClass: 1,
      positionInSection: 1,
      attendancePercentage: currentStudent.attendanceRate,
      conductRemarks: entryRemarks
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setActiveTab('view_marksheet');
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            <span>{t.navGradebook}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি) জিপিএ ৫.০ গ্রেডিং স্কেল ও নম্বরপত্র" 
              : "NCTB GPA 5.0 standard grading system, tabulation sheets, and official marksheets"}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>{t.print}</span>
          </button>
          
          {currentUser.role !== 'guardian' && currentUser.role !== 'student' && (
            <button
              onClick={() => setActiveTab('entry')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'bn' ? "নম্বর এন্ট্রি করুন" : "Enter Exam Marks"}</span>
            </button>
          )}
        </div>
      </div>

      {/* NCTB Grading Scale Legend Ribbon */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 text-xs shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {t.nctbGradingScale}
          </span>
          <span className="text-[11px] text-slate-400">
            {lang === 'bn' ? "৪র্থ বিষয়ের ২.০ এর অতিরিক্ত পয়েন্ট জিপিএ-তে যুক্ত হয়" : "Points above 2.0 in 4th subject are added to GPA formula"}
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-[11px]">
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <p className="font-semibold text-emerald-400">80 - 100</p>
            <p className="text-white font-bold">A+ (5.00)</p>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <p className="font-semibold text-slate-400">70 - 79</p>
            <p className="text-white font-bold">A (4.00)</p>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <p className="font-semibold text-slate-400">60 - 69</p>
            <p className="text-white font-bold">A- (3.50)</p>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <p className="font-semibold text-slate-400">50 - 59</p>
            <p className="text-white font-bold">B (3.00)</p>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <p className="font-semibold text-slate-400">40 - 49</p>
            <p className="text-white font-bold">C (2.00)</p>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <p className="font-semibold text-slate-400">33 - 39</p>
            <p className="text-white font-bold">D (1.00)</p>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <p className="font-semibold text-red-400">00 - 32</p>
            <p className="text-white font-bold">F (0.00)</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold no-print">
        <button
          onClick={() => setActiveTab('view_marksheet')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'view_marksheet' 
              ? 'border-emerald-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t.viewMarksheet}</span>
        </button>

        <button
          onClick={() => setActiveTab('tabulation')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'tabulation' 
              ? 'border-emerald-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{t.generateTabulationSheet}</span>
        </button>

        {currentUser.role !== 'guardian' && currentUser.role !== 'student' && (
          <button
            onClick={() => setActiveTab('entry')}
            className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'entry' 
                ? 'border-emerald-500 text-white' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? "নতুন পরীক্ষা মূল্যায়ন" : "New Mark Entry"}</span>
          </button>
        )}
      </div>

      {/* TAB 1: OFFICIAL ACADEMIC PROGRESS REPORT (MARKSHEET) */}
      {activeTab === 'view_marksheet' && (
        <div className="space-y-6">
          
          {/* Selector Filter Ribbon */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      Roll {s.roll}: {lang === 'bn' ? s.nameBangla : s.nameEnglish} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t.examTerm}</label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value as any)}
                  className="text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                >
                  <option value="mid_term">{t.midTerm}</option>
                  <option value="1st_term">{t.firstTerm}</option>
                  <option value="final">{t.finalExam}</option>
                  <option value="model_test">{t.modelTest}</option>
                </select>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Published Status:</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Official Result
              </span>
            </div>
          </div>

          {/* PRINTABLE OFFICIAL MARKSHEET CARD */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-lg max-w-4xl mx-auto printable-marksheet font-sans">
            
            {/* Marksheet Institutional Header */}
            <div className="text-center border-b-2 border-emerald-800 pb-4 relative">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="w-14 h-14 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-xl border-2 border-amber-400 shadow-inner">
                  BD
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {t.institutionNameBangla}
                  </h2>
                  <p className="text-xs font-bold text-slate-700">
                    {t.institutionName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t.institutionEIIN} | Established: 1984
                  </p>
                </div>
              </div>

              <div className="inline-block mt-2 px-4 py-1 rounded-full bg-emerald-800 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs">
                {lang === 'bn' ? "একাডেমিক প্রগ্রেস রিপোর্ট ও নম্বরপত্র" : "Academic Progress Report & Marksheet"}
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1">
                {selectedExamType === 'mid_term' ? t.midTerm : selectedExamType === 'final' ? t.finalExam : t.firstTerm} - {selectedYear}
              </p>
            </div>

            {/* Student Biodata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {lang === 'bn' ? currentStudent.nameBangla : currentStudent.nameEnglish}
                </span>
                <span className="text-[11px] text-slate-500 block">ID: {currentStudent.studentCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Class & Section</span>
                <span className="font-bold text-slate-900">
                  {currentStudent.className} ({currentStudent.section})
                </span>
                <span className="text-[11px] text-emerald-800 font-bold block">
                  Roll: {lang === 'bn' ? toBanglaDigits(currentStudent.roll) : currentStudent.roll}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Guardian Name</span>
                <span className="font-bold text-slate-900">{currentStudent.guardianName}</span>
                <span className="text-[11px] text-slate-500 block">{currentStudent.guardianPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Attendance Rate</span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  {lang === 'bn' ? `${toBanglaDigits(currentStudent.attendanceRate)}%` : `${currentStudent.attendanceRate}%`}
                </span>
                <span className="text-[10px] text-slate-400 block">Punctual & Regular</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-slate-300">Code</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">{t.subject}</th>
                    <th className="py-2.5 px-2 text-center border-r border-slate-300">Full</th>
                    <th className="py-2.5 px-2 text-center border-r border-slate-300">{t.writtenMarks}</th>
                    <th className="py-2.5 px-2 text-center border-r border-slate-300">{t.mcqMarks}</th>
                    <th className="py-2.5 px-2 text-center border-r border-slate-300">{t.practicalMarks}</th>
                    <th className="py-2.5 px-2 text-center border-r border-slate-300 font-extrabold">{t.totalMarks}</th>
                    <th className="py-2.5 px-2 text-center border-r border-slate-300">{t.letterGrade}</th>
                    <th className="py-2.5 px-2 text-center font-bold">{t.gradePoint}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(activeGradeRecord?.subjects || defaultSubjects).map((sub) => (
                    <tr key={sub.subjectCode} className={sub.isOptional ? "bg-amber-50/50" : ""}>
                      <td className="py-2 px-3 border-r border-slate-300 font-mono text-[11px] text-slate-500">{sub.subjectCode}</td>
                      <td className="py-2 px-3 border-r border-slate-300 font-bold text-slate-800">
                        {lang === 'bn' ? sub.subjectNameBangla : sub.subjectName}
                        {sub.isOptional && <span className="ml-1 text-[10px] text-amber-700 font-normal">(4th Subject)</span>}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-slate-300 text-slate-500">{sub.fullMarks}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-300">{sub.writtenMarks}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-300">{sub.mcqMarks || '-'}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-300">{sub.practicalMarks || '-'}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-300 font-extrabold text-slate-900">{sub.obtainedMarks}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-300 font-black text-emerald-800">{sub.grade}</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-800">{(sub.gradePoint ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* GPA Summary & Merit Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 p-4 rounded-xl bg-slate-900 text-white text-center">
              <div className="border-b sm:border-b-0 sm:border-r border-slate-700 pb-3 sm:pb-0">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Marks Obtained</span>
                <p className="text-xl font-black text-white mt-1">
                  {activeGradeRecord?.totalMarks || 735} <span className="text-xs text-slate-400">/ 800</span>
                </p>
                <span className="text-[10px] text-emerald-400 font-semibold">91.8% Overall Score</span>
              </div>

              <div className="border-b sm:border-b-0 sm:border-r border-slate-700 pb-3 sm:pb-0">
                <span className="text-[10px] uppercase font-bold text-amber-300">Grade Point Average (GPA)</span>
                <p className="text-2xl font-black text-amber-300 mt-0.5">
                  GPA {(activeGradeRecord?.gpa || 5.0).toFixed(2)}
                </p>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-800 text-emerald-100">
                  Grade: {activeGradeRecord?.finalGrade || 'A+'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Merit Position & Result</span>
                <p className="text-xl font-black text-emerald-400 mt-1">
                  {lang === 'bn' ? "উত্তীর্ণ (১ম স্থান)" : "PASSED (1st Merit)"}
                </p>
                <span className="text-[10px] text-slate-300 font-medium">Class: 1st | Section: 1st</span>
              </div>
            </div>

            {/* Teacher's Evaluation & Signatures */}
            <div className="mt-8 pt-4 border-t border-slate-200">
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 mb-12">
                <span className="font-bold text-slate-900 block mb-0.5">শ্রেণি শিক্ষকের মন্তব্য (Conduct Remarks):</span>
                <p className="italic text-slate-600">
                  "{activeGradeRecord?.conductRemarks || 'অত্যন্ত মনোযোগী ও শৃঙ্খলাপরায়ণ শিক্ষার্থী। গণিত ও বিজ্ঞান ক্লাবে সক্রিয় অংশগ্রহণ প্রশংসনীয়।'}"
                </p>
              </div>

              <div className="grid grid-cols-3 text-center text-xs text-slate-700 pt-8">
                <div className="border-t border-slate-800 pt-1 mx-4">
                  <p className="font-bold">অভিভাবকের স্বাক্ষর</p>
                  <p className="text-[10px] text-slate-400">Guardian Signature</p>
                </div>
                <div className="border-t border-slate-800 pt-1 mx-4">
                  <p className="font-bold">শ্রেণি শিক্ষকের স্বাক্ষর</p>
                  <p className="text-[10px] text-slate-400">Class Teacher</p>
                </div>
                <div className="border-t border-slate-800 pt-1 mx-4">
                  <p className="font-bold text-emerald-900">অধ্যক্ষ / প্রধান শিক্ষকের সিল</p>
                  <p className="text-[10px] text-slate-400">Principal & Seal</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: TABULATION SHEET */}
      {activeTab === 'tabulation' && (
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-white">
                {lang === 'bn' ? `${selectedClass} (${selectedSection}) সমন্বিত ট্যাবুলেশন শিট ২০২৬` : `${selectedClass} (${selectedSection}) Tabulation Sheet 2026`}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? "সকল শিক্ষার্থীর বিষয়ভিত্তিক নম্বর ও জিপিএ এক নজরে" : "Subject-wise marks and GPA for all students"}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'bn' ? "ট্যাবুলেশন শিট প্রিন্ট" : "Print Tabulation Sheet"}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800">
              <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-800 text-center">Roll</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">Student Name</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">Bangla</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">English</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">Math</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">Physics</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">Chemistry</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">Total</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800 font-extrabold text-emerald-400">GPA</th>
                  <th className="py-2.5 px-2 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 text-center font-bold text-white border-r border-slate-800">{std.roll}</td>
                    <td className="py-2 px-3 border-r border-slate-800 font-medium text-slate-200">
                      {lang === 'bn' ? std.nameBangla : std.nameEnglish}
                    </td>
                    <td className="py-2 px-2 text-center border-r border-slate-800 text-slate-300">177</td>
                    <td className="py-2 px-2 text-center border-r border-slate-800 text-slate-300">180</td>
                    <td className="py-2 px-2 text-center border-r border-slate-800 text-slate-300">97</td>
                    <td className="py-2 px-2 text-center border-r border-slate-800 text-slate-300">91</td>
                    <td className="py-2 px-2 text-center border-r border-slate-800 text-slate-300">95</td>
                    <td className="py-2 px-2 text-center border-r border-slate-800 font-bold text-white">735</td>
                    <td className="py-2 px-2 text-center border-r border-slate-800 font-bold text-emerald-400 font-mono">5.00</td>
                    <td className="py-2 px-2 text-center font-bold text-emerald-400">PASSED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: NEW MARK ENTRY */}
      {activeTab === 'entry' && (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xs max-w-4xl mx-auto">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {lang === 'bn' ? "শিক্ষার্থীর বিষয়ভিত্তিক পরীক্ষার নম্বর এন্ট্রি" : "Enter Subject-wise Exam Marks"}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? "সৃজনশীল (CQ), নৈর্ব্যক্তিক (MCQ) ও ব্যবহারিক নম্বর প্রদান ও জিপিএ হিসাব" : "Enter CQ, MCQ, and Practical marks with automatic GPA computation"}
              </p>
            </div>
          </div>

          <form onSubmit={handlePublishGrade} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      Roll {s.roll}: {s.nameEnglish} ({s.className})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{t.examTerm}</label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value as any)}
                  className="w-full text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="mid_term">{t.midTerm}</option>
                  <option value="1st_term">{t.firstTerm}</option>
                  <option value="final">{t.finalExam}</option>
                  <option value="model_test">{t.modelTest}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Academic Year</label>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full text-xs font-medium bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Marks Input Table */}
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs border border-slate-800">
                <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-2 text-center">CQ (Written)</th>
                    <th className="py-2.5 px-2 text-center">MCQ</th>
                    <th className="py-2.5 px-2 text-center">Practical</th>
                    <th className="py-2.5 px-2 text-center font-bold">Total</th>
                    <th className="py-2.5 px-2 text-center font-bold">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {entrySubjects.map((sub, idx) => (
                    <tr key={sub.subjectCode} className={sub.isOptional ? "bg-slate-950/60" : ""}>
                      <td className="py-2 px-3 font-semibold text-slate-200">
                        {sub.subjectName}
                        {sub.isOptional && <span className="ml-1 text-[10px] text-amber-400">(4th Sub)</span>}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={70}
                          value={sub.writtenMarks}
                          onChange={(e) => handleSubjectMarkChange(idx, 'writtenMarks', Number(e.target.value))}
                          className="w-16 text-center text-xs py-1 bg-slate-950 text-white border border-slate-800 rounded-lg focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={sub.mcqMarks}
                          onChange={(e) => handleSubjectMarkChange(idx, 'mcqMarks', Number(e.target.value))}
                          className="w-16 text-center text-xs py-1 bg-slate-950 text-white border border-slate-800 rounded-lg focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={25}
                          value={sub.practicalMarks}
                          onChange={(e) => handleSubjectMarkChange(idx, 'practicalMarks', Number(e.target.value))}
                          className="w-16 text-center text-xs py-1 bg-slate-950 text-white border border-slate-800 rounded-lg focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-white">
                        {sub.obtainedMarks}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-emerald-400 font-mono">
                        {sub.grade} ({(sub.gradePoint ?? 0).toFixed(2)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Teacher's Conduct Remarks</label>
              <input
                type="text"
                value={entryRemarks}
                onChange={(e) => setEntryRemarks(e.target.value)}
                className="w-full text-xs bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'bn' ? "ফলাফল সংরক্ষণ ও নম্বরপত্র প্রকাশ করুন" : "Save Results & Publish Official Marksheet"}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
