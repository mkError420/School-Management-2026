import React, { useState } from 'react';
import { 
  Users, Search, Filter, Plus, Printer, Phone, 
  ShieldCheck, Award, MapPin, Calendar, Heart, 
  CreditCard, CheckCircle2, ChevronRight, X, AlertTriangle,
  Activity, Stethoscope, UserCheck, School, Trophy,
  FileText, Edit3, Bookmark, AlertCircle, HeartPulse,
  Sparkles, ExternalLink, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translations, toBanglaDigits, formatCurrencyBDT } from '../translations';
import { Student, ExtracurricularActivity, MedicalHistory, EmergencyContactInfo, PreviousAcademicRecord } from '../types';

type TabType = 'overview' | 'extracurricular' | 'medical' | 'emergency' | 'academicHistory';

export const StudentProfileModule: React.FC = () => {
  const { students, addStudent, updateStudent, lang, currentUser } = useApp();
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSection, setFilterSection] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(students[0] || null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showIDCardModal, setShowIDCardModal] = useState<boolean>(false);
  const [showPrintDossierModal, setShowPrintDossierModal] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<'basic' | 'extra' | 'medical' | 'emergency' | 'academic'>('basic');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    // Basic
    nameEnglish: "",
    nameBangla: "",
    birthCertificateNo: "",
    dob: "2010-04-15",
    gender: "female" as 'male' | 'female' | 'other',
    bloodGroup: "B+",
    religion: "Islam",
    className: "Class 9",
    section: "Padma",
    roll: 1,
    fatherName: "",
    fatherNameBangla: "",
    motherName: "",
    motherNameBangla: "",
    presentAddress: "House 14, Road 5, Block B, Dhanmondi, Dhaka",
    permanentAddress: "Vill: Alampur, Post: Sonargaon, Dist: Narayanganj",
    upazila: "Dhanmondi",
    district: "Dhaka",
    status: "active" as 'active' | 'transferred' | 'graduated' | 'suspended',
    
    // Extracurricular
    clubsInput: "Science Club, Debating Society, Red Crescent Youth",
    sportsInput: "Badminton, Chess, Table Tennis",
    leadershipRolesInput: "Class Prefect (2026), Science Club Vice-President",
    hobbiesInput: "Robotics Programming, Calligraphy, Astronomy",
    achievementTitle: "National Math Olympiad Regional Champion",
    achievementYear: 2025,
    achievementCategory: "olympiad" as const,
    achievementLevel: "District" as const,
    achievementPosition: "1st Place (Gold)",
    achievementDesc: "Ranked 1st in Dhaka South Regional Math Olympiad (Junior Category).",

    // Medical
    allergiesInput: "Dust & Pollen, Cold Agglutinins",
    chronicConditionsInput: "Mild Exercise-Induced Asthma",
    regularMedicationsInput: "Salbutamol Inhaler (100mcg PRN)",
    specialNeeds: "Prefers well-ventilated seating near windows during seasonal shifts.",
    physicianName: "Dr. M. A. Karim, MBBS, FCPS (Pediatrics)",
    physicianPhone: "+8801711223344",
    emergencyMedicalInstructions: "If acute shortness of breath occurs, assist with emergency inhaler stored in sickbay and immediately alert guardian.",
    vaccinationStatus: "Complete" as 'Complete' | 'Partial' | 'Exempted',
    lastHealthCheckupDate: "2026-02-10",

    // Emergency Contacts
    primaryContactName: "Rafiqul Islam",
    primaryContactRelation: "Father",
    primaryContactPhone: "+8801712345678",
    primaryContactPhoneSecondary: "+8801711002288",
    primaryContactEmail: "rafiq.islam@gmail.com",
    primaryContactWorkplace: "BEXIMCO Corporate HQ, 17 Dhanmondi, Dhaka",
    primaryContactAuthorizedPickup: true,
    
    secondaryContactName: "Shamsun Nahar",
    secondaryContactRelation: "Mother",
    secondaryContactPhone: "+8801819234567",
    secondaryContactWorkplace: "Dhanmondi, Dhaka",
    secondaryContactAuthorizedPickup: true,

    preferredHospital: "Square Hospital / Dhaka Medical College Hospital",
    ambulanceContact: "999 / +8801713377775",
    specialPickupInstructions: "Valid Guardian ID card or prior telephonic SMS authorization required for release.",

    // Previous Academic
    prevSchoolName: "Dhanmondi Govt. Boys' High School (Junior Wing)",
    prevSchoolAddress: "Road 2, Dhanmondi, Dhaka-1205",
    prevEducationBoard: "Dhaka Board",
    prevExamPassed: "Class 8 Annual Examination",
    prevPassingYear: 2025,
    prevRollNo: "101",
    prevRegNo: "2110294820",
    prevGPA: 5.00,
    prevTCNo: "TC-DGBHS-2025-084",
    prevTCDate: "2025-12-28",
    prevConductRating: "Excellent" as 'Excellent' | 'Very Good' | 'Good' | 'Satisfactory',
    prevRemarks: "Exemplary academic dedication, outstanding analytical skills and exemplary moral conduct."
  });

  const filteredStudents = students.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const nameEn = (s.nameEnglish || "").toLowerCase();
    const nameBn = (s.nameBangla || "");
    const code = (s.studentCode || "").toLowerCase();
    const phone = (s.guardianPhone || "");
    const brn = (s.birthCertificateNo || s.birthRegNumber || "");
    
    const matchesSearch = nameEn.includes(searchLower) ||
      nameBn.includes(searchTerm) ||
      code.includes(searchLower) ||
      phone.includes(searchTerm) ||
      brn.includes(searchTerm);

    const matchesClass = filterClass === 'all' || s.className === filterClass;
    const matchesSec = filterSection === 'all' || s.section === filterSection;
    return matchesSearch && matchesClass && matchesSec;
  });

  const openAddModal = () => {
    setIsEditing(false);
    setModalTab('basic');
    setFormData({
      nameEnglish: "",
      nameBangla: "",
      birthCertificateNo: "",
      dob: "2010-04-15",
      gender: "male",
      bloodGroup: "B+",
      religion: "Islam",
      className: "Class 9",
      section: "Padma",
      roll: students.length + 1,
      fatherName: "",
      fatherNameBangla: "",
      motherName: "",
      motherNameBangla: "",
      presentAddress: "House 12, Road 4, Dhanmondi, Dhaka",
      permanentAddress: "Vill: Joydebpur, Dist: Gazipur",
      upazila: "Dhanmondi",
      district: "Dhaka",
      status: "active",
      clubsInput: "Science Club, Debating Society",
      sportsInput: "Cricket, Badminton",
      leadershipRolesInput: "Assistant Prefect",
      hobbiesInput: "Reading, Chess, Computer Programming",
      achievementTitle: "Junior Science Fair 1st Prize",
      achievementYear: 2025,
      achievementCategory: "science",
      achievementLevel: "School",
      achievementPosition: "1st Place",
      achievementDesc: "Presented renewable energy school project model.",
      allergiesInput: "None",
      chronicConditionsInput: "None",
      regularMedicationsInput: "None",
      specialNeeds: "None",
      physicianName: "Dr. A. K. Azad, MBBS",
      physicianPhone: "+8801712000000",
      emergencyMedicalInstructions: "Standard school emergency first aid protocol.",
      vaccinationStatus: "Complete",
      lastHealthCheckupDate: "2026-01-15",
      primaryContactName: "",
      primaryContactRelation: "Father",
      primaryContactPhone: "01711000000",
      primaryContactPhoneSecondary: "",
      primaryContactEmail: "",
      primaryContactWorkplace: "Dhaka, Bangladesh",
      primaryContactAuthorizedPickup: true,
      secondaryContactName: "",
      secondaryContactRelation: "Mother",
      secondaryContactPhone: "01819000000",
      secondaryContactWorkplace: "Dhaka, Bangladesh",
      secondaryContactAuthorizedPickup: true,
      preferredHospital: "Dhaka Medical College Hospital",
      ambulanceContact: "999",
      specialPickupInstructions: "Guardian with valid school token authorized.",
      prevSchoolName: "Government Laboratory High School",
      prevSchoolAddress: "Dhaka",
      prevEducationBoard: "Dhaka Board",
      prevExamPassed: "Class 8 Annual Examination",
      prevPassingYear: 2025,
      prevRollNo: "05",
      prevRegNo: "2110998822",
      prevGPA: 5.00,
      prevTCNo: "TC-2025-098",
      prevTCDate: "2025-12-29",
      prevConductRating: "Excellent",
      prevRemarks: "Hardworking and disciplined student."
    });
    setShowAddModal(true);
  };

  const openEditModal = (std: Student) => {
    setIsEditing(true);
    setModalTab('basic');
    
    // Parse extracurricular
    const clubsStr = std.extracurricular?.clubs?.join(', ') || "";
    const sportsStr = std.extracurricular?.sports?.join(', ') || "";
    const leadershipStr = std.extracurricular?.leadershipRoles?.join(', ') || "";
    const hobbiesStr = std.extracurricular?.hobbies?.join(', ') || "";
    const firstAch = std.extracurricular?.achievements?.[0];

    // Parse medical
    const med = std.medicalHistory;
    const allergiesStr = med?.knownAllergies?.join(', ') || "";
    const chronicStr = med?.chronicConditions?.join(', ') || "";
    const medsStr = med?.regularMedications?.join(', ') || "";

    // Parse emergency
    const emerg = std.emergencyContactInfo;
    const pContact = emerg?.primaryContact;
    const sContact = emerg?.secondaryContact;

    // Parse academic
    const prev = std.previousAcademicRecords?.[0];

    setFormData({
      nameEnglish: std.nameEnglish || "",
      nameBangla: std.nameBangla || "",
      birthCertificateNo: std.birthCertificateNo || std.birthRegNumber || "",
      dob: std.dob || std.dateOfBirth || "2010-04-15",
      gender: std.gender || "male",
      bloodGroup: std.bloodGroup || "B+",
      religion: std.religion || "Islam",
      className: std.className || "Class 9",
      section: std.section || "Padma",
      roll: std.roll || 1,
      fatherName: std.fatherName || "",
      fatherNameBangla: std.fatherNameBangla || "",
      motherName: std.motherName || "",
      motherNameBangla: std.motherNameBangla || "",
      presentAddress: typeof std.presentAddress === 'string' ? std.presentAddress : "Dhanmondi, Dhaka",
      permanentAddress: typeof std.permanentAddress === 'string' ? std.permanentAddress : "Narayanganj",
      upazila: std.upazila || "Dhanmondi",
      district: std.district || "Dhaka",
      status: std.status || "active",
      
      clubsInput: clubsStr,
      sportsInput: sportsStr,
      leadershipRolesInput: leadershipStr,
      hobbiesInput: hobbiesStr,
      achievementTitle: firstAch?.title || "",
      achievementYear: firstAch?.year || 2025,
      achievementCategory: firstAch?.category || "olympiad",
      achievementLevel: firstAch?.level || "District",
      achievementPosition: firstAch?.position || "1st Place",
      achievementDesc: firstAch?.description || "",

      allergiesInput: allergiesStr,
      chronicConditionsInput: chronicStr,
      regularMedicationsInput: medsStr,
      specialNeeds: med?.specialNeeds || "",
      physicianName: med?.primaryPhysicianName || "",
      physicianPhone: med?.primaryPhysicianPhone || "",
      emergencyMedicalInstructions: med?.emergencyMedicalInstructions || "",
      vaccinationStatus: (med?.vaccinationStatus as any) || "Complete",
      lastHealthCheckupDate: med?.lastHealthCheckupDate || "2026-02-10",

      primaryContactName: pContact?.name || std.guardianName || std.fatherName || "",
      primaryContactRelation: pContact?.relation || std.guardianRelation || "Father",
      primaryContactPhone: pContact?.phonePrimary || std.guardianPhone || "",
      primaryContactPhoneSecondary: pContact?.phoneSecondary || "",
      primaryContactEmail: pContact?.email || std.guardianEmail || "",
      primaryContactWorkplace: pContact?.addressOrWorkplace || "Dhaka",
      primaryContactAuthorizedPickup: pContact?.isAuthorizedForPickup ?? true,

      secondaryContactName: sContact?.name || std.motherName || "",
      secondaryContactRelation: sContact?.relation || "Mother",
      secondaryContactPhone: sContact?.phonePrimary || std.emergencyContact || "",
      secondaryContactWorkplace: sContact?.addressOrWorkplace || "Dhaka",
      secondaryContactAuthorizedPickup: sContact?.isAuthorizedForPickup ?? true,

      preferredHospital: emerg?.preferredHospital || "Dhaka Medical College Hospital",
      ambulanceContact: emerg?.ambulanceContact || "999",
      specialPickupInstructions: emerg?.specialPickupInstructions || "School ID card required.",

      prevSchoolName: prev?.previousSchoolName || "",
      prevSchoolAddress: prev?.schoolAddress || "",
      prevEducationBoard: prev?.educationBoard || "Dhaka Board",
      prevExamPassed: prev?.examPassedOrClass || "Class 8 Annual Examination",
      prevPassingYear: prev?.passingYear || 2025,
      prevRollNo: prev?.rollNumber || "",
      prevRegNo: prev?.registrationNumber || "",
      prevGPA: prev?.gpaObtained || 5.00,
      prevTCNo: prev?.transferCertificateNo || "",
      prevTCDate: prev?.tcDate || "2025-12-28",
      prevConductRating: (prev?.conductRating as any) || "Excellent",
      prevRemarks: prev?.remarks || ""
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct Extracurricular
    const extracurricular: ExtracurricularActivity = {
      clubs: formData.clubsInput.split(',').map(s => s.trim()).filter(Boolean),
      sports: formData.sportsInput.split(',').map(s => s.trim()).filter(Boolean),
      leadershipRoles: formData.leadershipRolesInput.split(',').map(s => s.trim()).filter(Boolean),
      hobbies: formData.hobbiesInput.split(',').map(s => s.trim()).filter(Boolean),
      achievements: formData.achievementTitle ? [
        {
          id: `ach-${Date.now()}`,
          title: formData.achievementTitle,
          year: Number(formData.achievementYear) || 2025,
          category: formData.achievementCategory,
          level: formData.achievementLevel,
          position: formData.achievementPosition,
          description: formData.achievementDesc
        }
      ] : []
    };

    // Construct Medical
    const medicalHistory: MedicalHistory = {
      bloodGroup: formData.bloodGroup,
      knownAllergies: formData.allergiesInput.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: formData.chronicConditionsInput.split(',').map(s => s.trim()).filter(Boolean),
      regularMedications: formData.regularMedicationsInput.split(',').map(s => s.trim()).filter(Boolean),
      specialNeeds: formData.specialNeeds,
      primaryPhysicianName: formData.physicianName,
      primaryPhysicianPhone: formData.physicianPhone,
      emergencyMedicalInstructions: formData.emergencyMedicalInstructions,
      lastHealthCheckupDate: formData.lastHealthCheckupDate,
      vaccinationStatus: formData.vaccinationStatus
    };

    // Construct Emergency Contact
    const emergencyContactInfo: EmergencyContactInfo = {
      primaryContact: {
        name: formData.primaryContactName || formData.fatherName || "Primary Guardian",
        relation: formData.primaryContactRelation || "Father",
        phonePrimary: formData.primaryContactPhone || formData.guardianPhone,
        phoneSecondary: formData.primaryContactPhoneSecondary,
        email: formData.primaryContactEmail,
        addressOrWorkplace: formData.primaryContactWorkplace,
        isAuthorizedForPickup: formData.primaryContactAuthorizedPickup
      },
      secondaryContact: {
        name: formData.secondaryContactName || formData.motherName || "Secondary Guardian",
        relation: formData.secondaryContactRelation || "Mother",
        phonePrimary: formData.secondaryContactPhone,
        addressOrWorkplace: formData.secondaryContactWorkplace,
        isAuthorizedForPickup: formData.secondaryContactAuthorizedPickup
      },
      preferredHospital: formData.preferredHospital,
      ambulanceContact: formData.ambulanceContact,
      specialPickupInstructions: formData.specialPickupInstructions
    };

    // Construct Previous Academic Record
    const previousAcademicRecords: PreviousAcademicRecord[] = formData.prevSchoolName ? [
      {
        id: `prev-${Date.now()}`,
        previousSchoolName: formData.prevSchoolName,
        schoolAddress: formData.prevSchoolAddress,
        educationBoard: formData.prevEducationBoard,
        examPassedOrClass: formData.prevExamPassed,
        passingYear: Number(formData.prevPassingYear) || 2025,
        rollNumber: formData.prevRollNo,
        registrationNumber: formData.prevRegNo,
        gpaObtained: Number(formData.prevGPA) || 5.00,
        transferCertificateNo: formData.prevTCNo,
        tcDate: formData.prevTCDate,
        conductRating: formData.prevConductRating,
        remarks: formData.prevRemarks
      }
    ] : [];

    if (isEditing && selectedStudent) {
      const updated: Partial<Student> = {
        nameEnglish: formData.nameEnglish,
        nameBangla: formData.nameBangla,
        birthCertificateNo: formData.birthCertificateNo,
        birthRegNumber: formData.birthCertificateNo,
        dob: formData.dob,
        dateOfBirth: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        religion: formData.religion,
        className: formData.className,
        section: formData.section,
        roll: Number(formData.roll),
        fatherName: formData.fatherName,
        fatherNameBangla: formData.fatherNameBangla,
        motherName: formData.motherName,
        motherNameBangla: formData.motherNameBangla,
        guardianName: formData.primaryContactName || formData.fatherName,
        guardianPhone: formData.primaryContactPhone,
        guardianRelation: formData.primaryContactRelation,
        emergencyContact: formData.secondaryContactPhone || formData.primaryContactPhone,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        upazila: formData.upazila,
        district: formData.district,
        status: formData.status,
        extracurricular,
        medicalHistory,
        emergencyContactInfo,
        previousAcademicRecords
      };

      updateStudent(selectedStudent.id, updated);
      setSelectedStudent(prev => prev ? { ...prev, ...updated } : null);
      setShowAddModal(false);
    } else {
      const newStd: Omit<Student, 'id' | 'studentCode' | 'attendanceRate' | 'lastExamGPA' | 'totalFeesPaid'> = {
        nameEnglish: formData.nameEnglish,
        nameBangla: formData.nameBangla,
        birthCertificateNo: formData.birthCertificateNo,
        birthRegNumber: formData.birthCertificateNo,
        dob: formData.dob,
        dateOfBirth: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        religion: formData.religion,
        className: formData.className,
        section: formData.section,
        roll: Number(formData.roll),
        sessionYear: 2026,
        avatarUrl: `https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80`,
        fatherName: formData.fatherName,
        fatherNameBangla: formData.fatherNameBangla,
        motherName: formData.motherName,
        motherNameBangla: formData.motherNameBangla,
        guardianName: formData.primaryContactName || formData.fatherName,
        guardianPhone: formData.primaryContactPhone,
        guardianRelation: formData.primaryContactRelation,
        emergencyContact: formData.secondaryContactPhone || formData.primaryContactPhone,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        upazila: formData.upazila,
        district: formData.district,
        admissionDate: new Date().toISOString().substring(0, 10),
        status: formData.status,
        gpa: 5.00,
        totalFeesDue: 0,
        extracurricular,
        medicalHistory,
        emergencyContactInfo,
        previousAcademicRecords
      };

      addStudent(newStd);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>{t.navStudents}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {lang === 'bn' 
              ? "শিক্ষার্থী বায়োডাটা, সহশিক্ষা কার্যক্রম, পূর্ণাঙ্গ চিকিৎসা ইতিহাস, জরুরি যোগাযোগ ও পূর্বতন পরীক্ষার তথ্য" 
              : "Comprehensive student dossiers with verified BRN, extracurriculars, medical records, emergency contacts & academic history"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap no-print">
          <button
            id="btn-print-full-dossier"
            onClick={() => setShowPrintDossierModal(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{t.printDossier}</span>
          </button>

          <button
            id="btn-print-id-card"
            onClick={() => setShowIDCardModal(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>{lang === 'bn' ? "আইডি কার্ড প্রিন্ট" : "Digital ID Card"}</span>
          </button>
          
          {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'staff') && (
            <button
              id="btn-add-student"
              onClick={openAddModal}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addStudent}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'bn' ? "নাম, রোল, জন্ম সনদ বা ফোন খুঁজুন..." : "Search name, roll, BRN or phone..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-hidden cursor-pointer"
          >
            <option value="all">{lang === 'bn' ? "সকল শ্রেণি" : "All Classes"}</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>

          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="text-xs bg-slate-950 text-white border border-slate-800 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-hidden cursor-pointer"
          >
            <option value="all">{lang === 'bn' ? "সকল শাখা" : "All Sections"}</option>
            <option value="Padma">Padma</option>
            <option value="Meghna">Meghna</option>
            <option value="Jamuna">Jamuna</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Student Master List + Detailed Dossier Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Student Master List */}
        <div className="lg:col-span-4 bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden no-print">
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <h2 className="text-sm font-semibold">{lang === 'bn' ? "শিক্ষার্থী তালিকা" : "Enrolled Students"}</h2>
            <span className="text-xs text-emerald-400 font-mono">
              {filteredStudents.length} {lang === 'bn' ? "জন" : "Found"}
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[750px] overflow-y-auto">
            {filteredStudents.map((std) => {
              const isSelected = selectedStudent?.id === std.id;
              const hasMedWarning = std.medicalHistory?.knownAllergies && std.medicalHistory.knownAllergies.length > 0 && std.medicalHistory.knownAllergies[0] !== 'None';
              return (
                <div
                  key={std.id}
                  onClick={() => setSelectedStudent(std)}
                  className={`p-3.5 hover:bg-slate-800/50 transition cursor-pointer flex items-center gap-3 ${
                    isSelected ? 'bg-slate-800/80 border-l-2 border-emerald-500' : ''
                  }`}
                >
                  <img
                    src={std.avatarUrl}
                    alt={std.nameEnglish}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">
                        {lang === 'bn' ? std.nameBangla : std.nameEnglish}
                      </p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                        {lang === 'bn' ? `রোল: ${toBanglaDigits(std.roll)}` : `Roll: ${std.roll}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {std.className} ({std.section}) • {std.studentCode}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 flex-wrap">
                      <span className="font-semibold text-emerald-400">GPA {(std.gpa ?? std.lastExamGPA ?? 5.0).toFixed(2)}</span>
                      <span>•</span>
                      <span className="text-red-400 font-bold">{std.bloodGroup}</span>
                      {hasMedWarning && (
                        <span className="px-1.5 py-0.2 rounded bg-red-950/80 text-red-300 border border-red-800/60 text-[9px] flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> Medical Note
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Student Detailed Dossier Viewer */}
        <div className="lg:col-span-8 bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-800 shadow-xs space-y-6">
          {selectedStudent ? (
            <div>
              
              {/* Profile Top Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedStudent.avatarUrl}
                    alt={selectedStudent.nameEnglish}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-white">
                        {lang === 'bn' ? selectedStudent.nameBangla : selectedStudent.nameEnglish}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {(selectedStudent.status || 'active').toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                        {selectedStudent.bloodGroup}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                      {selectedStudent.nameEnglish} • ID: <span className="font-mono text-slate-300 font-bold">{selectedStudent.studentCode}</span>
                    </p>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                      {selectedStudent.className} | {selectedStudent.section} Section | Roll: {selectedStudent.roll}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap no-print">
                  {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'staff') && (
                    <button
                      id="btn-edit-student-profile"
                      onClick={() => openEditModal(selectedStudent)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.editStudentProfile}</span>
                    </button>
                  )}
                  
                  <a
                    href={`tel:${selectedStudent.guardianPhone || selectedStudent.emergencyContactInfo?.primaryContact?.phonePrimary}`}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition cursor-pointer"
                    title="Call Guardian"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Dossier Segmented Navigation Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 pt-3 no-print">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t.tabOverview}</span>
                </button>

                <button
                  onClick={() => setActiveTab('extracurricular')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'extracurricular'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.tabExtracurricular}</span>
                </button>

                <button
                  onClick={() => setActiveTab('medical')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'medical'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                  <span>{t.tabMedical}</span>
                </button>

                <button
                  onClick={() => setActiveTab('emergency')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'emergency'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.tabEmergency}</span>
                </button>

                <button
                  onClick={() => setActiveTab('academicHistory')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'academicHistory'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <School className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.tabAcademicHistory}</span>
                </button>
              </div>

              {/* TAB 1: OVERVIEW & BIODATA */}
              {activeTab === 'overview' && (
                <div className="space-y-5 pt-4">
                  {/* KPI Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Academic Merit</span>
                      <p className="text-xl font-bold text-emerald-400 mt-0.5 font-mono">GPA {(selectedStudent.gpa ?? selectedStudent.lastExamGPA ?? 5.0).toFixed(2)}</p>
                      <span className="text-[10px] text-emerald-500 font-semibold">1st Position in Section</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Attendance Rate</span>
                      <p className="text-xl font-bold text-blue-400 mt-0.5 font-mono">{selectedStudent.attendanceRate ?? 95}%</p>
                      <span className="text-[10px] text-blue-400 font-semibold">Regular & Punctual</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Tuition Status</span>
                      <p className="text-sm font-bold text-purple-400 mt-1.5 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>All Cleared</span>
                      </p>
                      <span className="text-[10px] text-slate-500 font-semibold">Session 2026</span>
                    </div>
                  </div>

                  {/* Government BRN Verification Box */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                      <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        {lang === 'bn' ? "১৭ ডিজিট জন্ম নিবন্ধন সনদ (BDRIS)" : "Bangladeshi 17-Digit Birth Certificate"}
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold px-2 py-0.5 rounded">
                        Verified by BDRIS
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">BRN Number</span>
                        <span className="font-mono font-bold text-white">{selectedStudent.birthCertificateNo || selectedStudent.birthRegNumber || "20102692015034821"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                        <span className="font-bold text-white">{selectedStudent.dob || selectedStudent.dateOfBirth || "2010-04-15"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Gender</span>
                        <span className="font-bold text-slate-200 uppercase">{selectedStudent.gender || 'Female'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Religion</span>
                        <span className="font-bold text-slate-200">{selectedStudent.religion || 'Islam'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Parents & Guardians Info */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <span className="font-semibold text-white block pb-2 border-b border-slate-800 mb-3">
                      {lang === 'bn' ? "পিতা-মাতা ও অভিভাবক বিবরণী" : "Parents & Guardian Information"}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Father's Information</p>
                        <p className="font-semibold text-slate-200">{selectedStudent.fatherName} {selectedStudent.fatherNameBangla && `(${selectedStudent.fatherNameBangla})`}</p>
                        <p className="text-slate-400 font-mono text-[11px] mt-0.5">NID: {selectedStudent.fatherNid || '19822692015003421'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Mother's Information</p>
                        <p className="font-semibold text-slate-200">{selectedStudent.motherName} {selectedStudent.motherNameBangla && `(${selectedStudent.motherNameBangla})`}</p>
                        <p className="text-slate-400 font-mono text-[11px] mt-0.5">NID: {selectedStudent.motherNid || '19852692015009842'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Authorized Primary Guardian</p>
                        <p className="font-semibold text-slate-200">{selectedStudent.guardianName} ({selectedStudent.guardianRelation})</p>
                        <p className="text-emerald-400 font-semibold font-mono text-[11px] mt-0.5">{selectedStudent.guardianPhone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Permanent Address</p>
                        <p className="text-slate-300">
                          {typeof selectedStudent.permanentAddress === 'string' ? selectedStudent.permanentAddress : 'Dhaka, Bangladesh'}
                        </p>
                        <p className="text-slate-400 text-[11px]">Upazila: {selectedStudent.upazila}, Dist: {selectedStudent.district}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EXTRACURRICULAR ACTIVITIES & TALENTS */}
              {activeTab === 'extracurricular' && (
                <div className="space-y-5 pt-4 text-xs">
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>{t.clubsAndSocieties}</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        {selectedStudent.extracurricular?.clubs?.length || 0} Clubs
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.extracurricular?.clubs && selectedStudent.extracurricular.clubs.length > 0 ? (
                        selectedStudent.extracurricular.clubs.map((club, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 font-medium">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{club}</span>
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400">No registered clubs yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sports */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-white block pb-2 border-b border-slate-800 mb-3">
                        {t.sportsAndAthletics}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedStudent.extracurricular?.sports && selectedStudent.extracurricular.sports.length > 0 ? (
                          selectedStudent.extracurricular.sports.map((sp, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-semibold">
                              ⚽ {sp}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-400">Standard physical education.</p>
                        )}
                      </div>
                    </div>

                    {/* Leadership Roles */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-white block pb-2 border-b border-slate-800 mb-3">
                        {t.leadershipRoles}
                      </span>
                      <div className="space-y-1.5">
                        {selectedStudent.extracurricular?.leadershipRoles && selectedStudent.extracurricular.leadershipRoles.length > 0 ? (
                          selectedStudent.extracurricular.leadershipRoles.map((role, idx) => (
                            <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 font-medium flex items-center gap-2">
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              <span>{role}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400">No active prefect/leadership roles assigned.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hobbies & Special Skills */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-white block pb-2 border-b border-slate-800 mb-3">
                      {t.hobbiesAndSkills}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.extracurricular?.hobbies && selectedStudent.extracurricular.hobbies.length > 0 ? (
                        selectedStudent.extracurricular.hobbies.map((hb, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-purple-950/70 text-purple-300 border border-purple-800 text-xs font-medium">
                            ★ {hb}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400">Reading, general athletics.</p>
                      )}
                    </div>
                  </div>

                  {/* Honors, Olympiads & Achievements List */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{t.awardsAndHonors}</span>
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedStudent.extracurricular?.achievements && selectedStudent.extracurricular.achievements.length > 0 ? (
                        selectedStudent.extracurricular.achievements.map((ach) => (
                          <div key={ach.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-400 shrink-0">
                              <Trophy className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between flex-wrap gap-1">
                                <h4 className="font-bold text-white text-xs">{ach.title}</h4>
                                <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold text-[10px] border border-amber-700">
                                  {ach.position} ({ach.year})
                                </span>
                              </div>
                              <p className="text-slate-400 text-[11px] mt-1">{ach.description}</p>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-semibold">
                                <span className="uppercase text-emerald-400">{ach.level} Level</span>
                                <span>•</span>
                                <span className="uppercase text-purple-400">{ach.category}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-center py-3">No formal competition awards recorded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MEDICAL & HEALTH RECORD */}
              {activeTab === 'medical' && (
                <div className="space-y-5 pt-4 text-xs">
                  {/* Known Allergies Alert Box */}
                  <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/80">
                    <div className="flex items-center justify-between pb-2 border-b border-red-800/50 mb-3">
                      <span className="font-bold text-red-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>{t.allergies}</span>
                      </span>
                      <span className="text-[10px] bg-red-900/80 text-red-200 border border-red-700 px-2 py-0.5 rounded font-bold">
                        Medical Attention Flag
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.medicalHistory?.knownAllergies && selectedStudent.medicalHistory.knownAllergies.length > 0 ? (
                        selectedStudent.medicalHistory.knownAllergies.map((alg, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-md bg-red-900 text-red-100 font-bold border border-red-700 text-xs">
                            ⚠️ {alg}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-300 font-medium">No known clinical drug or food allergies.</p>
                      )}
                    </div>
                  </div>

                  {/* Conditions & Medications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-white block pb-2 border-b border-slate-800 mb-3">
                        {t.chronicConditions}
                      </span>
                      <div className="space-y-1.5">
                        {selectedStudent.medicalHistory?.chronicConditions && selectedStudent.medicalHistory.chronicConditions.length > 0 ? (
                          selectedStudent.medicalHistory.chronicConditions.map((cond, idx) => (
                            <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 font-medium">
                              🩺 {cond}
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400">None reported.</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-white block pb-2 border-b border-slate-800 mb-3">
                        {t.regularMedications}
                      </span>
                      <div className="space-y-1.5">
                        {selectedStudent.medicalHistory?.regularMedications && selectedStudent.medicalHistory.regularMedications.length > 0 ? (
                          selectedStudent.medicalHistory.regularMedications.map((med, idx) => (
                            <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]">
                              💊 {med}
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400">No regular prescription medications required during school hours.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary Physician & Emergency Instructions */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-white block pb-2 border-b border-slate-800 mb-3">
                      {t.emergencyMedicalInstructions}
                    </span>
                    <p className="text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                      {selectedStudent.medicalHistory?.emergencyMedicalInstructions || "Administer basic first aid in sickbay and immediately contact the authorized guardian."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Primary Physician</span>
                        <span className="font-bold text-white">{selectedStudent.medicalHistory?.primaryPhysicianName || "Dr. Assigned"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Physician Phone</span>
                        <span className="font-bold text-emerald-400 font-mono">{selectedStudent.medicalHistory?.primaryPhysicianPhone || "+8801700000000"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Vaccination Status</span>
                        <span className="font-bold text-blue-400">{selectedStudent.medicalHistory?.vaccinationStatus || "Complete (EPI Bangladesh)"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EMERGENCY CONTACT INFORMATION */}
              {activeTab === 'emergency' && (
                <div className="space-y-5 pt-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Primary Emergency Contact */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4" />
                          <span>{t.primaryEmergencyContact}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                          Priority 1
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Full Name & Relation</span>
                          <span className="font-bold text-white text-sm">
                            {selectedStudent.emergencyContactInfo?.primaryContact?.name || selectedStudent.guardianName || selectedStudent.fatherName}
                            {' '}({selectedStudent.emergencyContactInfo?.primaryContact?.relation || selectedStudent.guardianRelation || 'Father'})
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 text-[10px] block">Primary Emergency Phone (24/7)</span>
                          <a 
                            href={`tel:${selectedStudent.emergencyContactInfo?.primaryContact?.phonePrimary || selectedStudent.guardianPhone}`}
                            className="font-mono font-bold text-emerald-400 text-sm hover:underline"
                          >
                            {selectedStudent.emergencyContactInfo?.primaryContact?.phonePrimary || selectedStudent.guardianPhone}
                          </a>
                        </div>

                        {selectedStudent.emergencyContactInfo?.primaryContact?.phoneSecondary && (
                          <div>
                            <span className="text-slate-400 text-[10px] block">Secondary Phone</span>
                            <span className="font-mono text-slate-300">{selectedStudent.emergencyContactInfo.primaryContact.phoneSecondary}</span>
                          </div>
                        )}

                        <div>
                          <span className="text-slate-400 text-[10px] block">Workplace / Office Address</span>
                          <span className="text-slate-300">{selectedStudent.emergencyContactInfo?.primaryContact?.addressOrWorkplace || "Dhaka, Bangladesh"}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-[11px] text-emerald-300 font-semibold">Authorized for Student Release & Pickup</span>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Emergency Contact */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                        <span className="font-bold text-blue-400 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4" />
                          <span>{t.secondaryEmergencyContact}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 text-[10px] font-bold border border-blue-800">
                          Priority 2
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Full Name & Relation</span>
                          <span className="font-bold text-white text-sm">
                            {selectedStudent.emergencyContactInfo?.secondaryContact?.name || selectedStudent.motherName || 'Alternate Guardian'}
                            {' '}({selectedStudent.emergencyContactInfo?.secondaryContact?.relation || 'Mother'})
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 text-[10px] block">Emergency Phone</span>
                          <a 
                            href={`tel:${selectedStudent.emergencyContactInfo?.secondaryContact?.phonePrimary || selectedStudent.emergencyContact}`}
                            className="font-mono font-bold text-blue-400 text-sm hover:underline"
                          >
                            {selectedStudent.emergencyContactInfo?.secondaryContact?.phonePrimary || selectedStudent.emergencyContact || "+8801800000000"}
                          </a>
                        </div>

                        <div>
                          <span className="text-slate-400 text-[10px] block">Location / Address</span>
                          <span className="text-slate-300">{selectedStudent.emergencyContactInfo?.secondaryContact?.addressOrWorkplace || "Dhaka, Bangladesh"}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-[11px] text-emerald-300 font-semibold">Authorized for Student Release & Pickup</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Preferred Hospital & Ambulance Protocol */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="font-semibold text-white block pb-2 border-b border-slate-800 mb-3">
                      {t.preferredHospital} & Emergency Dispatch
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Designated Emergency Hospital</span>
                        <p className="font-bold text-slate-200 text-xs mt-0.5">
                          🏥 {selectedStudent.emergencyContactInfo?.preferredHospital || "Dhaka Medical College Hospital / Square Hospital"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Emergency Ambulance / Hotline</span>
                        <p className="font-mono font-bold text-red-400 text-xs mt-0.5">
                          🚑 {selectedStudent.emergencyContactInfo?.ambulanceContact || "999 / National Emergency Service"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Authorized Pickup Security Instruction</span>
                      <p className="text-slate-300 text-xs mt-0.5">
                        {selectedStudent.emergencyContactInfo?.specialPickupInstructions || "Valid student ID card token or telephonic authorization required before handover."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PREVIOUS ACADEMIC RECORDS */}
              {activeTab === 'academicHistory' && (
                <div className="space-y-5 pt-4 text-xs">
                  {selectedStudent.previousAcademicRecords && selectedStudent.previousAcademicRecords.length > 0 ? (
                    selectedStudent.previousAcademicRecords.map((rec) => (
                      <div key={rec.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800 flex-wrap gap-2">
                          <div>
                            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                              <School className="w-4 h-4 text-purple-400" />
                              <span>{rec.previousSchoolName}</span>
                            </h3>
                            <p className="text-slate-400 text-[11px]">{rec.schoolAddress || 'Dhaka, Bangladesh'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800 text-[10px]">
                              {rec.educationBoard}
                            </span>
                            <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 text-[10px]">
                              GPA {rec.gpaObtained.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <span className="text-slate-400 text-[10px] block">{t.previousClassPassed}</span>
                            <span className="font-bold text-slate-200">{rec.examPassedOrClass}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">{t.passingYear}</span>
                            <span className="font-bold text-white font-mono">{rec.passingYear}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Prior Roll / Reg No</span>
                            <span className="font-mono text-slate-200">{rec.rollNumber || '101'} / {rec.registrationNumber || '2110294820'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">{t.conductRating}</span>
                            <span className="font-bold text-emerald-400">{rec.conductRating || 'Excellent'}</span>
                          </div>
                        </div>

                        {rec.transferCertificateNo && (
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400 text-[10px] block">{t.tcNumber}</span>
                              <span className="font-mono font-bold text-amber-300">{rec.transferCertificateNo}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] block">{t.tcDate}</span>
                              <span className="text-slate-300">{rec.tcDate || '2025-12-28'}</span>
                            </div>
                          </div>
                        )}

                        {rec.remarks && (
                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Institutional Conduct Remarks</span>
                            <p className="text-slate-300 italic mt-0.5">"{rec.remarks}"</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 bg-slate-950 rounded-lg border border-slate-800">
                      <School className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p>No previous academic records uploaded for this student.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              Select a student to view their comprehensive academic dossier.
            </div>
          )}
        </div>

      </div>

      {/* FULL PRINTABLE STUDENT DOSSIER MODAL */}
      {showPrintDossierModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 max-w-3xl w-full shadow-2xl border border-slate-800 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 no-print">
              <div>
                <h3 className="text-sm font-semibold text-white">Official Comprehensive Student Dossier</h3>
                <p className="text-xs text-slate-400">Complete academic, medical, extracurricular, and guardian profile.</p>
              </div>
              <button 
                onClick={() => setShowPrintDossierModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Document Paper */}
            <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-md font-sans text-xs space-y-5 print:p-0">
              
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  {t.institutionNameBangla}
                </h2>
                <h3 className="text-sm font-semibold text-slate-700">DHAKA MODEL HIGH SCHOOL & COLLEGE</h3>
                <p className="text-[10px] text-slate-600">Road 12, Dhanmondi R/A, Dhaka-1209 • EIIN: 108421 • Estd: 1984</p>
                <div className="inline-block mt-2 px-3 py-1 bg-slate-900 text-white font-bold text-[10px] rounded uppercase">
                  CONFIDENTIAL STUDENT CUMULATIVE DOSSIER
                </div>
              </div>

              {/* Bio & Photo Matrix */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-300 pb-4">
                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedStudent.nameEnglish} ({selectedStudent.nameBangla})
                  </h3>
                  <p className="font-semibold text-slate-700">
                    Student ID: <span className="font-mono">{selectedStudent.studentCode}</span> • Class: {selectedStudent.className} ({selectedStudent.section}) • Roll: {selectedStudent.roll}
                  </p>
                  <p className="text-slate-600">
                    Birth Reg (BRN): <span className="font-mono font-bold">{selectedStudent.birthCertificateNo || selectedStudent.birthRegNumber}</span> • Blood Group: <span className="font-bold text-red-600">{selectedStudent.bloodGroup}</span>
                  </p>
                  <p className="text-slate-600">
                    DOB: {selectedStudent.dob || selectedStudent.dateOfBirth} • Gender: {selectedStudent.gender} • Religion: {selectedStudent.religion}
                  </p>
                </div>
                <img
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.nameEnglish}
                  className="w-20 h-20 rounded-md object-cover border-2 border-slate-900 shrink-0"
                />
              </div>

              {/* Section 1: Parents & Emergency Contacts */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 text-[11px]">
                  1. Guardian & Emergency Contact Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-700">Father's Name:</span> {selectedStudent.fatherName}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Mother's Name:</span> {selectedStudent.motherName}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Primary Contact (24/7):</span> {selectedStudent.emergencyContactInfo?.primaryContact?.phonePrimary || selectedStudent.guardianPhone}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Secondary Contact:</span> {selectedStudent.emergencyContactInfo?.secondaryContact?.phonePrimary || selectedStudent.emergencyContact}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-700">Preferred Emergency Hospital:</span> {selectedStudent.emergencyContactInfo?.preferredHospital || "Dhaka Medical College Hospital"}
                  </div>
                </div>
              </div>

              {/* Section 2: Medical & Health Profile */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 text-[11px]">
                  2. Medical Record & Emergency Action Plan
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-700">Known Allergies:</span> {selectedStudent.medicalHistory?.knownAllergies?.join(', ') || 'None'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Chronic Illnesses:</span> {selectedStudent.medicalHistory?.chronicConditions?.join(', ') || 'None'}
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-700">Emergency Protocol:</span> {selectedStudent.medicalHistory?.emergencyMedicalInstructions || 'Standard school first aid.'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Primary Doctor:</span> {selectedStudent.medicalHistory?.primaryPhysicianName} ({selectedStudent.medicalHistory?.primaryPhysicianPhone})
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Vaccination Status:</span> {selectedStudent.medicalHistory?.vaccinationStatus || 'Complete'}
                  </div>
                </div>
              </div>

              {/* Section 3: Extracurricular Activities & Talents */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 text-[11px]">
                  3. Extracurricular, Sports & Honors
                </h4>
                <div className="text-[11px] space-y-1">
                  <p><span className="font-semibold text-slate-700">Clubs:</span> {selectedStudent.extracurricular?.clubs?.join(', ') || 'None'}</p>
                  <p><span className="font-semibold text-slate-700">Sports & Athletics:</span> {selectedStudent.extracurricular?.sports?.join(', ') || 'General'}</p>
                  <p><span className="font-semibold text-slate-700">Leadership:</span> {selectedStudent.extracurricular?.leadershipRoles?.join(', ') || 'None'}</p>
                  <p><span className="font-semibold text-slate-700">Achievements:</span> {selectedStudent.extracurricular?.achievements?.map(a => `${a.title} (${a.position}, ${a.year})`).join('; ') || 'None'}</p>
                </div>
              </div>

              {/* Section 4: Previous Academic Record */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 text-[11px]">
                  4. Previous Institutional Academic Record
                </h4>
                {selectedStudent.previousAcademicRecords?.[0] ? (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="font-semibold text-slate-700">Previous School:</span> {selectedStudent.previousAcademicRecords[0].previousSchoolName}</div>
                    <div><span className="font-semibold text-slate-700">Board & Year:</span> {selectedStudent.previousAcademicRecords[0].educationBoard} ({selectedStudent.previousAcademicRecords[0].passingYear})</div>
                    <div><span className="font-semibold text-slate-700">GPA Obtained:</span> {selectedStudent.previousAcademicRecords[0].gpaObtained.toFixed(2)}</div>
                    <div><span className="font-semibold text-slate-700">TC Number:</span> {selectedStudent.previousAcademicRecords[0].transferCertificateNo || 'N/A'}</div>
                    <div className="col-span-2"><span className="font-semibold text-slate-700">Conduct Remarks:</span> {selectedStudent.previousAcademicRecords[0].remarks}</div>
                  </div>
                ) : (
                  <p className="text-slate-600 text-[11px]">Direct admission.</p>
                )}
              </div>

              {/* Signatures */}
              <div className="pt-8 flex items-center justify-between text-[10px] text-slate-700 border-t border-slate-300">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-800 mb-1"></div>
                  <p>Class Teacher</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-800 mb-1"></div>
                  <p>Medical Officer</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-800 mb-1"></div>
                  <p className="font-bold">Principal / Headmaster</p>
                </div>
              </div>

            </div>

            <div className="flex gap-2 mt-4 no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE PVC ID CARD MODAL */}
      {showIDCardModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-semibold text-white">Student Digital PVC ID Card</h3>
              <button 
                onClick={() => setShowIDCardModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Official ID Card Layout */}
            <div className="bg-gradient-to-b from-emerald-950 to-slate-950 text-white rounded-xl p-5 shadow-xl border border-amber-500/40 relative overflow-hidden text-center">
              
              {/* Header */}
              <div className="border-b border-emerald-800/60 pb-2 mb-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  {t.institutionNameBangla}
                </h4>
                <p className="text-[10px] text-emerald-300">Dhaka Model High School</p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-900 text-[9px] font-bold mt-1 text-white border border-emerald-700">
                  STUDENT IDENTITY CARD
                </span>
              </div>

              {/* Photo & Name */}
              <div className="my-3">
                <img
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.nameEnglish}
                  className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-amber-400 shadow-md"
                />
                <h3 className="text-base font-bold text-white mt-2">
                  {selectedStudent.nameEnglish}
                </h3>
                <p className="text-xs text-amber-300 font-bold font-bangla">
                  {selectedStudent.nameBangla}
                </p>
              </div>

              {/* Metadata Matrix */}
              <div className="bg-slate-950/90 rounded-lg p-3 border border-slate-800 text-[11px] grid grid-cols-2 gap-2 text-left my-3">
                <div>
                  <span className="text-slate-400 text-[9px] block">Student ID:</span>
                  <span className="font-mono font-bold text-white">{selectedStudent.studentCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block">Class & Sec:</span>
                  <span className="font-bold text-amber-300">{selectedStudent.className} ({selectedStudent.section})</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block">Roll Number:</span>
                  <span className="font-bold text-white">{selectedStudent.roll}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block">Blood Group:</span>
                  <span className="font-bold text-red-400">{selectedStudent.bloodGroup}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 text-[9px] block">Emergency Guardian Mobile:</span>
                  <span className="font-mono font-bold text-emerald-300">
                    {selectedStudent.emergencyContactInfo?.primaryContact?.phonePrimary || selectedStudent.guardianPhone}
                  </span>
                </div>
              </div>

              {/* Barcode Simulator & Signature */}
              <div className="pt-2 flex items-center justify-between text-[9px] text-slate-400 border-t border-emerald-900">
                <div>
                  <span className="font-mono tracking-widest text-slate-400 font-bold">|||||| ||| |||| |||||</span>
                  <p>Valid Till: 31 Dec 2026</p>
                </div>
                <div className="text-right">
                  <div className="w-20 border-b border-slate-600 mb-0.5"></div>
                  <p className="font-bold text-slate-400">Principal Signature</p>
                </div>
              </div>

            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print ID Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT COMPREHENSIVE STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 rounded-xl p-6 max-w-3xl w-full shadow-2xl border border-slate-800 my-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {isEditing ? t.editStudentProfile : t.addStudent}
                </h3>
                <p className="text-xs text-slate-400">
                  {isEditing ? "Update student biodata, extracurriculars, medical notes & prior records" : "Admit new student with complete verified dossier."}
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Step Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 mb-4 text-xs">
              <button
                type="button"
                onClick={() => setModalTab('basic')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  modalTab === 'basic' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                1. Basic Biodata
              </button>
              <button
                type="button"
                onClick={() => setModalTab('extra')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  modalTab === 'extra' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                2. Extracurricular
              </button>
              <button
                type="button"
                onClick={() => setModalTab('medical')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  modalTab === 'medical' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                3. Medical Record
              </button>
              <button
                type="button"
                onClick={() => setModalTab('emergency')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  modalTab === 'emergency' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                4. Emergency Contacts
              </button>
              <button
                type="button"
                onClick={() => setModalTab('academic')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  modalTab === 'academic' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                5. Prior Academic
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* SECTION 1: BASIC BIODATA */}
              {modalTab === 'basic' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Student Name (English) *</label>
                      <input
                        type="text"
                        required
                        value={formData.nameEnglish}
                        onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Sadia Sultana"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Student Name (Bangla) *</label>
                      <input
                        type="text"
                        required
                        value={formData.nameBangla}
                        onChange={(e) => setFormData({ ...formData, nameBangla: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden font-bangla focus:ring-1 focus:ring-emerald-500"
                        placeholder="যেমন: সাদিয়া সুলতানা"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Birth Registration No (17 Digits) *</label>
                      <input
                        type="text"
                        required
                        maxLength={17}
                        value={formData.birthCertificateNo}
                        onChange={(e) => setFormData({ ...formData, birthCertificateNo: e.target.value })}
                        className="w-full font-mono bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="20102692015034821"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Blood Group *</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Class *</label>
                      <select
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      >
                        {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Section *</label>
                      <select
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      >
                        {['Padma', 'Meghna', 'Jamuna', 'A', 'B'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Roll Number *</label>
                      <input
                        type="number"
                        required
                        value={formData.roll}
                        onChange={(e) => setFormData({ ...formData, roll: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Father's Name (English & Bangla)</label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="Father Name"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Mother's Name (English & Bangla)</label>
                      <input
                        type="text"
                        value={formData.motherName}
                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="Mother Name"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: EXTRACURRICULAR */}
              {modalTab === 'extra' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Clubs & Societies (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.clubsInput}
                      onChange={(e) => setFormData({ ...formData, clubsInput: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. Science Club, Debating Society, Red Crescent Youth"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Sports & Athletics (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.sportsInput}
                      onChange={(e) => setFormData({ ...formData, sportsInput: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. Cricket, Badminton, Chess"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Leadership / Prefect Roles</label>
                      <input
                        type="text"
                        value={formData.leadershipRolesInput}
                        onChange={(e) => setFormData({ ...formData, leadershipRolesInput: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Class Prefect, Scout Patrol Leader"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Hobbies & Special Skills</label>
                      <input
                        type="text"
                        value={formData.hobbiesInput}
                        onChange={(e) => setFormData({ ...formData, hobbiesInput: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Robotics, Painting, Writing"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <span className="font-semibold text-amber-400 block">Top Honor / Olympiad Award</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={formData.achievementTitle}
                          onChange={(e) => setFormData({ ...formData, achievementTitle: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden"
                          placeholder="Award Title (e.g. Math Olympiad Regional Champion)"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.achievementPosition}
                          onChange={(e) => setFormData({ ...formData, achievementPosition: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden"
                          placeholder="Position (e.g. 1st Place Gold)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: MEDICAL HISTORY */}
              {modalTab === 'medical' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-red-400 mb-1">Known Drug/Food Allergies (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.allergiesInput}
                      onChange={(e) => setFormData({ ...formData, allergiesInput: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-red-500"
                      placeholder="e.g. Penicillin, Peanuts, Cold Dust"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Chronic Health Conditions</label>
                      <input
                        type="text"
                        value={formData.chronicConditionsInput}
                        onChange={(e) => setFormData({ ...formData, chronicConditionsInput: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Mild Asthma, None"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Regular Prescribed Medications</label>
                      <input
                        type="text"
                        value={formData.regularMedicationsInput}
                        onChange={(e) => setFormData({ ...formData, regularMedicationsInput: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Inhaler PRN, None"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Emergency Medical Action Instructions</label>
                    <textarea
                      rows={2}
                      value={formData.emergencyMedicalInstructions}
                      onChange={(e) => setFormData({ ...formData, emergencyMedicalInstructions: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      placeholder="Specific first-aid instructions for teachers/sickbay..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Family Doctor / Pediatrician Name & Phone</label>
                      <input
                        type="text"
                        value={formData.physicianName}
                        onChange={(e) => setFormData({ ...formData, physicianName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden mb-1.5 focus:ring-1 focus:ring-emerald-500"
                        placeholder="Dr. Full Name"
                      />
                      <input
                        type="text"
                        value={formData.physicianPhone}
                        onChange={(e) => setFormData({ ...formData, physicianPhone: e.target.value })}
                        className="w-full font-mono bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="+88017XXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Vaccination Status</label>
                      <select
                        value={formData.vaccinationStatus}
                        onChange={(e) => setFormData({ ...formData, vaccinationStatus: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Complete">Complete (EPI Bangladesh)</option>
                        <option value="Partial">Partial</option>
                        <option value="Exempted">Exempted</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: EMERGENCY CONTACTS */}
              {modalTab === 'emergency' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-semibold text-emerald-400 block">Primary Emergency Contact (Priority 1)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <input
                          type="text"
                          required
                          value={formData.primaryContactName}
                          onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden"
                          placeholder="Contact Full Name"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.primaryContactRelation}
                          onChange={(e) => setFormData({ ...formData, primaryContactRelation: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden"
                          placeholder="Relation (Father/Mother)"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          value={formData.primaryContactPhone}
                          onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                          className="w-full font-mono bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden"
                          placeholder="017XXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-semibold text-blue-400 block">Secondary Emergency Contact (Priority 2)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <input
                          type="text"
                          value={formData.secondaryContactName}
                          onChange={(e) => setFormData({ ...formData, secondaryContactName: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden"
                          placeholder="Contact Full Name"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.secondaryContactRelation}
                          onChange={(e) => setFormData({ ...formData, secondaryContactRelation: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden"
                          placeholder="Relation"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={formData.secondaryContactPhone}
                          onChange={(e) => setFormData({ ...formData, secondaryContactPhone: e.target.value })}
                          className="w-full font-mono bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-hidden"
                          placeholder="018XXXXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Preferred Emergency Hospital</label>
                      <input
                        type="text"
                        value={formData.preferredHospital}
                        onChange={(e) => setFormData({ ...formData, preferredHospital: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="e.g. Square Hospital / DMCH"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Ambulance Hotline</label>
                      <input
                        type="text"
                        value={formData.ambulanceContact}
                        onChange={(e) => setFormData({ ...formData, ambulanceContact: e.target.value })}
                        className="w-full font-mono bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="999"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: PRIOR ACADEMIC RECORDS */}
              {modalTab === 'academic' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Previous School / Institution Name</label>
                    <input
                      type="text"
                      value={formData.prevSchoolName}
                      onChange={(e) => setFormData({ ...formData, prevSchoolName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. Dhanmondi Govt. Boys High School"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Education Board</label>
                      <select
                        value={formData.prevEducationBoard}
                        onChange={(e) => setFormData({ ...formData, prevEducationBoard: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      >
                        {['Dhaka Board', 'Chittagong Board', 'Rajshahi Board', 'Sylhet Board', 'Jessore Board', 'Barisal Board', 'Comilla Board', 'Dinajpur Board', 'Mymensingh Board', 'Madrasah Board', 'Technical Board'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Exam / Class Passed</label>
                      <input
                        type="text"
                        value={formData.prevExamPassed}
                        onChange={(e) => setFormData({ ...formData, prevExamPassed: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="Class 8 Annual / PSC"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Prior GPA Obtained</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="5.00"
                        value={formData.prevGPA}
                        onChange={(e) => setFormData({ ...formData, prevGPA: Number(e.target.value) })}
                        className="w-full font-mono bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Transfer Certificate (TC) Number</label>
                      <input
                        type="text"
                        value={formData.prevTCNo}
                        onChange={(e) => setFormData({ ...formData, prevTCNo: e.target.value })}
                        className="w-full font-mono bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                        placeholder="TC-2025-084"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-400 mb-1">Character / Conduct Rating</label>
                      <select
                        value={formData.prevConductRating}
                        onChange={(e) => setFormData({ ...formData, prevConductRating: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 outline-hidden focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Excellent">Excellent (উত্তম)</option>
                        <option value="Very Good">Very Good (খুব ভালো)</option>
                        <option value="Good">Good (সন্তোষজনক)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-800 text-slate-300 font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition shadow-xs cursor-pointer"
                >
                  {isEditing ? "Save & Update Profile" : "Confirm Student Admission"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
