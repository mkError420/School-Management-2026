<?php
/**
 * SonarPathshala - Database & Environment Configuration
 * Target: MySQL 8.0+ / MariaDB 10.6+
 * Host: sql101.infinityfree.com
 * Domain: maneschool.site.je
 */

// Set Default Bangladesh Standard Time (BST)
date_default_timezone_set('Asia/Dhaka');

// Database Credentials
define('DB_HOST', getenv('DB_HOST') ?: 'sql101.infinityfree.com');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'if0_42784359_myscmanagement');
define('DB_USER', getenv('DB_USER') ?: 'if0_42784359');
define('DB_PASS', getenv('DB_PASS') ?: '4naAUPQvgRj3');
define('DB_CHARSET', 'utf8mb4');

// Security & Encryption
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'sonarpathshala_secure_secret_key_2026_bd_schools_maneschool');
define('ENCRYPTION_KEY', getenv('ENCRYPTION_KEY') ?: 'aes256_bdris_encryption_key_32bytes!!');
define('SITE_URL', 'https://maneschool.site.je');

// CORS Headers for API
$allowedOrigins = [
    'https://maneschool.site.je',
    'http://maneschool.site.je',
    'http://localhost:3000',
    'http://localhost:5173'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if (in_array($origin, $allowedOrigins) || $origin === '*') {
    header("Access-Control-Allow-Origin: " . ($origin !== '*' ? $origin : '*'));
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Auth-Token");
header("Content-Type: application/json; charset=UTF-8");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
