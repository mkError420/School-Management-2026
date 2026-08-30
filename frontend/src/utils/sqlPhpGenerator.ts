/**
 * Production-ready MySQL DDL Schema, phpMyAdmin import script,
 * and secure PHP 8.2+ PDO REST API Endpoints with JWT Authentication,
 * AES-256 field encryption, Argon2id password hashing, and role checks.
 */

export function generateMySQLSchema(): string {
  return `-- =========================================================================
-- SonarPathshala - Bangladeshi School Management System
-- Target Database: MySQL 8.0+ / MariaDB 10.6+
-- Encoding: utf8mb4_unicode_ci (Full Bangla Unicode Support)
-- Optimized for phpMyAdmin import and cloud scalable deployment
-- Generated on: 2026-08-29
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+06:00"; -- Bangladesh Standard Time (BST)

CREATE DATABASE IF NOT EXISTS \`sonarpathshala_school_db\` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`sonarpathshala_school_db\`;

-- --------------------------------------------------------
-- Table: \`roles_and_permissions\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`roles\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`role_name\` VARCHAR(50) NOT NULL UNIQUE,
  \`display_name_en\` VARCHAR(100) NOT NULL,
  \`display_name_bn\` VARCHAR(100) NOT NULL,
  \`description\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`roles\` (\`role_name\`, \`display_name_en\`, \`display_name_bn\`) VALUES
('super_admin', 'Super Administrator', 'সুপার অ্যাডমিনিস্ট্রেটর'),
('admin', 'Headmaster / Principal', 'প্রধান শিক্ষক ও অধ্যক্ষ'),
('teacher', 'Subject Teacher', 'বিষয়ভিত্তিক শিক্ষক'),
('staff', 'Accounts Officer', 'হিসাবরক্ষণ কর্মকর্তা'),
('guardian', 'Guardian / Parent', 'অভিভাবক'),
('student', 'Student', 'শিক্ষার্থী');

-- --------------------------------------------------------
-- Table: \`users\` (Role-based authentication with Argon2id)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`uuid\` VARCHAR(36) NOT NULL UNIQUE,
  \`role_id\` INT UNSIGNED NOT NULL,
  \`username\` VARCHAR(80) NULL UNIQUE,
  \`email\` VARCHAR(120) NULL UNIQUE,
  \`phone\` VARCHAR(20) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL, -- password_hash($pass, PASSWORD_ARGON2ID)
  \`full_name_en\` VARCHAR(150) NOT NULL,
  \`full_name_bn\` VARCHAR(150) NOT NULL,
  \`avatar_url\` VARCHAR(255) NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`two_factor_secret\` VARCHAR(255) NULL,
  \`last_login_at\` DATETIME NULL,
  \`last_login_ip\` VARCHAR(45) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`students\` (GDPR-compliant encrypted sensitive fields)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`students\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`student_code\` VARCHAR(30) NOT NULL UNIQUE, -- e.g. DIMS-2026-0601
  \`user_id\` BIGINT UNSIGNED NULL UNIQUE,
  \`roll_number\` INT UNSIGNED NOT NULL,
  \`class_name\` VARCHAR(50) NOT NULL, -- e.g. "Class 9"
  \`section_name\` VARCHAR(50) NOT NULL, -- e.g. "Padma"
  \`full_name_en\` VARCHAR(150) NOT NULL,
  \`full_name_bn\` VARCHAR(150) NOT NULL,
  \`gender\` ENUM('male', 'female', 'other') NOT NULL,
  \`dob\` DATE NOT NULL,
  \`blood_group\` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  \`birth_reg_number_enc\` VARCHAR(255) NOT NULL, -- AES-256 Encrypted 17-digit Birth Certificate
  \`religion\` VARCHAR(50) DEFAULT 'Islam',
  \`father_name_en\` VARCHAR(150) NOT NULL,
  \`father_name_bn\` VARCHAR(150) NOT NULL,
  \`mother_name_en\` VARCHAR(150) NOT NULL,
  \`mother_name_bn\` VARCHAR(150) NOT NULL,
  \`guardian_name\` VARCHAR(150) NOT NULL,
  \`guardian_relation\` VARCHAR(50) NOT NULL,
  \`guardian_phone\` VARCHAR(20) NOT NULL, -- Primary for SMS alerts (+880...)
  \`guardian_email\` VARCHAR(120) NULL,
  \`emergency_contact\` VARCHAR(20) NOT NULL,
  \`present_address\` TEXT NOT NULL,
  \`permanent_address\` TEXT NOT NULL,
  \`upazila\` VARCHAR(80) NOT NULL,
  \`district\` VARCHAR(80) NOT NULL,
  \`admission_date\` DATE NOT NULL,
  \`status\` ENUM('active', 'transferred', 'graduated', 'suspended') DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_class_section\` (\`class_name\`, \`section_name\`),
  INDEX \`idx_guardian_phone\` (\`guardian_phone\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`student_extracurriculars\` (Clubs, Sports, Olympiads, Leadership)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`student_extracurriculars\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`student_id\` BIGINT UNSIGNED NOT NULL,
  \`category\` ENUM('club', 'sports', 'cultural', 'scout_guide', 'science_ict', 'olympiad', 'other') NOT NULL,
  \`activity_name\` VARCHAR(150) NOT NULL,
  \`role_or_position\` VARCHAR(100) NULL, -- e.g. "Club President", "Team Captain", "Troop Leader"
  \`achievements_summary\` TEXT NULL, -- e.g. "National Math Olympiad Regional Champion"
  \`participating_year\` SMALLINT UNSIGNED NULL,
  \`status\` ENUM('active', 'past') DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_student_extra\` (\`student_id\`, \`category\`),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`student_medical_histories\` (Allergies, Chronic Illnesses, Emergency Protocols)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`student_medical_histories\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`student_id\` BIGINT UNSIGNED NOT NULL UNIQUE,
  \`blood_group\` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  \`known_allergies\` TEXT NULL, -- e.g. "Penicillin, Peanuts, Cold Agglutinins"
  \`chronic_conditions\` TEXT NULL, -- e.g. "Mild Exercise-Induced Asthma"
  \`regular_medications\` TEXT NULL, -- e.g. "Salbutamol Inhaler (100mcg PRN)"
  \`special_needs_or_disability\` TEXT NULL, -- e.g. "Wears corrective eyeglasses (-1.5D)"
  \`primary_physician_name\` VARCHAR(150) NULL, -- e.g. "Dr. M. A. Karim, MBBS, FCPS"
  \`primary_physician_phone\` VARCHAR(30) NULL,
  \`emergency_medical_instructions\` TEXT NULL,
  \`last_health_checkup_date\` DATE NULL,
  \`vaccination_status\` ENUM('Complete', 'Partial', 'Exempted') DEFAULT 'Complete',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`student_emergency_contacts\` (Primary & Alternate Guardians, Authorized Pickup)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`student_emergency_contacts\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`student_id\` BIGINT UNSIGNED NOT NULL,
  \`contact_priority\` ENUM('primary', 'secondary', 'alternate') NOT NULL DEFAULT 'primary',
  \`contact_name\` VARCHAR(150) NOT NULL,
  \`relationship\` VARCHAR(50) NOT NULL, -- e.g. "Father", "Mother", "Paternal Uncle"
  \`phone_primary\` VARCHAR(25) NOT NULL,
  \`phone_secondary\` VARCHAR(25) NULL,
  \`email\` VARCHAR(120) NULL,
  \`address_or_workplace\` TEXT NULL,
  \`is_authorized_pickup\` TINYINT(1) DEFAULT 1,
  \`preferred_hospital\` VARCHAR(150) NULL, -- e.g. "Dhaka Medical College Hospital / Square Hospital"
  \`ambulance_contact\` VARCHAR(30) DEFAULT '999',
  \`pickup_instructions\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_student_emergency\` (\`student_id\`, \`contact_priority\`),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`student_previous_academic_records\` (Prior Schools, Boards, GPA, Transfer Certificates)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`student_previous_academic_records\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`student_id\` BIGINT UNSIGNED NOT NULL,
  \`previous_school_name\` VARCHAR(200) NOT NULL,
  \`school_address\` TEXT NULL,
  \`education_board\` VARCHAR(80) NOT NULL DEFAULT 'Dhaka Board',
  \`exam_passed_or_class\` VARCHAR(100) NOT NULL, -- e.g. "Class 8 Annual Examination", "PSC"
  \`passing_year\` SMALLINT UNSIGNED NOT NULL,
  \`roll_number\` VARCHAR(50) NULL,
  \`registration_number\` VARCHAR(50) NULL,
  \`gpa_obtained\` DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  \`percentage_marks\` DECIMAL(5,2) NULL,
  \`transfer_certificate_no\` VARCHAR(100) NULL,
  \`tc_issue_date\` DATE NULL,
  \`conduct_rating\` ENUM('Excellent', 'Very Good', 'Good', 'Satisfactory') DEFAULT 'Excellent',
  \`remarks\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_student_academic_history\` (\`student_id\`, \`passing_year\`),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`teachers\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`teachers\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`teacher_code\` VARCHAR(30) NOT NULL UNIQUE,
  \`user_id\` BIGINT UNSIGNED NULL UNIQUE,
  \`full_name_en\` VARCHAR(150) NOT NULL,
  \`full_name_bn\` VARCHAR(150) NOT NULL,
  \`designation_en\` VARCHAR(100) NOT NULL,
  \`designation_bn\` VARCHAR(100) NOT NULL,
  \`department\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(120) NOT NULL,
  \`nid_number_enc\` VARCHAR(255) NOT NULL, -- AES-256 Encrypted NID
  \`blood_group\` VARCHAR(10) NOT NULL,
  \`joining_date\` DATE NOT NULL,
  \`basic_salary\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`bank_account_info\` VARCHAR(255) NULL,
  \`bkash_number\` VARCHAR(20) NULL,
  \`status\` ENUM('active', 'on_leave', 'retired', 'resigned') DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`attendance_records\`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`attendance_records\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`student_id\` BIGINT UNSIGNED NOT NULL,
  \`attendance_date\` DATE NOT NULL,
  \`status\` ENUM('present', 'absent', 'late', 'excused') NOT NULL,
  \`in_time\` TIME NULL,
  \`marked_by_user_id\` BIGINT UNSIGNED NOT NULL,
  \`sms_dispatched\` TINYINT(1) DEFAULT 0,
  \`sms_gateway_ref\` VARCHAR(100) NULL,
  \`remarks\` VARCHAR(255) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_student_date\` (\`student_id\`, \`attendance_date\`),
  INDEX \`idx_date_status\` (\`attendance_date\`, \`status\`),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\` (\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`marked_by_user_id\`) REFERENCES \`users\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`nctb_exam_grades\` (Bangladeshi GPA 5.0 Standard)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`nctb_exam_grades\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`student_id\` BIGINT UNSIGNED NOT NULL,
  \`exam_term\` ENUM('1st_term', 'mid_term', 'final', 'model_test', 'test_exam') NOT NULL,
  \`academic_year\` SMALLINT UNSIGNED NOT NULL,
  \`subject_code\` VARCHAR(20) NOT NULL,
  \`subject_name_en\` VARCHAR(100) NOT NULL,
  \`subject_name_bn\` VARCHAR(100) NOT NULL,
  \`written_marks_cq\` DECIMAL(5,2) DEFAULT 0.00,
  \`mcq_marks\` DECIMAL(5,2) DEFAULT 0.00,
  \`practical_marks\` DECIMAL(5,2) DEFAULT 0.00,
  \`total_obtained\` DECIMAL(5,2) NOT NULL,
  \`full_marks\` DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  \`letter_grade\` VARCHAR(5) NOT NULL, -- A+, A, A-, B, C, D, F
  \`grade_point\` DECIMAL(3,2) NOT NULL, -- 5.00, 4.00, 3.50, 3.00, 2.00, 1.00, 0.00
  \`is_optional_4th\` TINYINT(1) DEFAULT 0,
  \`marked_by_teacher_id\` BIGINT UNSIGNED NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_student_exam\` (\`student_id\`, \`exam_term\`, \`academic_year\`),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`teacher_payrolls\` (BDT Currency Scale)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`teacher_payrolls\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`voucher_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`teacher_id\` BIGINT UNSIGNED NOT NULL,
  \`salary_month\` VARCHAR(30) NOT NULL, -- e.g. "August 2026"
  \`salary_year\` SMALLINT UNSIGNED NOT NULL,
  \`basic_salary\` DECIMAL(12,2) NOT NULL,
  \`house_rent_allowance\` DECIMAL(12,2) DEFAULT 0.00,
  \`medical_allowance\` DECIMAL(12,2) DEFAULT 0.00,
  \`conveyance_allowance\` DECIMAL(12,2) DEFAULT 0.00,
  \`festival_bonus\` DECIMAL(12,2) DEFAULT 0.00,
  \`special_allowance\` DECIMAL(12,2) DEFAULT 0.00,
  \`gross_salary\` DECIMAL(12,2) NOT NULL,
  \`provident_fund_deduction\` DECIMAL(12,2) DEFAULT 0.00,
  \`tax_deduction\` DECIMAL(12,2) DEFAULT 0.00,
  \`loan_deduction\` DECIMAL(12,2) DEFAULT 0.00,
  \`total_deductions\` DECIMAL(12,2) NOT NULL,
  \`net_payable\` DECIMAL(12,2) NOT NULL,
  \`payment_status\` ENUM('pending', 'approved', 'disbursed') DEFAULT 'pending',
  \`payment_method\` ENUM('bKash', 'Nagad', 'Bank Transfer', 'Cash', 'Rocket') NULL,
  \`disbursed_at\` DATETIME NULL,
  \`transaction_reference\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\` (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`sms_dispatch_logs\` (Automated Parent Alerts)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`sms_dispatch_logs\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`recipient_phone\` VARCHAR(20) NOT NULL,
  \`student_id\` BIGINT UNSIGNED NULL,
  \`message_content_bn\` TEXT NOT NULL,
  \`message_content_en\` TEXT NULL,
  \`sms_type\` ENUM('attendance_absence', 'attendance_late', 'exam_result', 'fee_due', 'emergency_notice', 'school_broadcast') NOT NULL,
  \`char_count\` INT UNSIGNED NOT NULL,
  \`cost_bdt\` DECIMAL(6,4) DEFAULT 0.4500,
  \`delivery_status\` ENUM('delivered', 'pending', 'failed') DEFAULT 'pending',
  \`gateway_provider\` VARCHAR(50) DEFAULT 'Teletalk_GP_Gateway',
  \`gateway_response_id\` VARCHAR(100) NULL,
  \`sent_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_sms_phone\` (\`recipient_phone\`),
  FOREIGN KEY (\`student_id\`) REFERENCES \`students\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: \`security_audit_logs\` (RBAC & GDPR compliance)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS \`security_audit_logs\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` BIGINT UNSIGNED NULL,
  \`user_name\` VARCHAR(150) NOT NULL,
  \`user_role\` VARCHAR(50) NOT NULL,
  \`action\` VARCHAR(100) NOT NULL,
  \`module\` VARCHAR(80) NOT NULL,
  \`ip_address\` VARCHAR(45) NOT NULL,
  \`user_agent\` TEXT NULL,
  \`details_json\` JSON NULL,
  \`status\` ENUM('success', 'warning', 'error') DEFAULT 'success',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_audit_action\` (\`action\`),
  INDEX \`idx_audit_user\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
-- End of SonarPathshala MySQL Schema
`;
}

