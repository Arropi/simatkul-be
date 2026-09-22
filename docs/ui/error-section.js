export function renderErrorSection() {
  return `
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
  `;
}
