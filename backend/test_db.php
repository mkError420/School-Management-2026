<?php
/**
 * SonarPathshala - Live Database Diagnostic Test Script
 * Access via browser: https://maneschool.site.je/backend/test_db.php
 */

require_once __DIR__ . '/config.php';

$response = [
    'test_timestamp' => date('Y-m-d H:i:s T'),
    'site_url'       => SITE_URL,
    'php_version'    => PHP_VERSION,
    'pdo_available'  => extension_loaded('pdo') && extension_loaded('pdo_mysql'),
    'db_host'        => DB_HOST,
    'db_name'        => DB_NAME,
    'db_user'        => DB_USER,
    'connection'     => 'pending',
    'tables'         => [],
    'sample_counts'  => []
];

// If HTML requested in browser:
$isHtml = (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'text/html') !== false) && !isset($_GET['json']);

try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT            => 10,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    $response['connection'] = 'SUCCESS (Connected to MySQL successfully!)';
    $response['status'] = 'ok';

    // List all tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $response['tables'] = $tables;
    $response['table_count'] = count($tables);

    // Get counts for common tables
    foreach ($tables as $table) {
        try {
            $cStmt = $pdo->query("SELECT COUNT(*) as cnt FROM `{$table}`");
            $response['sample_counts'][$table] = (int)$cStmt->fetch()['cnt'];
        } catch (Exception $e) {
            $response['sample_counts'][$table] = 'Error: ' . $e->getMessage();
        }
    }

} catch (PDOException $e) {
    $response['connection'] = 'FAILED';
    $response['status'] = 'error';
    $response['error_message'] = $e->getMessage();
}

if (!$isHtml) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SonarPathshala - Database Connection Test</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #e2e8f0; margin: 0; padding: 30px; line-height: 1.5; }
        .card { max-width: 760px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        h1 { margin-top: 0; font-size: 22px; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: bold; }
        .badge-success { background: #065f46; color: #34d399; }
        .badge-fail { background: #7f1d1d; color: #f87171; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
        th, td { border: 1px solid #1e293b; padding: 8px 12px; text-align: left; }
        th { background: #1e293b; color: #94a3b8; font-weight: 600; }
        .code { background: #0f172a; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; color: #38bdf8; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-top: 15px; }
        .alert-success { background: #064e3b; border: 1px solid #059669; color: #a7f3d0; }
        .alert-danger { background: #450a0a; border: 1px solid #dc2626; color: #fecaca; }
        .btn { display: inline-block; margin-top: 15px; padding: 8px 16px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="card">
        <h1>SonarPathshala MySQL Diagnostic Check</h1>
        <p style="color: #94a3b8; font-size: 13px;">Target Website: <strong><?= htmlspecialchars(SITE_URL) ?></strong></p>

        <?php if ($response['status'] === 'ok'): ?>
            <div class="alert alert-success">
                <strong>Database Connected Successfully!</strong><br>
                PHP has successfully connected to <span class="code"><?= htmlspecialchars(DB_HOST) ?></span> and accessed database <span class="code"><?= htmlspecialchars(DB_NAME) ?></span>.
            </div>
        <?php else: ?>
            <div class="alert alert-danger">
                <strong>Database Connection Failed!</strong><br>
                <?= htmlspecialchars($response['error_message'] ?? 'Unknown connection error') ?>
            </div>
        <?php endif; ?>

        <h3>Environment Details</h3>
        <table>
            <tr><th>Parameter</th><th>Value</th></tr>
            <tr><td>PHP Version</td><td><?= htmlspecialchars($response['php_version']) ?></td></tr>
            <tr><td>PDO MySQL Extension</td><td><?= $response['pdo_available'] ? '<span class="badge badge-success">Loaded</span>' : '<span class="badge badge-fail">Missing</span>' ?></td></tr>
            <tr><td>Database Host</td><td><span class="code"><?= htmlspecialchars($response['db_host']) ?></span></td></tr>
            <tr><td>Database User</td><td><span class="code"><?= htmlspecialchars($response['db_user']) ?></span></td></tr>
            <tr><td>Database Name</td><td><span class="code"><?= htmlspecialchars($response['db_name']) ?></span></td></tr>
            <tr><td>Connection Status</td><td>
                <?= $response['status'] === 'ok' ? '<span class="badge badge-success">Connected</span>' : '<span class="badge badge-fail">Error</span>' ?>
            </td></tr>
            <tr><td>Detected Tables</td><td><?= $response['table_count'] ?? 0 ?> tables found</td></tr>
        </table>

        <?php if (!empty($response['tables'])): ?>
            <h3>Tables in Database</h3>
            <table>
                <tr><th>Table Name</th><th>Row Count</th></tr>
                <?php foreach ($response['tables'] as $tbl): ?>
                    <tr>
                        <td><span class="code"><?= htmlspecialchars($tbl) ?></span></td>
                        <td><?= htmlspecialchars($response['sample_counts'][$tbl] ?? 0) ?></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        <?php elseif ($response['status'] === 'ok'): ?>
            <p style="color: #fbbf24; font-size: 13px; margin-top: 15px;">
                No tables found yet. Please import <span class="code">database/cpanel_infinityfree_import.sql</span> in phpMyAdmin.
            </p>
        <?php endif; ?>

        <a href="<?= htmlspecialchars(SITE_URL) ?>" class="btn">Go to School Portal &rarr;</a>
    </div>
</body>
</html>