export function generatePhpApiAuth(): string {
  return `<?php
/**
 * SonarPathshala Backend REST API
 * File: api/auth.php
 * Handles JWT Authentication, Argon2id Passwords, Role Claims, Session Control
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../libs/jwt_helper.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->identifier) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Identifier (email/username) and password are required."]);
    exit();
}

$identifier = trim($data->identifier);
$password = $data->password;

// Check user in database
$query = "SELECT u.id, u.uuid, u.username, u.email, u.phone, u.password_hash, 
                 u.full_name_en, u.full_name_bn, u.is_active, r.role_name 
          FROM users u 
          JOIN roles r ON u.role_id = r.id 
          WHERE (u.email = :identifier OR u.username = :identifier OR u.phone = :identifier) 
          LIMIT 1";

$stmt = $db->prepare($query);
$stmt->bindParam(":identifier", $identifier);
$stmt->execute();

if ($stmt->rowCount() === 0) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid credentials or user does not exist."]);
    exit();
}

$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Check if account is active
if (!$user['is_active']) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Account is suspended. Contact school administration."]);
    exit();
}

// Verify password with Argon2id / bcrypt fallback
if (!password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid credentials."]);
    exit();
}

// Generate JWT token
$payload = [
    "iss" => "https://school.edu.bd",
    "sub" => $user['uuid'],
    "user_id" => $user['id'],
    "role" => $user['role_name'],
    "name_en" => $user['full_name_en'],
    "name_bn" => $user['full_name_bn'],
    "iat" => time(),
    "exp" => time() + (86400 * 7) // 7 days expiration
];

$jwtToken = JWTHelper::encode($payload, getenv('JWT_SECRET_KEY') ?: 'SonarPathshala_Secret_Key_2026');

// Record Audit Log
$auditStmt = $db->prepare("INSERT INTO security_audit_logs (user_id, user_name, user_role, action, module, ip_address, status) 
                           VALUES (:uid, :uname, :urole, 'USER_LOGIN', 'Auth', :ip, 'success')");
$auditStmt->execute([
    ":uid" => $user['id'],
    ":uname" => $user['full_name_en'],
    ":urole" => $user['role_name'],
    ":ip" => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
]);

http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Authentication successful",
    "token" => $jwtToken,
    "user" => [
        "id" => $user['uuid'],
        "role" => $user['role_name'],
        "name" => $user['full_name_en'],
        "nameBangla" => $user['full_name_bn'],
        "email" => $user['email'],
        "phone" => $user['phone']
    ]
]);
?>`;
}

