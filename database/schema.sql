-- =========================================================================
-- SonarPathshala - Complete School Management System (ERP)
-- Target Database: if0_42784359_myscmanagement
-- Target Host: sql101.infinityfree.com
-- Website: maneschool.site.je
-- Collation: utf8mb4_unicode_ci (Full Bangla Unicode Support)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+06:00";

-- --------------------------------------------------------
-- Table 1: `roles`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL UNIQUE,
  `display_name_en` VARCHAR(100) NOT NULL,
  `display_name_bn` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `role_name`, `display_name_en`, `display_name_bn`, `description`) VALUES
(1, 'super_admin', 'Super Administrator', 'প্রধান প্রশাসক', 'Full system access & schema maintenance'),
(2, 'admin', 'Headmaster / Principal', 'প্রধান শিক্ষক ও অধ্যক্ষ', 'Institutional administrative management'),
(3, 'teacher', 'Subject Teacher', 'বিষয়ভিত্তিক শিক্ষক', 'Marks, attendance, and continuous assessment'),
(4, 'staff', 'Accounts Officer', 'হিসাবরক্ষণ কর্মকর্তা', 'Fees collection, payroll, and financial reports'),
(5, 'guardian', 'Guardian / Parent', 'অভিভাবক', 'Student progress, attendance alerts, online fees'),
(6, 'student', 'Student', 'শিক্ষার্থী', 'Student portal & learning materials');

-- --------------------------------------------------------
-- Table 2: `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `role_id` INT UNSIGNED NOT NULL,
  `username` VARCHAR(80) NULL UNIQUE,
  `email` VARCHAR(120) NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name_en` VARCHAR(150) NOT NULL,
  `full_name_bn` VARCHAR(150) NOT NULL,
  `avatar_url` VARCHAR(255) NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `two_factor_secret` VARCHAR(255) NULL,
  `last_login_at` DATETIME NULL,
  `last_login_ip` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `uuid`, `role_id`, `username`, `email`, `phone`, `password_hash`, `full_name_en`, `full_name_bn`) VALUES
(1, 'u-superadmin-001', 1, 'superadmin', 'admin@maneschool.site.je', '+8801711000001', '$2y$12$K8y5E1U9Z3x8F7Q8J4gUu.VlU.gHq9nKq1XQG2aT4YpXG6k.M7i', 'Md. Zahirul Islam', 'মো. জহিরুল ইসলাম'),
(2, 'u-headmaster-002', 2, 'principal_anwar', 'principal@maneschool.site.je', '+8801711002233', '$2y$12$K8y5E1U9Z3x8F7Q8J4gUu.VlU.gHq9nKq1XQG2aT4YpXG6k.M7i', 'Prof. Md. Anwar Hossain', 'অধ্যাপক মোঃ আনোয়ার হোসেন'),
(3, 'u-teacher-003', 3, 'tariqul_math', 'tariqul.math@maneschool.site.je', '+8801715443322', '$2y$12$K8y5E1U9Z3x8F7Q8J4gUu.VlU.gHq9nKq1XQG2aT4YpXG6k.M7i', 'Md. Tariqul Islam', 'মোঃ তারিকুল ইসলাম'),
(4, 'u-staff-004', 4, 'accounts.hasan', 'accounts@maneschool.site.je', '+8801713000004', '$2y$12$K8y5E1U9Z3x8F7Q8J4gUu.VlU.gHq9nKq1XQG2aT4YpXG6k.M7i', 'Kamrul Hasan', 'কামরুল হাসান');

