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
      --bg-main: #0a0e17;
      --bg-card: #111722;
      --bg-card-hover: #151d2b;
      --border-color: #1e293b;
      --border-color-hover: #334155;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --text-main: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --code-bg: #070a10;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      line-height: 1.6;
      padding: 36px 20px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .container {
      max-width: 1140px;
      margin: 0 auto;
    }

    /* Header */
    header {
      margin-bottom: 36px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .brand-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-badge {
      font-size: 11px;
      font-weight: 600;
      background: #1e293b;
      color: #94a3b8;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #334155;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .brand-desc {
      color: var(--text-secondary);
      font-size: 14px;
      margin-top: 6px;
      line-height: 1.5;
    }

    /* Quick Action Navigation */
    .quick-nav {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 16px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #1e293b;
      color: #f8fafc;
      border: 1px solid #334155;
    }
    .btn-primary:hover {
      background-color: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }

    .btn-outline {
      background-color: transparent;
      color: #cbd5e1;
      border: 1px solid var(--border-color);
    }
    .btn-outline:hover {
      background-color: #1e293b;
      border-color: #334155;
      color: #ffffff;
    }

    /* Section Title */
    .section-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: -0.01em;
    }

    /* Module Cards Grid */
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .module-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }

    .module-card:hover {
      border-color: var(--border-color-hover);
      background-color: var(--bg-card-hover);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .card-category {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }

    .module-title {
      font-size: 17px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
      margin-bottom: 8px;
    }

    .module-desc {
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 20px;
      line-height: 1.55;
    }

    .endpoint-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 24px;
    }

    .tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      background: #0f1520;
      color: #94a3b8;
      border: 1px solid #1e293b;
    }

    .tag-highlight {
      background: #1e293b;
      color: #cbd5e1;
      border-color: #334155;
    }

    .card-actions {
      display: flex;
      margin-top: auto;
    }

    .card-actions .btn {
      width: 100%;
      justify-content: center;
      text-align: center;
    }

    /* Error Section */
    .error-section {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 28px;
      margin-bottom: 40px;
    }

    .error-intro {
      color: var(--text-secondary);
      font-size: 14px;
      margin-bottom: 22px;
      line-height: 1.6;
    }

    .error-table-wrapper {
      overflow-x: auto;
      margin-bottom: 24px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }

    th {
      background: #0d121c;
      padding: 11px 14px;
      font-weight: 600;
      color: #cbd5e1;
      border-bottom: 1px solid var(--border-color);
      letter-spacing: 0.02em;
    }

    td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-color);
      color: #cbd5e1;
      vertical-align: top;
      line-height: 1.5;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .badge-status {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      display: inline-block;
    }

    .badge-400 { background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.25); }
    .badge-401 { background: rgba(245, 158, 11, 0.1); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.25); }
    .badge-403 { background: rgba(217, 70, 239, 0.1); color: #f0abfc; border: 1px solid rgba(217, 70, 239, 0.25); }
    .badge-404 { background: rgba(139, 92, 246, 0.1); color: #c4b5fd; border: 1px solid rgba(139, 92, 246, 0.25); }
    .badge-500 { background: rgba(220, 38, 38, 0.12); color: #f87171; border: 1px solid rgba(220, 38, 38, 0.3); }

    /* Code Block */
    .code-box {
      background: var(--code-bg);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 14px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #e2e8f0;
      overflow-x: auto;
      line-height: 1.5;
    }

    .code-title {
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    /* Footer */
    footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
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
          SIMATKUL API
          <span class="brand-badge">v1.0.0</span>
        </h1>
        <p class="brand-desc">Sistem Informasi Pengaturan Mata Kuliah — Dokumentasi RESTful API & Standar Respons Kesalahan</p>
      </div>
      <div class="quick-nav">
        <a href="/api-docs/auth" class="btn btn-outline">Modul Auth</a>
        <a href="/api-docs/master-data" class="btn btn-outline">Modul Master Data</a>
        <a href="/api-docs/all" class="btn btn-primary">Semua Endpoint</a>
      </div>
    </header>

    <!-- Section 1: Module Documentation Cards -->
    <h2 class="section-title">Pilih Modul Dokumentasi</h2>
    <div class="modules-grid">
      <!-- Card 1: Auth -->
      <div class="module-card">
        <div>
          <div class="card-header">
            <span class="card-category">AUTENTIKASI</span>
            <span class="tag">1 Endpoint</span>
          </div>
          <h3 class="module-title">Modul Auth</h3>
          <p class="module-desc">Autentikasi akun pengguna dan administrator, validasi input Zod schema, serta penerbitan token JWT terenkripsi.</p>
          <div class="endpoint-tags">
            <span class="tag">POST /api/auth/login</span>
          </div>
        </div>
        <div class="card-actions">
          <a href="/api-docs/auth" class="btn btn-primary">Buka Dokumentasi Auth &rarr;</a>
        </div>
      </div>

      <!-- Card 2: Master Data -->
      <div class="module-card">
        <div>
          <div class="card-header">
            <span class="card-category">MASTER DATA</span>
            <span class="tag">6 Sub-modul</span>
          </div>
          <h3 class="module-title">Modul Master Data</h3>
          <p class="module-desc">Manajemen data akademik institusional: Kurikulum, Mata Kuliah (filter, search, paginasi), Dosen, Kelas, Ruang, dan Sesi perkuliahan.</p>
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
          <a href="/api-docs/master-data" class="btn btn-primary">Buka Dokumentasi Master Data &rarr;</a>
        </div>
      </div>

      <!-- Card 3: All-in-One -->
      <div class="module-card">
        <div>
          <div class="card-header">
            <span class="card-category">SEMUA ENDPOINT</span>
            <span class="tag tag-highlight">Lengkap</span>
          </div>
          <h3 class="module-title">Semua Modul Terpadu</h3>
          <p class="module-desc">Katalog seluruh endpoint RESTful API terpadu dalam satu antarmuka Swagger UI interaktif dengan kapabilitas Try It Out.</p>
          <div class="endpoint-tags">
            <span class="tag">Auth</span>
            <span class="tag">Master Data</span>
            <span class="tag">Bearer Token</span>
          </div>
        </div>
        <div class="card-actions">
          <a href="/api-docs/all" class="btn btn-primary">Buka Dokumentasi Terpadu &rarr;</a>
        </div>
      </div>
    </div>

    <!-- Section 2: Global Error Response Format -->
    <div class="error-section">
      <h2 class="section-title">Format Penjelasan Error Response Global</h2>
      <p class="error-intro">
        Seluruh endpoint pada backend SIMATKUL menggunakan <code>error-middleware.js</code> terpusat untuk menjamin konsistensi payload respons kesalahan. Setiap respons error selalu mengembalikan format JSON standar dengan field <code>message</code> (terdaftar pada skema OpenAPI sebagai <code>GlobalErrorResponse</code>):
      </p>

      <!-- Standard Structure Box -->
      <div style="margin-bottom: 24px;">
        <div class="code-title">Struktur Standar Respons Error (HTTP 4xx / 5xx)</div>
        <div class="code-box">
{
  <span style="color: #94a3b8;">"message"</span>: <span style="color: #86efac;">"Penjelasan detail pesan kesalahan"</span>
}
        </div>
      </div>

      <!-- HTTP Status Codes Table -->
      <div class="code-title" style="margin-bottom: 12px;">Rincian Status Code & Skenario Error</div>
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
                &bull; Validasi Zod schema gagal pada body request.<br>
                &bull; Parameter ID URL bukan angka integer positif.<br>
                &bull; Filter query tidak valid (prodi salah, semester &lt; 1).<br>
                &bull; Duplikasi data unik (kode PostgreSQL 11000).<br>
                &bull; Aturan bisnis dilanggar (misal: kurikulum ganjil diberi MK genap).
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
                &bull; Kredensial username atau password tidak cocok saat login.<br>
                &bull; Token JWT tidak disertakan atau telah kedaluwarsa.
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
                &bull; Pengguna tidak memiliki role yang diizinkan (misal: bukan admin).
              </td>
              <td>
                <code>"Forbidden"</code>
              </td>
            </tr>
            <tr>
              <td><span class="badge-status badge-404">404 Not Found</span></td>
              <td><strong>Resource Not Found</strong></td>
              <td>
                &bull; ID data entitas tidak ditemukan di database.<br>
                &bull; Kesalahan format ID database (CastError).
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
                &bull; Kesalahan koneksi PostgreSQL.<br>
                &bull; Pengecualian (unhandled exception) pada runtime Node.js.
              </td>
              <td>
                <code>"Internal Server Error"</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Middleware Logic Context -->
      <div class="code-title">Alur Kerja Error Middleware (middleware/error-middleware.js)</div>
      <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">
        Jika sebuah error memiliki properti <code>err.statusCode</code>, status tersebut akan digunakan sebagai HTTP status response. Jika tidak ditentukan, middleware akan menggunakan kode default <code>500</code>.
      </p>
      <div class="code-box">
<span style="color: #c084fc;">res</span>.<span style="color: #60a5fa;">status</span>(error.statusCode || <span style="color: #f59e0b;">500</span>).<span style="color: #60a5fa;">json</span>({
  <span style="color: #94a3b8;">message</span>: error.message || <span style="color: #86efac;">"Internal Server Error"</span>,
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
