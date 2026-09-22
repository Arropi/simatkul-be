export function renderHeader() {
  return `
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
  `;
}