-- --------------------------------------------------------
-- Table 3: `teachers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `teacher_code` VARCHAR(30) NOT NULL UNIQUE,
  `full_name_en` VARCHAR(150) NOT NULL,
  `full_name_bn` VARCHAR(150) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `primary_subject` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(120) NULL,
  `joining_date` DATE NOT NULL,
  `base_salary` DECIMAL(10,2) NOT NULL DEFAULT 25000.00,
  `avatar_url` VARCHAR(255) NULL,
  `status` ENUM('active', 'on_leave', 'resigned') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_teachers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `teachers` (`id`, `user_id`, `teacher_code`, `full_name_en`, `full_name_bn`, `designation`, `department`, `primary_subject`, `phone`, `email`, `joining_date`, `base_salary`, `avatar_url`) VALUES
(1, 3, 'TCH-2026-001', 'Md. Tariqul Islam', 'মোঃ তারিকুল ইসলাম', 'Senior Teacher & Class 9 Teacher', 'Mathematics', 'Higher Mathematics', '+8801715443322', 'tariqul.math@maneschool.site.je', '2020-01-01', 35000.00, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'),
(2, NULL, 'TCH-2026-002', 'Nusrat Jahan Chowdhury', 'নুসরাত জাহান চৌধুরী', 'Assistant Teacher', 'Science', 'Physics & Chemistry', '+8801718990011', 'nusrat.phy@maneschool.site.je', '2022-03-15', 28000.00, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
(3, NULL, 'TCH-2026-003', 'Abul Kashem', 'আবুল কাশেম', 'Lecturer', 'Bangla Language & Literature', 'Bangla 1st & 2nd Paper', '+8801812334455', 'kashem.bangla@maneschool.site.je', '2019-07-10', 32000.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');

-- --------------------------------------------------------
-- Table 4: `students`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_code` VARCHAR(30) NOT NULL UNIQUE,
  `user_id` BIGINT UNSIGNED NULL UNIQUE,
  `roll_number` INT UNSIGNED NOT NULL,
  `class_name` VARCHAR(50) NOT NULL,
  `section_name` VARCHAR(50) NOT NULL,
  `session_year` INT UNSIGNED NOT NULL DEFAULT 2026,
  `full_name_en` VARCHAR(150) NOT NULL,
  `full_name_bn` VARCHAR(150) NOT NULL,
  `gender` ENUM('male', 'female', 'other') NOT NULL,
  `dob` DATE NOT NULL,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `birth_certificate_no` VARCHAR(30) NOT NULL,
  `religion` VARCHAR(50) DEFAULT 'Islam',
  `avatar_url` VARCHAR(255) NULL,
  `father_name_en` VARCHAR(150) NOT NULL,
  `father_name_bn` VARCHAR(150) NULL,
  `mother_name_en` VARCHAR(150) NOT NULL,
  `mother_name_bn` VARCHAR(150) NULL,
  `guardian_name` VARCHAR(150) NOT NULL,
  `guardian_relation` VARCHAR(50) NOT NULL,
  `guardian_phone` VARCHAR(20) NOT NULL,
  `guardian_email` VARCHAR(120) NULL,
  `emergency_contact` VARCHAR(20) NOT NULL,
  `present_address` TEXT NOT NULL,
  `permanent_address` TEXT NOT NULL,
  `upazila` VARCHAR(80) NOT NULL,
  `district` VARCHAR(80) NOT NULL,
  `admission_date` DATE NOT NULL,
  `status` ENUM('active', 'transferred', 'graduated', 'suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_class_section_roll` (`class_name`, `section_name`, `roll_number`),
  INDEX `idx_guardian_phone` (`guardian_phone`),
  INDEX `idx_birth_certificate` (`birth_certificate_no`),
  CONSTRAINT `fk_students_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `students` (`id`, `student_code`, `roll_number`, `class_name`, `section_name`, `session_year`, `full_name_en`, `full_name_bn`, `gender`, `dob`, `blood_group`, `birth_certificate_no`, `religion`, `avatar_url`, `father_name_en`, `father_name_bn`, `mother_name_en`, `mother_name_bn`, `guardian_name`, `guardian_relation`, `guardian_phone`, `emergency_contact`, `present_address`, `permanent_address`, `upazila`, `district`, `admission_date`, `status`) VALUES
(1, 'SP-2026-0901', 1, 'Class 9', 'Padma', 2026, 'Nusrat Jahan', 'নুসরাত জাহান', 'female', '2010-04-15', 'B+', '20102692015034821', 'Islam', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80', 'Md. Rafiqul Islam', 'মো. রফিকুল ইসলাম', 'Shamsun Nahar', 'শামসুন নাহার', 'Md. Rafiqul Islam', 'Father', '+8801712345678', '+8801819234567', 'House 14, Road 5, Block B, Dhanmondi, Dhaka', 'Vill: Alampur, Post: Sonargaon, Dist: Narayanganj', 'Dhanmondi', 'Dhaka', '2022-01-10', 'active'),
(2, 'SP-2026-0902', 2, 'Class 9', 'Padma', 2026, 'Tanvir Ahmed', 'তানভীর আহমেদ', 'male', '2010-08-22', 'O+', '20102692015099312', 'Islam', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', 'Kabir Ahmed', 'কবীর আহমেদ', 'Farhana Begum', 'ফারহানা বেগম', 'Kabir Ahmed', 'Father', '+8801819876543', '+8801711223344', 'Flat 4B, Green Road, Dhanmondi, Dhaka', 'Vill: Maijdee, Noakhali Sadar, Dist: Noakhali', 'Dhanmondi', 'Dhaka', '2022-01-10', 'active'),
(3, 'SP-2026-1001', 1, 'Class 10', 'Meghna', 2026, 'Sadia Sultana', 'সাদিয়া সুলতানা', 'female', '2009-02-18', 'A+', '20092692015088214', 'Islam', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', 'Mustafizur Rahman', 'মুস্তাফিজুর রহমান', 'Salma Khatun', 'সালমা খাতুন', 'Mustafizur Rahman', 'Father', '+8801911234567', '+8801715667788', 'House 8, Sector 4, Uttara, Dhaka', 'Vill: Shibpur, Narsingdi', 'Uttara', 'Dhaka', '2021-01-15', 'active');

-- --------------------------------------------------------
-- Table 5: `student_extracurriculars`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `student_extracurriculars`;
CREATE TABLE `student_extracurriculars` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `clubs_json` JSON NULL,
  `sports_json` JSON NULL,
  `leadership_roles_json` JSON NULL,
  `hobbies_json` JSON NULL,
  `achievements_json` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_extra_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `student_extracurriculars` (`student_id`, `clubs_json`, `sports_json`, `leadership_roles_json`, `hobbies_json`, `achievements_json`) VALUES
(1, '["Science Club", "Debating Society", "Red Crescent Youth"]', '["Badminton", "Chess", "Table Tennis"]', '["Class Prefect (2026)", "Science Club Vice-President"]', '["Robotics Programming", "Calligraphy", "Astronomy"]', '[{"id": "ach-1", "title": "National Math Olympiad Regional Champion", "year": 2025, "category": "olympiad", "level": "District", "position": "1st Place (Gold)", "description": "Ranked 1st in Dhaka South Regional Math Olympiad"}]'),
(2, '["Cricket Academy", "English Language Club"]', '["Cricket", "Athletics", "Football"]', '["Sports Vice-Captain"]', '["Photography", "Cycling"]', '[{"id": "ach-2", "title": "Inter-School Junior Cricket Tournament", "year": 2025, "category": "sports", "level": "District", "position": "Best Bowler", "description": "Took 14 wickets in tournament"}]'),
(3, '["Debating Club", "Model United Nations", "Cultural Troupe"]', '["Table Tennis", "Handball"]', '["School Senior Prefect", "President - Debating Society"]', '["Creative Writing", "Recitation", "Guitar"]', '[{"id": "ach-3", "title": "National Inter-School Debate Championship", "year": 2025, "category": "debate", "level": "National", "position": "Champion Speaker", "description": "Awarded Best Parliamentary Debater"}]');

-- --------------------------------------------------------
-- Table 6: `student_medical_histories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `student_medical_histories`;
CREATE TABLE `student_medical_histories` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `blood_group` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  `known_allergies_json` JSON NULL,
  `chronic_conditions_json` JSON NULL,
  `regular_medications_json` JSON NULL,
  `special_needs` TEXT NULL,
  `primary_physician_name` VARCHAR(150) NULL,
  `primary_physician_phone` VARCHAR(30) NULL,
  `emergency_medical_instructions` TEXT NULL,
  `last_health_checkup_date` DATE NULL,
  `vaccination_status` ENUM('Complete', 'Partial', 'Exempted') DEFAULT 'Complete',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_medical_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `student_medical_histories` (`student_id`, `blood_group`, `known_allergies_json`, `chronic_conditions_json`, `regular_medications_json`, `special_needs`, `primary_physician_name`, `primary_physician_phone`, `emergency_medical_instructions`, `last_health_checkup_date`, `vaccination_status`) VALUES
(1, 'B+', '["Dust & Pollen", "Cold Agglutinins"]', '["Mild Exercise-Induced Asthma"]', '["Salbutamol Inhaler (100mcg PRN)"]', 'Prefers well-ventilated seating near windows during seasonal shifts.', 'Dr. M. A. Karim, MBBS, FCPS', '+8801711223344', 'If acute shortness of breath occurs, assist with emergency inhaler stored in sickbay and immediately alert guardian.', '2026-02-10', 'Complete'),
(2, 'O+', '["Penicillin / Amoxicillin Antibiotics"]', '[]', '[]', 'None reported.', 'Dr. Farhana Yasmin, MBBS, DCH', '+8801819556677', 'In case of sports injuries, apply cold compress and notify guardian immediately.', '2026-01-20', 'Complete'),
(3, 'A+', '[]', '[]', '[]', 'Corrective eyeglasses for distant vision.', 'Dr. Shamsul Huda, MBBS, MD', '+8801912889900', 'Standard first aid protocol. Sickbay records fully updated.', '2026-01-14', 'Complete');

-- --------------------------------------------------------
-- Table 7: `student_emergency_contacts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `student_emergency_contacts`;
CREATE TABLE `student_emergency_contacts` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `primary_name` VARCHAR(150) NOT NULL,
  `primary_relation` VARCHAR(50) NOT NULL,
  `primary_phone` VARCHAR(20) NOT NULL,
  `primary_phone_secondary` VARCHAR(20) NULL,
  `primary_email` VARCHAR(120) NULL,
  `primary_workplace` TEXT NULL,
  `primary_authorized_pickup` TINYINT(1) DEFAULT 1,
  `secondary_name` VARCHAR(150) NULL,
  `secondary_relation` VARCHAR(50) NULL,
  `secondary_phone` VARCHAR(20) NULL,
  `secondary_workplace` TEXT NULL,
  `secondary_authorized_pickup` TINYINT(1) DEFAULT 1,
  `preferred_hospital` VARCHAR(200) NULL,
  `ambulance_contact` VARCHAR(50) DEFAULT '999',
  `special_pickup_instructions` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_emergency_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `student_emergency_contacts` (`student_id`, `primary_name`, `primary_relation`, `primary_phone`, `primary_phone_secondary`, `primary_email`, `primary_workplace`, `primary_authorized_pickup`, `secondary_name`, `secondary_relation`, `secondary_phone`, `secondary_workplace`, `secondary_authorized_pickup`, `preferred_hospital`, `ambulance_contact`, `special_pickup_instructions`) VALUES
(1, 'Md. Rafiqul Islam', 'Father', '+8801712345678', '+8801711002288', 'rafiq.islam@gmail.com', 'BEXIMCO Corporate HQ, Dhanmondi, Dhaka', 1, 'Shamsun Nahar', 'Mother', '+8801819234567', 'Dhanmondi, Dhaka', 1, 'Square Hospital / Dhaka Medical College Hospital', '999 / +8801713377775', 'Valid Guardian ID card or prior telephonic SMS authorization required for release.'),
(2, 'Kabir Ahmed', 'Father', '+8801819876543', NULL, 'kabir.ahmed@yahoo.com', 'Motijheel C/A, Dhaka', 1, 'Farhana Begum', 'Mother', '+8801711223344', 'Green Road, Dhaka', 1, 'Bangladesh Medical College Hospital, Dhanmondi', '999 / +8801711001122', 'Release only to parents with verified biometric token.'),
(3, 'Mustafizur Rahman', 'Father', '+8801911234567', NULL, 'mustafiz.rahman@dhaka.gov.bd', 'Bangladesh Secretariat, Segunbagicha, Dhaka', 1, 'Salma Khatun', 'Mother', '+8801715667788', 'Sector 4, Uttara, Dhaka', 1, 'Kuwait Bangladesh Friendship Government Hospital, Uttara', '999 / +8801711448899', 'Valid school guardian token required.');

-- --------------------------------------------------------
-- Table 8: `attendance`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('present', 'absent', 'late', 'excused') NOT NULL,
  `in_time` TIME NULL,
  `out_time` TIME NULL,
  `sms_sent` TINYINT(1) DEFAULT 0,
  `remarks` VARCHAR(255) NULL,
  `recorded_by` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_student_date` (`student_id`, `date`),
  CONSTRAINT `fk_att_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `attendance` (`student_id`, `date`, `status`, `in_time`, `sms_sent`, `remarks`) VALUES
(1, CURDATE(), 'present', '07:55:00', 1, 'On time'),
(2, CURDATE(), 'present', '07:58:00', 1, 'On time'),
(3, CURDATE(), 'present', '07:50:00', 1, 'Early arrival');

-- --------------------------------------------------------
-- Table 9: `exam_grades`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `exam_grades`;
CREATE TABLE `exam_grades` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `exam_term` VARCHAR(50) NOT NULL,
  `subject_name` VARCHAR(100) NOT NULL,
  `full_marks` INT UNSIGNED NOT NULL DEFAULT 100,
  `obtained_marks` DECIMAL(5,2) NOT NULL,
  `letter_grade` VARCHAR(5) NOT NULL,
  `grade_point` DECIMAL(3,2) NOT NULL,
  `remarks` TEXT NULL,
  `published_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_grades_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `exam_grades` (`student_id`, `exam_term`, `subject_name`, `full_marks`, `obtained_marks`, `letter_grade`, `grade_point`, `remarks`, `published_date`) VALUES
(1, 'Half Yearly 2026', 'Higher Mathematics', 100, 95.00, 'A+', 5.00, 'Excellent problem solving skills', CURDATE()),
(1, 'Half Yearly 2026', 'Physics', 100, 92.00, 'A+', 5.00, 'Outstanding lab assessment', CURDATE()),
(2, 'Half Yearly 2026', 'Higher Mathematics', 100, 88.00, 'A+', 5.00, 'Very good analytical performance', CURDATE()),
(3, 'Half Yearly 2026', 'General Science', 100, 96.00, 'A+', 5.00, 'Top score in class', CURDATE());

-- --------------------------------------------------------
-- Table 10: `fees_invoices`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `fees_invoices`;
CREATE TABLE `fees_invoices` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `invoice_no` VARCHAR(50) NOT NULL UNIQUE,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `year` INT UNSIGNED NOT NULL,
  `tuition_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `exam_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `session_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `lab_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `late_fine` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `waiver_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_payable` DECIMAL(10,2) NOT NULL,
  `paid_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('paid', 'partial', 'unpaid', 'overdue') DEFAULT 'unpaid',
  `payment_method` ENUM('cash', 'bkash', 'nagad', 'rocket', 'bank') NULL,
  `trx_id` VARCHAR(100) NULL,
  `payment_date` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fee_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fees_invoices` (`invoice_no`, `student_id`, `month`, `year`, `tuition_fee`, `exam_fee`, `total_payable`, `paid_amount`, `status`, `payment_method`, `trx_id`, `payment_date`) VALUES
('INV-2026-02-001', 1, 'February', 2026, 1200.00, 500.00, 1700.00, 1700.00, 'paid', 'bkash', 'BKASH92019482X', '2026-02-05 10:15:00'),
('INV-2026-02-002', 2, 'February', 2026, 1200.00, 500.00, 1700.00, 1700.00, 'paid', 'nagad', 'NGD773910482B', '2026-02-06 14:30:00'),
('INV-2026-02-003', 3, 'February', 2026, 1200.00, 500.00, 1700.00, 1700.00, 'paid', 'cash', 'CASH-REC-084', '2026-02-08 09:00:00');

-- --------------------------------------------------------
-- Table 11: `teacher_payrolls`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `teacher_payrolls`;
CREATE TABLE `teacher_payrolls` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `teacher_id` BIGINT UNSIGNED NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `year` INT UNSIGNED NOT NULL,
  `base_salary` DECIMAL(10,2) NOT NULL,
  `allowances` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `deductions` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `net_payable` DECIMAL(10,2) NOT NULL,
  `payment_status` ENUM('pending', 'approved', 'disbursed') DEFAULT 'pending',
  `disbursed_at` DATETIME NULL,
  `payment_method` VARCHAR(50) NULL,
  `transaction_ref` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_payroll_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `teacher_payrolls` (`teacher_id`, `month`, `year`, `base_salary`, `allowances`, `deductions`, `net_payable`, `payment_status`, `disbursed_at`, `payment_method`, `transaction_ref`) VALUES
(1, 'February', 2026, 35000.00, 3000.00, 1000.00, 37000.00, 'disbursed', '2026-02-28 16:00:00', 'Bank Transfer', 'BFT-DBBL-99201'),
(2, 'February', 2026, 28000.00, 2500.00, 500.00, 30000.00, 'disbursed', '2026-02-28 16:05:00', 'bKash', 'BKASH-SAL-88219'),
(3, 'February', 2026, 32000.00, 3000.00, 800.00, 34200.00, 'disbursed', '2026-02-28 16:10:00', 'Bank Transfer', 'BFT-EBL-44910');

-- --------------------------------------------------------
-- Table 12: `school_notices`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `school_notices`;
CREATE TABLE `school_notices` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_bn` VARCHAR(255) NOT NULL,
  `content_en` TEXT NOT NULL,
  `content_bn` TEXT NOT NULL,
  `category` ENUM('academic', 'emergency', 'holiday', 'event', 'fees') DEFAULT 'academic',
  `target_audience` ENUM('all', 'students', 'teachers', 'guardians') DEFAULT 'all',
  `published_by` BIGINT UNSIGNED NULL,
  `is_pinned` TINYINT(1) DEFAULT 0,
  `sms_sent` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notices_user` FOREIGN KEY (`published_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `school_notices` (`title_en`, `title_bn`, `content_en`, `content_bn`, `category`, `target_audience`, `published_by`, `is_pinned`, `sms_sent`) VALUES
('Annual Sports & Cultural Week 2026', 'বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা ২০২৬', 'The annual sports competition will take place from March 15 to March 18. All students are encouraged to register with their respective class teachers.', 'আগামী ১৫ মার্চ থেকে ১৮ মার্চ পর্যন্ত বিদ্যালয়ের বার্ষিক ক্রীড়া ও সাংস্কৃতিক সপ্তাহ অনুষ্ঠিত হবে। সকল শিক্ষার্থীকে শ্রেণি শিক্ষকের সাথে যোগাযোগ করার অনুরোধ করা হচ্ছে।', 'event', 'all', 2, 1, 1),
('Second Term Exam Fee Submission Notice', 'দ্বিতীয় সাময়িক পরীক্ষার ফি জমাদানের বিজ্ঞপ্তি', 'All guardians are requested to clear all pending monthly tuition and exam fees through online bKash/Nagad gateway or school bank counter by 10th of this month.', 'সকল অভিভাবককে বিনীতভাবে অনুরোধ করা হচ্ছে যে চলতি মাসের ১০ তারিখের মধ্যে অনলাইন বিকাশ/নগদ অথবা স্কুল কাউন্টারে টিউশন ও পরীক্ষার ফি পরিশোধ করুন।', 'fees', 'guardians', 4, 0, 1);

-- --------------------------------------------------------
-- Table 13: `sms_logs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `sms_logs`;
CREATE TABLE `sms_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `recipient_phone` VARCHAR(20) NOT NULL,
  `recipient_name` VARCHAR(150) NULL,
  `message_body` TEXT NOT NULL,
  `sms_type` ENUM('attendance', 'urgent_notice', 'fees_reminder', 'grade_alert', 'custom') NOT NULL,
  `status` ENUM('delivered', 'sent', 'failed', 'pending') DEFAULT 'delivered',
  `gateway_response` VARCHAR(255) NULL,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sms_logs` (`recipient_phone`, `recipient_name`, `message_body`, `sms_type`, `status`) VALUES
('+8801712345678', 'Md. Rafiqul Islam', 'Dear Guardian, Nusrat Jahan has safely arrived at school today at 07:55 AM. - SonarPathshala', 'attendance', 'delivered'),
('+8801819876543', 'Kabir Ahmed', 'Dear Guardian, Tanvir Ahmed has safely arrived at school today at 07:58 AM. - SonarPathshala', 'attendance', 'delivered');

-- --------------------------------------------------------
-- Table 14: `audit_logs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` BIGINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `details_json` JSON NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `audit_logs` (`user_id`, `action`, `entity_type`, `entity_id`, `ip_address`, `details_json`) VALUES
(1, 'STUDENT_ADMISSION', 'students', 1, '192.168.1.100', '{"studentCode": "SP-2026-0901", "name": "Nusrat Jahan", "class": "Class 9"}'),
(4, 'FEE_COLLECTION', 'fees_invoices', 1, '192.168.1.105', '{"invoiceNo": "INV-2026-02-001", "amount": 1700, "method": "bkash"}');

SET FOREIGN_KEY_CHECKS = 1;
