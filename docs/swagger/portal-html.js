import { portalStyles } from "../ui/styles.js";
import { renderHeader } from "../ui/header.js";
import { renderModulesSection } from "../ui/modules-section.js";
import { renderErrorSection } from "../ui/error-section.js";
import { renderFooter } from "../ui/footer.js";

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
    ${portalStyles}
  </style>
</head>
<body>
  <div class="container">
    ${renderHeader()}
    ${renderModulesSection()}
    ${renderErrorSection()}
    ${renderFooter()}
  </div>
</body>
</html>`;
}
