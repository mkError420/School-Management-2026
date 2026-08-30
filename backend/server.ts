import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'SonarPathshala ERP',
    timestamp: new Date().toISOString(),
    engine: 'Express Node.js / TypeScript'
  });
});

// API Info
app.get('/api/info', (req: Request, res: Response) => {
  res.json({
    appName: 'SonarPathshala',
    tagline: 'Bangladeshi High School & College ERP Platform',
    version: '2.5.0',
    dbSupport: 'MySQL 8.0+ / MariaDB 10.6+',
    features: [
      'BDRIS 17-digit BRN Verification',
      'Extracurricular Activities & Olympiad Tracking',
      'Pediatric Medical & Allergy History',
      '24/7 Guardian Emergency Contacts & Authorized Release',
      'Previous Academic History & Transfer Certificate (TC)',
      'NCTB GPA 5.0 Grading & Automated Marksheet Generator',
      'Multi-Gate Fees Collection with bKash / Nagad / Bank',
      'Automated Bengali SMS Dispatch & Biometric Attendance',
      'Argon2id & AES-256 Encrypted Field Security'
    ]
  });
});

// Serve frontend in production
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SonarPathshala server running on http://0.0.0.0:${PORT}`);
});
