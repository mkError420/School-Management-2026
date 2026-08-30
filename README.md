# 🇧🇩 SonarPathshala (সোনার পাঠশালা) — Complete School Management ERP

A production-ready, modern Bangladeshi High School & College ERP platform with full Frontend, Backend REST API, and Relational MySQL 8.0 Database.

---

## 📦 Project Package Structure

```text
sonarpathshala/
├── database/
│   └── schema.sql              # MySQL 8.0+ DDL with utf8mb4 Bangla, Tables, Triggers & Seed Data
├── backend/
│   ├── api.php                 # PHP 8.2+ PDO REST API Endpoints (Auth, Students, Fees, Marks, Logs)
│   ├── config.php              # Database credentials & CORS headers configuration
│   ├── Database.php            # PDO Singleton database connection
│   └── server.ts               # Optional Node.js / Express backend fallback
├── src/                        # Complete React 19 + TypeScript + Tailwind CSS Frontend
│   ├── components/             # Student Dossier, Gradebook, Fees, Payroll, SMS, Audit Logs, etc.
│   ├── context/                # Global Application State & Role Authorization
│   ├── types.ts                # TypeScript strict interface definitions
│   └── translations.ts         # Full English & Bengali (বাংলা) localization
├── docker-compose.yml          # One-command Dockerized stack (MySQL 8 + PHP 8.2 + Node.js)
└── README.md                   # Installation and deployment manual
```

---

## 🚀 Quick Start & Installation

### Option 1: XAMPP / WAMP / Laragon / CPanel (PHP & MySQL)

1. **Import Database in phpMyAdmin**:
   - Open phpMyAdmin (`http://localhost/phpmyadmin`).
   - Create a database named `sonarpathshala_school_db` with Collation `utf8mb4_unicode_ci`.
   - Click **Import** and upload `database/schema.sql`.

2. **Configure PHP Backend**:
   - Copy `backend/` folder into your `htdocs/sonarpathshala/api/` or CPanel `public_html/api/`.
   - Update database credentials in `backend/config.php` if different from default `root`.

3. **Run React Frontend**:
   ```bash
   npm install
   npm run build
   # Deploy the generated dist/ files to your web server or run:
   npm run preview
   ```

---

### Option 2: Docker Compose (One-Click)

```bash
docker-compose up -d
```
- **Frontend App**: `http://localhost:3000`
- **PHP REST API**: `http://localhost:8080/api/api.php?action=health`
- **MySQL Database**: `localhost:3306`

---

## 🛡️ Default Demo Accounts

| Role | Username / Identifier | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` / `admin@sonarpathshala.edu.bd` | `admin123` | Full ERP Control & DB Studio |
| **Headmaster** | `headmaster` | `admin123` | Institutional Administration & Approval |
| **Teacher** | `teacher.rahim` | `admin123` | Gradebook, Attendance & SMS Dispatch |
| **Accounts** | `accounts.hasan` | `admin123` | Fees Collection (bKash/Nagad), Payroll |
| **Guardian** | `guardian.rafiq` | `admin123` | Real-time Dossier, Marks & Fees Payment |

---

## ✨ Features Included

- **Comprehensive Student Dossiers**: 17-digit BDRIS Birth Registration Number, Extracurriculars & Olympiads, Medical History & Allergy Warnings, Emergency Contacts with Authorized Pickups, and Previous School Transfer Certificates (TC).
- **NCTB Grading Engine**: Standard Continuous Assessment (CA) + Summative Assessment (SA) GPA 5.0 marksheet and rank calculation.
- **Bangladeshi Payment Gateways**: bKash, Nagad, Rocket, and Bank challan receipt generator with Bangla currency formats (৳).
- **Automated Bangla SMS Gateway**: Single & bulk push notifications to guardians with dynamic token variables.
- **Multi-lingual**: Instant 1-click toggle between English and বাংলা.
