export const portalStyles = `
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
`;
