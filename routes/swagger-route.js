import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { authSwaggerDoc } from "../docs/swagger/auth-docs.js";
import { masterDataSwaggerDoc } from "../docs/swagger/master-data-docs.js";
import { combinedSwaggerDoc } from "../docs/swagger/combined-docs.js";
import { renderSwaggerPortalHtml } from "../docs/swagger/portal-html.js";

const swaggerRouter = Router();

// Custom navbar script untuk halaman Swagger UI agar pengguna mudah berpindah modul dengan gaya formal
swaggerRouter.get("/custom-nav.js", (req, res) => {
  res.type("application/javascript").send(`
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
  `);
});

const customCss = `
  .swagger-ui .topbar { background-color: #0a0e17; border-bottom: 1px solid #1e293b; }
  .swagger-ui .info .title { font-family: "Plus Jakarta Sans", sans-serif; color: #f8fafc; letter-spacing: -0.02em; }
  .swagger-ui .btn.authorize { border-color: #334155; color: #f8fafc; background-color: #1e293b; border-radius: 4px; font-weight: 600; }
  .swagger-ui .btn.authorize svg { fill: #94a3b8; }
  .swagger-ui .opblock { border-radius: 4px; }
  .swagger-ui .btn { border-radius: 4px; }
  .swagger-ui select, .swagger-ui input[type=text] { border-radius: 4px; }
`;

const swaggerOptions = {
  persistAuthorization: true,
  displayRequestDuration: true,
};

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

swaggerRouter.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(renderSwaggerPortalHtml());
});

swaggerRouter.get("/portal", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(renderSwaggerPortalHtml());
});

export default swaggerRouter;
