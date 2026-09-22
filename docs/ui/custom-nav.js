// Custom navbar script untuk halaman Swagger UI agar pengguna mudah berpindah modul dengan gaya formal
export const customNavScript = `
window.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('simatkul-swagger-nav')) return;
  const nav = document.createElement('div');
  nav.id = 'simatkul-swagger-nav';
  nav.style.cssText = 'background:#0a0e17; border-bottom:1px solid #1e293b; padding:12px 24px; display:flex; align-items:center; justify-content:space-between; font-family:"Plus Jakarta Sans", -apple-system, sans-serif; font-size:13px; color:#f8fafc; z-index:9999; flex-wrap:wrap; gap:12px;';
  nav.innerHTML = \`
    <div style="display:flex; align-items:center; gap:8px; font-weight:700;">
      <a href="/api-docs" style="color:#f8fafc; text-decoration:none; font-size:14px; letter-spacing:-0.01em;">SIMATKUL API Portal</a>
      <span style="color:#475569;">/</span>
      <span style="color:#94a3b8; font-weight:500;">Swagger UI</span>
    </div>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <a href="/api-docs" style="color:#94a3b8; text-decoration:none; padding:5px 12px; border-radius:4px; border:1px solid #1e293b; background:#111722; font-weight:500; font-size:12px;">Portal & Error Docs</a>
      <a href="/api-docs/auth" style="color:#94a3b8; text-decoration:none; padding:5px 12px; border-radius:4px; border:1px solid #1e293b; background:#111722; font-weight:500; font-size:12px;">Auth Module</a>
      <a href="/api-docs/master-data" style="color:#94a3b8; text-decoration:none; padding:5px 12px; border-radius:4px; border:1px solid #1e293b; background:#111722; font-weight:500; font-size:12px;">Master Data Module</a>
      <a href="/api-docs/all" style="color:#f8fafc; text-decoration:none; padding:5px 12px; border-radius:4px; border:1px solid #334155; background:#1e293b; font-weight:600; font-size:12px;">Semua Modul</a>
    </div>
  \`;
  document.body.insertBefore(nav, document.body.firstChild);
});
`;
