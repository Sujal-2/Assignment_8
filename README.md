# MediStock Operations

MediStock is an extensible medical sales and inventory management demo for CSE 220. It replaces paper registers and disconnected spreadsheets with batch-level stock, FEFO expiry control, purchasing, sales, invoicing, alerts, reporting, and an audit trail.

For complete Windows installation instructions, including the optional MySQL/Express API, see [RUN_GUIDE.md](RUN_GUIDE.md).

## What works in the demo

- Responsive React dashboard styled with Tailwind CSS and custom CSS.
- Search and live inventory filtering with Ctrl/Cmd + K shortcut.
- New-sale workflow that validates stock, creates an NPR invoice record, tracks paid/due status, and reduces inventory.
- Purchase-receipt workflow that increases inventory and records supplier costs in NPR.
- Live KPI and low-stock recalculation, product creation, audit activity, customer/vendor views, CSV exports, and browser persistence.
- Mobile navigation and accessible form controls.
- MySQL schema and Express API with validated, transactional sales and purchasing endpoints.

The browser interface intentionally starts with realistic Nepal-focused local data, uses Nepalese Rupees (NPR), and persists working demo records in localStorage so the core workflows can be tested without credentials. `lib/api.ts` is the adapter for switching the UI to the live API when `NEXT_PUBLIC_API_URL` is configured.

## Run the frontend

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Run MySQL and the API

1. Run `server/sql/schema.sql` in MySQL 8.0+.
2. Copy `server/.env.example` to `server/.env` and set the database credentials.
3. In `server`, run `npm install` and `npm run dev`.
4. Add `NEXT_PUBLIC_API_URL=http://localhost:4000` to the frontend environment.

Use a dedicated least-privilege MySQL account in production. Do not commit `.env` files.

## Project structure

```text
app/               React pages and responsive interface
lib/               frontend API adapter 
server/src/        Express API and transactional services
server/sql/        normalized MySQL schema
requirements/      requirements and stakeholder analysis
planning/          product backlog, Sprint 1, Gantt and Trello import
design/            UML diagrams in Mermaid source
testing/           test plan and Excel test matrix
docs/              project report and GitHub workflow evidence guide
```

## Production adoption note

The interface is usable as a working prototype and the repository already contains an Express/MySQL transactional backend. A real company deployment should connect the UI to that API, add authenticated users/RBAC, server-side audit retention, backups, TLS, environment-specific secrets, and company-specific tax/invoice compliance before handling real patient, customer, or financial data.

## Growth path

The architecture supports future modules without redesigning the core ledger: authentication and RBAC, barcode scanning, multi-warehouse stock, returns and recalls, mobile/PWA operation, purchase forecasting, supplier integrations, tax/localization, offline synchronization, and analytics. The product, batch, transaction, and audit tables are deliberately separated so later features remain traceable.

## Academic evidence

The repository includes 10 user stories, Sprint 1 roles/deadlines/statuses, functional and non-functional requirements, four UML diagrams, Gantt source, stakeholder analysis, an Excel test matrix, and a structured report. Follow `docs/github-workflow.md` to capture genuine Trello and GitHub screenshots; placeholders are not presented as real evidence.
