import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { authSwaggerDoc } from "../docs/swagger/auth-docs.js";
import { masterDataSwaggerDoc } from "../docs/swagger/master-data-docs.js";
import { combinedSwaggerDoc } from "../docs/swagger/combined-docs.js";
import { renderSwaggerPortalHtml } from "../docs/swagger/portal-html.js";
import { customNavScript } from "../docs/ui/custom-nav.js";

const swaggerRouter = Router();

// CDN Swagger UI agar aset CSS & JS ter-load dengan sempurna di Vercel Serverless
const SWAGGER_CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui.min.css";
const SWAGGER_JS_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.0.0/swagger-ui-standalone-preset.js",
  "/api-docs/custom-nav.js"
];

// Custom navbar script untuk halaman Swagger UI agar pengguna mudah berpindah modul
swaggerRouter.get("/custom-nav.js", (req, res) => {
  res.type("application/javascript").send(customNavScript);
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

const createSwaggerUiOptions = (siteTitle) => ({
  customCss,
  customCssUrl: SWAGGER_CSS_URL,
  customJs: SWAGGER_JS_URLS,
  customSiteTitle: siteTitle,
  swaggerOptions,
});

swaggerRouter.use(
  "/auth",
  swaggerUi.serve,
  swaggerUi.setup(authSwaggerDoc, createSwaggerUiOptions("SIMATKUL API - Auth Module"))
);

swaggerRouter.use(
  "/master-data",
  swaggerUi.serve,
  swaggerUi.setup(masterDataSwaggerDoc, createSwaggerUiOptions("SIMATKUL API - Master Data Module"))
);

swaggerRouter.use(
  "/all",
  swaggerUi.serve,
  swaggerUi.setup(combinedSwaggerDoc, createSwaggerUiOptions("SIMATKUL API - All Modules"))
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
