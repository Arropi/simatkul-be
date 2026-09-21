export function renderSwaggerPortalHtml() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIMATKUL API - Documentation Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-card: #111827;
      --bg-card-hover: #1f2937;
      --border-color: #1f293d;
      --primary: #38bdf8;
      --primary-hover: #0ea5e9;
      --success: #34d399;
      --warning: #fbbf24;
      --danger: #f87171;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --code-bg: #030712;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      line-height: 1.6;
      padding: 32px 20px;
    }

    .container {
      max-width: 1140px;
      margin: 0 auto;
    }

    /* Header */
    header {
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .brand-title {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-badge {
      font-size: 12px;
      font-weight: 700;
      background: rgba(56, 189, 248, 0.15);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .brand-desc {
      color: var(--text-muted);
      font-size: 15px;
      margin-top: 6px;
    }

    /* Quick Action Navigation */
    .quick-nav {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .btn-primary {
      background-color: var(--primary);
      color: #0b0f19;
      border: 1px solid var(--primary);
    }
    .btn-primary:hover {
      background-color: var(--primary-hover);
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3);
    }

    .btn-outline {
      background-color: transparent;
      color: var(--text-main);
      border: 1px solid var(--border-color);
    }
    .btn-outline:hover {
      background-color: var(--bg-card);
      border-color: var(--primary);
      color: var(--primary);
    }

    /* Section Title */
    .section-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Module Cards Grid */
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .module-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .module-card:hover {
      transform: translateY(-3px);
      border-color: rgba(56, 189, 248, 0.4);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .module-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 6px;
    }

    .module-desc {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }

    .endpoint-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }

    .tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.04);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .card-actions {
      display: flex;
      gap: 10px;
      margin-top: auto;
    }

    .card-actions .btn {
      flex: 1;
      justify-content: center;
      text-align: center;
    }

    /* Error Section */
    .error-section {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 32px;
      margin-bottom: 40px;
    }

    .error-intro {
      color: var(--text-muted);
      font-size: 15px;
      margin-bottom: 24px;
    }

    .error-table-wrapper {
      overflow-x: auto;
      margin-bottom: 28px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }

    th {
      background: rgba(255, 255, 255, 0.03);
      padding: 12px 16px;
      font-weight: 600;
      color: #cbd5e1;
      border-bottom: 1px solid var(--border-color);
    }

    td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-color);
      color: #e2e8f0;
      vertical-align: top;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .badge-status {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
    }

    .badge-400 { background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
    .badge-401 { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
    .badge-403 { background: rgba(244, 114, 182, 0.15); color: #f472b6; border: 1px solid rgba(244, 114, 182, 0.3); }
    .badge-404 { background: rgba(167, 139, 250, 0.15); color: #c084fc; border: 1px solid rgba(167, 139, 250, 0.3); }
    .badge-500 { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }

    /* Code Block */
    .code-box {
      background: var(--code-bg);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #38bdf8;
      overflow-x: auto;
    }

    .code-title {
      font-size: 13px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    /* Footer */
    footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header>
      <div>
        <h1 class="brand-title">
          🎓 SIMATKUL API
          <span class="brand-badge">v1.0.0</span>
        </h1>
        <p class="brand-desc">Sistem Informasi Pengaturan Mata Kuliah — Dokumentasi RESTful API & Error Handling</p>
      </div>
      <div class="quick-nav">
        <a href="/api-docs/auth" class="btn btn-outline">🔐 Modul Auth</a>
        <a href="/api-docs/master-data" class="btn btn-outline">📚 Modul Master Data</a>
        <a href="/api-docs/all" class="btn btn-primary">🌐 Semua Endpoint</a>
      </div>
    </header>

    <!-- Section 1: Module Documentation Cards -->
    <h2 class="section-title">📦 Pilih Modul Dokumentasi Swagger</h2>
    <div class="modules-grid">
      <!-- Card 1: Auth -->
      <div class="module-card">
        <div>
          <div class="card-header">
            <div class="card-icon">🔐</div>
            <span class="tag">1 Endpoint</span>
          </div>
          <h3 class="module-title">Modul Auth</h3>
          <p class="module-desc">Menangani autentikasi akun user dan admin, validasi input Zod, serta penerbitan token JWT.</p>
          <div class="endpoint-tags">
            <span class="tag">POST /api/auth/login</span>
          </div>
        </div>
        <div class="card-actions">
          <a href="/api-docs/auth" class="btn btn-primary">Buka Swagger Auth ➜</a>
          <a href="/api-docs/auth.json" target="_blank" class="btn btn-outline">JSON Spec</a>
        </div>
      </div>

      <!-- Card 2: Master Data -->
      <div class="module-card">
        <div>
          <div class="card-header">
            <div class="card-icon">📚</div>
            <span class="tag">6 Sub-modul</span>
          </div>
          <h3 class="module-title">Modul Master Data</h3>
          <p class="module-desc">Operasi CRUD komprehensif data akademik: Kurikulum, Mata Kuliah (Filter, Search, Pagination), Dosen, Kelas, Ruang, dan Sesi.</p>
          <div class="endpoint-tags">
            <span class="tag">/kurikulum</span>
            <span class="tag">/mata-kuliah</span>
            <span class="tag">/dosen</span>
            <span class="tag">/kelas</span>
            <span class="tag">/ruang</span>
            <span class="tag">/sesi</span>
          </div>
        </div>
        <div class="card-actions">
          <a href="/api-docs/master-data" class="btn btn-primary">Buka Swagger Master Data ➜</a>
          <a href="/api-docs/master-data.json" target="_blank" class="btn btn-outline">JSON Spec</a>
        </div>
      </div>

      <!-- Card 3: All-in-One -->
      <div class="module-card" style="border-color: rgba(56, 189, 248, 0.4); background: linear-gradient(180deg, #111827 0%, #0f172a 100%);">
        <div>
          <div class="card-header">
            <div class="card-icon" style="background: rgba(56, 189, 248, 0.15);">🌐</div>
            <span class="tag" style="border-color: var(--primary); color: var(--primary);">Semua Modul</span>
          </div>
          <h3 class="module-title">Semua Modul Terpadu</h3>
          <p class="module-desc">Eksplorasi seluruh endpoint API dalam satu halaman Swagger UI interaktif lengkap dengan fitur Try It Out.</p>
          <div class="endpoint-tags">
            <span class="tag">Auth</span>
            <span class="tag">Master Data</span>
            <span class="tag">JWT Auth</span>
          </div>
        </div>
        <div class="card-actions">
          <a href="/api-docs/all" class="btn btn-primary">Buka Swagger Terpadu ➜</a>
          <a href="/api-docs/all.json" target="_blank" class="btn btn-outline">JSON Spec</a>
        </div>
      </div>
    </div>

    <!-- Section 2: Global Error Response Format -->
    <div class="error-section">
      <h2 class="section-title">⚠️ Format Penjelasan Error Response Global</h2>
      <p class="error-intro">
        Seluruh endpoint pada backend SIMATKUL menggunakan <code>error-middleware.js</code> terpusat untuk menjamin konsistensi payload respons kesalahan. Setiap respons error selalu mengembalikan format JSON standar dengan field <code>message</code>:
      </p>

      <!-- Standard Structure Box -->
      <div style="margin-bottom: 24px;">
        <div class="code-title">📄 Struktur Standar Respons Error (HTTP 4xx / 5xx)</div>
        <div class="code-box">
{
  <span style="color: #cbd5e1;">"message"</span>: <span style="color: #34d399;">"Penjelasan detail pesan kesalahan"</span>
}
        </div>
      </div>

      <!-- HTTP Status Codes Table -->
      <div class="code-title" style="margin-bottom: 12px;">📊 Rincian Status Code & Skenario Error</div>
      <div class="error-table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width: 140px;">Status Code</th>
              <th style="width: 200px;">Kategori</th>
              <th>Penyebab / Skenario Kasus</th>
              <th>Contoh Nilai Field <code>message</code></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge-status badge-400">400 Bad Request</span></td>
              <td><strong>Validation Error / Client Input</strong></td>
              <td>
                • Validasi Zod schema gagal pada body request.<br>
                • Parameter ID URL bukan angka integer positif.<br>
                • Filter query tidak valid (prodi salah, semester < 1).<br>
                • Duplikasi data unik (kode PostgreSQL 11000).<br>
                • Aturan bisnis dilanggar (misal: kurikulum ganjil diberi MK genap).
              </td>
              <td>
                <code>"Prodi harus salah satu dari: TRPL, TRI, TRE, TRIK"</code><br>
                <code>"Parameter ID harus berupa angka integer positif"</code><br>
                <code>"Duplicate field value entered"</code>
              </td>
            </tr>
            <tr>
              <td><span class="badge-status badge-401">401 Unauthorized</span></td>
              <td><strong>Authentication Failure</strong></td>
              <td>
                • Kredensial username atau password tidak cocok saat login.<br>
                • Token JWT tidak disertakan atau telah kedaluwarsa.
              </td>
              <td>
                <code>"Invalid username or password"</code><br>
                <code>"Unauthorized: Token invalid or expired"</code>
              </td>
            </tr>
            <tr>
              <td><span class="badge-status badge-403">403 Forbidden</span></td>
              <td><strong>Access Control / Authorization</strong></td>
              <td>
                • Pengguna tidak memiliki role yang diizinkan (misal: bukan admin).
              </td>
              <td>
                <code>"Forbidden"</code>
              </td>
            </tr>
            <tr>
              <td><span class="badge-status badge-404">404 Not Found</span></td>
              <td><strong>Resource Not Found</strong></td>
              <td>
                • ID data entitas tidak ditemukan di database.<br>
                • Kesalahan format ID database (CastError).
              </td>
              <td>
                <code>"Data kurikulum dengan ID 999 tidak ditemukan"</code><br>
                <code>"Resource not found"</code>
              </td>
            </tr>
            <tr>
              <td><span class="badge-status badge-500">500 Internal Server</span></td>
              <td><strong>Server / Database Failure</strong></td>
              <td>
                • Kesalahan koneksi PostgreSQL.<br>
                • Pengecualian (unhandled exception) pada runtime Node.js.
              </td>
              <td>
                <code>"Internal Server Error"</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Middleware Logic Context -->
      <div class="code-title">⚙️ Alur Kerja Error Middleware (<code>middleware/error-middleware.js</code>)</div>
      <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px;">
        Jika sebuah error memiliki properti <code>err.statusCode</code>, status tersebut akan digunakan sebagai HTTP status response. Jika tidak ditentukan, middleware akan menggunakan kode default <code>500</code>.
      </p>
      <div class="code-box" style="color: #94a3b8;">
<span style="color: #c084fc;">res</span>.<span style="color: #38bdf8;">status</span>(error.statusCode || <span style="color: #f59e0b;">500</span>).<span style="color: #38bdf8;">json</span>({
  <span style="color: #cbd5e1;">message</span>: error.message || <span style="color: #34d399;">"Internal Server Error"</span>,
});
      </div>
    </div>

    <!-- Footer -->
    <footer>
      SIMATKUL Backend &copy; 2026 — Dikelola dengan Node.js, Express.js, Drizzle ORM, Zod, & Swagger UI.
    </footer>
  </div>
</body>
</html>`;
}
