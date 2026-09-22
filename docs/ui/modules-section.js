export function renderModulesSection() {
  return `
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
  `;
}