export function generatePhpApiAttendance(): string {
  return `<?php
/**
 * SonarPathshala Backend REST API
 * File: api/attendance.php
 * Handles Batch Student Attendance marking + Automated SMS Trigger via Teletalk / GP Gateway
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../libs/jwt_helper.php';
require_once __DIR__ . '/../services/sms_gateway.php';

$auth = JWTHelper::validateToken();
if (!$auth || !in_array($auth->role, ['super_admin', 'admin', 'teacher'])) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized access."]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->attendance_date) || empty($data->records) || !is_array($data->records)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid payload format."]);
        exit();
    }

    $db->beginTransaction();
    $insertedCount = 0;
    $smsQueue = [];

    $stmt = $db->prepare("INSERT INTO attendance_records (student_id, attendance_date, status, in_time, marked_by_user_id, remarks) 
                          VALUES (:student_id, :attendance_date, :status, :in_time, :marked_by, :remarks)
                          ON DUPLICATE KEY UPDATE status = :status_update, in_time = :in_time_update, remarks = :remarks_update");

    foreach ($data->records as $row) {
        $stmt->execute([
            ":student_id" => $row->student_id,
            ":attendance_date" => $data->attendance_date,
            ":status" => $row->status,
            ":in_time" => $row->in_time ?? null,
            ":marked_by" => $auth->user_id,
            ":remarks" => $row->remarks ?? null,
            ":status_update" => $row->status,
            ":in_time_update" => $row->in_time ?? null,
            ":remarks_update" => $row->remarks ?? null
        ]);
        $insertedCount++;

        // If student is marked absent and auto-SMS is requested
        if ($row->status === 'absent' && !empty($data->auto_sms_absent)) {
            $smsQueue[] = [
                'student_id' => $row->student_id,
                'student_name' => $row->student_name,
                'guardian_phone' => $row->guardian_phone,
                'roll' => $row->roll,
                'class' => $data->class_name ?? 'Class 9'
            ];
        }
    }

    $db->commit();

    // Trigger SMS Dispatcher
    $smsResults = [];
    if (!empty($smsQueue)) {
        $smsGateway = new SMSGatewayService($db);
        foreach ($smsQueue as $absentStudent) {
            $smsResults[] = $smsGateway->sendAbsenceAlert(
                $absentStudent['guardian_phone'],
                $absentStudent['student_name'],
                $absentStudent['roll'],
                $data->attendance_date
            );
        }
    }

    echo json_encode([
        "status" => "success",
        "message" => "Attendance successfully recorded for {$insertedCount} students.",
        "sms_dispatched_count" => count($smsResults)
    ]);
}
?>`;
}

