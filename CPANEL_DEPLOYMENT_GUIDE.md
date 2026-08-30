# SonarPathshala - cPanel & MySQL Deployment Guide
### Target Domain: `maneschool.site.je` | Database: `if0_42784359_myscmanagement`

---

## 📁 Project Structure (Local)

```text
sonarpathshala_complete_project/
├── backend/                             <-- PHP API & Database connection
│   ├── config.php                       <-- Database credentials for sql101.infinityfree.com
│   ├── Database.php                     <-- PDO database connection manager
│   ├── api.php                          <-- REST API endpoints
│   ├── test_db.php                      <-- Live database diagnostic test tool
│   └── .htaccess                        <-- Backend security & CORS headers
├── database/                            <-- MySQL Schema & Import files
│   ├── cpanel_infinityfree_import.sql   <-- phpMyAdmin import file (NO CREATE DB errors)
│   └── schema.sql                       <-- Full raw schema
├── frontend/                            <-- React + Vite + TypeScript application
│   ├── src/                             <-- Components, Context, UI code
│   ├── public/                          <-- Static assets & htaccess
│   ├── index.html                       <-- Frontend entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env
├── .htaccess                            <-- Root Apache SPA rewrite rules
├── .env
└── CPANEL_DEPLOYMENT_GUIDE.md
```

---

## 📋 Credentials & Connection Details
- **Website Domain**: `https://maneschool.site.je` (or `http://maneschool.site.je`)
- **MySQL Host**: `sql101.infinityfree.com`
- **MySQL Database**: `if0_42784359_myscmanagement`
- **MySQL Username**: `if0_42784359`
- **MySQL Password**: `4naAUPQvgRj3`
- **Port**: `3306`
- **Charset**: `utf8mb4_unicode_ci` (Full Bangla Unicode Support)
- **Timezone**: `Asia/Dhaka` (+06:00 BST)

---

## 🚀 Step-by-Step cPanel Upload & Setup

### STEP 1: Import Database via phpMyAdmin
1. Log into your **InfinityFree / cPanel Control Panel**.
2. Open **phpMyAdmin** from the Databases section.
3. On the left sidebar, click your database name:
   👉 **`if0_42784359_myscmanagement`**
4. Click on the **Import** tab at the top.
5. Click **Choose File** and select:
   👉 [`database/cpanel_infinityfree_import.sql`](file:///c:/New%20folder/All%20POS%20live%20done/School%20management/sonarpathshala_complete_project/database/cpanel_infinityfree_import.sql)
6. Scroll down and click **Import** (or **Go**).
7. ✅ All 14 tables will be created and populated with initial roles, admin users, teachers, students, fees, and attendance records.

---

### STEP 2: Upload Files to cPanel `htdocs/`
In your cPanel / InfinityFree **File Manager**, navigate to the root directory (**`htdocs/`** or **`public_html/`**).

Upload the project folders and files so that your `htdocs/` folder looks like this:

```text
htdocs/ (or public_html/)
│
├── backend/                             <-- [CRITICAL] Backend folder
│   ├── config.php                       (Pre-configured with your MySQL details)
│   ├── Database.php                     (PDO connection engine)
│   ├── api.php                          (REST API handler)
│   ├── test_db.php                      (Live diagnostic test tool)
│   └── .htaccess                        (Security & CORS)
│
├── frontend/                            <-- Frontend application files
│   ├── src/                             (React UI components)
│   ├── public/                          (Static assets)
│   ├── index.html                       (App index)
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── index.html                           <-- Root index entry (copied/linked from frontend)
├── .htaccess                            <-- [CRITICAL] Apache SPA rewrite rules
└── .env                                 <-- Environment configuration
```

> [!TIP]
> The `database/` folder does NOT need to be in `htdocs/` because the database was already imported into MySQL in Step 1.

---

### STEP 3: Verify Live Connection
Open your browser and visit the diagnostic URL:
👉 **`http://maneschool.site.je/backend/test_db.php`** (or `https://maneschool.site.je/backend/test_db.php`)

You will see:
- 🟢 **Database Connected Successfully!**
- Status of all 14 tables and records.

---

### 🔑 Default Login Credentials

| Role | Username / Identifier | Password | Full Name |
| :--- | :--- | :--- | :--- |
| **Super Administrator** | `superadmin` | `admin123` | Md. Zahirul Islam |
| **Principal / Headmaster** | `principal_anwar` | `admin123` | Prof. Md. Anwar Hossain |
| **Subject Teacher** | `tariqul_math` | `admin123` | Md. Tariqul Islam |
| **Accounts Officer** | `accounts.hasan` | `admin123` | Kamrul Hasan |
