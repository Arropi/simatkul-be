import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { authSwaggerDoc } from "../docs/swagger/auth-docs.js";
import { masterDataSwaggerDoc } from "../docs/swagger/master-data-docs.js";
import { combinedSwaggerDoc } from "../docs/swagger/combined-docs.js";
import { renderSwaggerPortalHtml } from "../docs/swagger/portal-html.js";

const swaggerRouter = Router();

// 1. Raw OpenAPI 3.0 JSON specifications (berguna untuk import Postman, Insomnia, atau Swagger Editor)
swaggerRouter.get("/auth.json", (req, res) => res.status(200).json(authSwaggerDoc));
swaggerRouter.get("/master-data.json", (req, res) => res.status(200).json(masterDataSwaggerDoc));
swaggerRouter.get("/all.json", (req, res) => res.status(200).json(combinedSwaggerDoc));

// 2. Custom navbar script untuk halaman Swagger UI agar pengguna mudah berpindah modul
swaggerRouter.get("/custom-nav.js", (req, res) => {
  res.type("application/javascript").send(`
    window.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('simatkul-swagger-nav')) return;
      const nav = document.createElement('div');
      nav.id = 'simatkul-swagger-nav';
      nav.style.cssText = 'background:#0b0f19; border-bottom:1px solid #1f293d; padding:12px 20px; display:flex; align-items:center; justify-content:space-between; font-family:"Plus Jakarta Sans", -apple-system, sans-serif; font-size:13px; color:#f8fafc; z-index:9999; flex-wrap:wrap; gap:12px;';
      nav.innerHTML = \`
        <div style="display:flex; align-items:center; gap:8px; font-weight:700;">
          <a href="/api-docs" style="color:#38bdf8; text-decoration:none; font-size:14px;">🎓 SIMATKUL API Portal</a>
          <span style="color:#64748b;">/</span>
          <span style="color:#cbd5e1;">Swagger UI</span>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <a href="/api-docs" style="color:#cbd5e1; text-decoration:none; padding:5px 12px; border-radius:6px; border:1px solid #1f293d; background:#111827; font-weight:600;">🏠 Portal & Error Docs</a>
          <a href="/api-docs/auth" style="color:#cbd5e1; text-decoration:none; padding:5px 12px; border-radius:6px; border:1px solid #1f293d; background:#111827; font-weight:600;">🔐 Auth Module</a>
          <a href="/api-docs/master-data" style="color:#cbd5e1; text-decoration:none; padding:5px 12px; border-radius:6px; border:1px solid #1f293d; background:#111827; font-weight:600;">📚 Master Data Module</a>
          <a href="/api-docs/all" style="color:#38bdf8; text-decoration:none; padding:5px 12px; border-radius:6px; border:1px solid rgba(56,189,248,0.4); background:rgba(56,189,248,0.1); font-weight:600;">🌐 Semua Modul</a>
        </div>
      \`;
      document.body.insertBefore(nav, document.body.firstChild);
    });
  `);
});

const customCss = `
  .swagger-ui .topbar { background-color: #0f172a; }
  .swagger-ui .info .title { font-family: "Plus Jakarta Sans", sans-serif; }
  .swagger-ui .btn.authorize { border-color: #38bdf8; color: #38bdf8; }
  .swagger-ui .btn.authorize svg { fill: #38bdf8; }
`;

const swaggerOptions = {
  persistAuthorization: true,
  displayRequestDuration: true,
};

// 3. Dedicated Route untuk Modul Auth (/api-docs/auth)
swaggerRouter.use(
  "/auth",
  swaggerUi.serveFiles(authSwaggerDoc),
  swaggerUi.setup(authSwaggerDoc, {
    customCss,
    customJs: "/api-docs/custom-nav.js",
    customSiteTitle: "SIMATKUL API - Auth Module",
    swaggerOptions,
  })
);

// 4. Dedicated Route untuk Modul Master Data (/api-docs/master-data)
swaggerRouter.use(
  "/master-data",
  swaggerUi.serveFiles(masterDataSwaggerDoc),
  swaggerUi.setup(masterDataSwaggerDoc, {
    customCss,
    customJs: "/api-docs/custom-nav.js",
    customSiteTitle: "SIMATKUL API - Master Data Module",
    swaggerOptions,
  })
);

// 5. Dedicated Route untuk Semua Modul Terpadu (/api-docs/all)
swaggerRouter.use(
  "/all",
  swaggerUi.serveFiles(combinedSwaggerDoc),
  swaggerUi.setup(combinedSwaggerDoc, {
    customCss,
    customJs: "/api-docs/custom-nav.js",
    customSiteTitle: "SIMATKUL API - All Modules",
    swaggerOptions,
  })
);

// 6. Main Portal Landing Page di /api-docs dan /api-docs/
swaggerRouter.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(renderSwaggerPortalHtml());
});

swaggerRouter.get("/portal", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(renderSwaggerPortalHtml());
});

export default swaggerRouter;