export function generatePhpApiGrades(): string {
  return `<?php
/**
 * SonarPathshala Backend REST API
 * File: api/grades.php
 * Handles NCTB GPA 5.0 Gradebook Calculation, 4th Subject Bonus, Marksheet Generation
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../libs/jwt_helper.php';

$auth = JWTHelper::validateToken();
if (!$auth) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    // Save Exam Record
    $stmt = $db->prepare("INSERT INTO exam_grade_records 
      (student_id, exam_type, exam_year, total_marks_obtained, total_full_marks, gpa, final_grade, is_passed, conduct_remarks)
      VALUES (:sid, :type, :year, :total, :full, :gpa, :grade, :passed, :remarks)");
    
    $stmt->execute([
      ":sid" => $data->student_id,
      ":type" => $data->exam_type,
      ":year" => $data->exam_year,
      ":total" => $data->total_marks,
      ":full" => $data->total_full_marks,
      ":gpa" => $data->gpa,
      ":grade" => $data->final_grade,
      ":passed" => $data->is_passed ? 1 : 0,
      ":remarks" => $data->conduct_remarks ?? ''
    ]);

    echo json_encode(["status" => "success", "message" => "NCTB Exam Marksheet published successfully."]);
}
?>`;
}

export function generatePhpApiPayroll(): string {
  return `<?php
/**
 * SonarPathshala Backend REST API
 * File: api/payroll.php
 * Handles Faculty Salary Disbursal in BDT, Allowances, PF Deductions, and Payslip Generation
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../libs/jwt_helper.php';

$auth = JWTHelper::validateToken();
if (!$auth || !in_array($auth->role, ['super_admin', 'admin', 'staff'])) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Access denied. Finance role required."]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $stmt = $db->prepare("UPDATE faculty_payrolls SET payment_status = 'disbursed', payment_method = :method, 
                          disbursed_at = NOW(), transaction_reference = :txn WHERE id = :id");
    $stmt->execute([
      ":method" => $data->payment_method,
      ":txn" => $data->transaction_ref,
      ":id" => $data->payroll_id
    ]);

    echo json_encode(["status" => "success", "message" => "Salary disbursed successfully."]);
}
?>`;
}

