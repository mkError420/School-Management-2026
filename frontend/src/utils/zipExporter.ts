import JSZip from 'jszip';
import { generateMySQLSchemaSQL, generatePHPBackendCode } from './sqlPhpGenerator';

/**
 * Creates and triggers client-side download of the complete SonarPathshala ERP
 * package with Frontend, Backend (PHP 8.2 + Node.js), and MySQL 8.0 Database.
 */
export async function downloadCompleteProjectZip(): Promise<void> {
  // First attempt: direct fetch of static pre-built zip if available
  try {
    const staticZipUrl = '/sonarpathshala_complete_project.zip';
    const checkRes = await fetch(staticZipUrl, { method: 'HEAD' });
    if (checkRes.ok) {
      const link = document.createElement('a');
      link.href = staticZipUrl;
      link.download = 'sonarpathshala_complete_project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  } catch {
    // If static file fetch is intercepted, fallback to JSZip generation
  }

  // Fallback / dynamic client-side generation using JSZip
  const zip = new JSZip();

  // 1. Database folder
  const dbFolder = zip.folder('database');
  if (dbFolder) {
    dbFolder.file('schema.sql', generateMySQLSchemaSQL());
  }

  // 2. Backend folder
  const backendFolder = zip.folder('backend');
  if (backendFolder) {
    backendFolder.file('api.php', generatePHPBackendCode());
    backendFolder.file('config.php', `<?php
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'sonarpathshala_school_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');
define('JWT_SECRET', 'sonarpathshala_secure_secret_key_2026_bd_schools');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
`);
    backendFolder.file('Database.php', `<?php
require_once __DIR__ . '/config.php';
class Database {
    private static ?PDO $instance = null;
    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
        }
        return self::$instance;
    }
}
`);
    backendFolder.file('server.ts', `import express from 'express';
const app = express();
const PORT = 3000;
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'online', app: 'SonarPathshala ERP' }));
app.listen(PORT, '0.0.0.0', () => console.log('SonarPathshala server running on port ' + PORT));
`);
  }

  // 3. Root configuration & Docker files
  zip.file('README.md', `# 🇧🇩 SonarPathshala (সোনার পাঠশালা) ERP
Complete School Management System with React 19 Frontend, PHP 8.2 & Express Backend, and MySQL 8.0 Database.

## Quick Setup:
1. Import \`database/schema.sql\` into MySQL 8.0 / phpMyAdmin.
2. Put \`backend/\` in your web server (e.g. Apache/Nginx/XAMPP).
3. Run \`npm install && npm run build\` for the frontend.
4. Or run \`docker-compose up -d\` for all services.
`);

  zip.file('docker-compose.yml', `version: '3.8'
services:
  database:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: sonarpathshala_school_db
    ports:
      - "3306:3306"
    volumes:
      - ./database/schema.sql:/docker-entrypoint-initdb.d/init.sql:ro
  backend:
    image: php:8.2-apache
    ports:
      - "8080:80"
    volumes:
      - ./backend:/var/www/html/api
  frontend:
    image: node:20-alpine
    working_dir: /app
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    command: sh -c "npm install && npm run preview"
`);

  zip.file('.env.example', `DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=sonarpathshala_school_db
DB_USER=root
DB_PASS=
JWT_SECRET=your_secret_key_here
`);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'sonarpathshala_complete_project.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