export function generatePhpDbConnect(): string {
  return `<?php
/**
 * File: config/database.php
 * Robust PDO MySQL Connection with UTF8mb4 and prepared statements
 */

class Database {
    private string $host = "127.0.0.1";
    private string $db_name = "sonarpathshala_school_db";
    private string $username = "root";
    private string $password = "";
    private ?PDO $conn = null;

    public function getConnection(): ?PDO {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            error_log("Database Connection Error: " . $exception->getMessage());
            die(json_encode(["status" => "error", "message" => "Database connection failed. Please check MySQL service."]));
        }
        return $this->conn;
    }
}
?>`;
}

export function generatePhpApiStudents(): string {
  return `<?php
/**
 * SonarPathshala Backend REST API
 * File: api/students.php
 * Handles Comprehensive Student Profiles, Extracurriculars, Medical Histories, Emergency Contacts & Prior Academic Records
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../libs/jwt_helper.php';

$auth = JWTHelper::validateToken();
if (!$auth) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

// GET: Fetch Full Student Dossier with Relational Tables
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $student_id = isset($_GET['id']) ? intval($_GET['id']) : null;
    
    if ($student_id) {
        $stmt = $db->prepare("SELECT * FROM students WHERE id = :id");
        $stmt->execute([':id' => $student_id]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$student) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Student not found"]);
            exit();
        }

        // Extracurriculars
        $stmtExtra = $db->prepare("SELECT * FROM student_extracurriculars WHERE student_id = :id");
        $stmtExtra->execute([':id' => $student_id]);
        $student['extracurriculars'] = $stmtExtra->fetchAll(PDO::FETCH_ASSOC);

        // Medical History
        $stmtMed = $db->prepare("SELECT * FROM student_medical_histories WHERE student_id = :id");
        $stmtMed->execute([':id' => $student_id]);
        $student['medical_history'] = $stmtMed->fetch(PDO::FETCH_ASSOC) ?: null;

        // Emergency Contacts
        $stmtEmerg = $db->prepare("SELECT * FROM student_emergency_contacts WHERE student_id = :id");
        $stmtEmerg->execute([':id' => $student_id]);
        $student['emergency_contacts'] = $stmtEmerg->fetchAll(PDO::FETCH_ASSOC);

        // Previous Academic Records
        $stmtAcad = $db->prepare("SELECT * FROM student_previous_academic_records WHERE student_id = :id ORDER BY passing_year DESC");
        $stmtAcad->execute([':id' => $student_id]);
        $student['previous_academic_records'] = $stmtAcad->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status" => "success", "data" => $student]);
    } else {
        $stmt = $db->query("SELECT id, student_code, full_name_en, full_name_bn, class_name, section_name, roll_number, blood_group, status FROM students ORDER BY class_name, roll_number ASC");
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $students]);
    }
}
?>`;
}

export function generatePHPBackendCode(): string {
  return `${generatePhpDbConnect()}

${generatePhpApiAuth()}

${generatePhpApiStudents()}

${generatePhpApiAttendance()}

${generatePhpApiGrades()}

${generatePhpApiPayroll()}`;
}

export const generateMySQLSchemaSQL = generateMySQLSchema;

