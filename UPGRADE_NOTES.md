# MediStock Company-Ready Interface Upgrade

## Implemented in this version

- Nepalese Rupee (NPR) used throughout the frontend, sample records, SQL seed data, API responses, and run guide.
- Working navigation for Dashboard, Products, Purchases, Sales & invoices, Customers, Vendors, Reports, Project team, Audit log, and Settings.
- Sale workflow validates quantity, reduces stock, calculates the NPR total, records payment status, and creates an audit entry.
- Purchase workflow records supplier cost in NPR, increases stock, creates a purchase record, and creates an audit entry.
- Product creation with SKU, manufacturer, batch, expiry, opening stock, reorder level, and NPR selling price.
- Browser persistence using localStorage so working demo data survives page refreshes.
- Inventory, sales, and purchase CSV exports for spreadsheet/accounting handoff.
- Low-stock and expiry status indicators, KPI recalculation, receivables view, and searchable records.
- Company profile settings for operating name and PAN/VAT number.
- Responsive mobile/tablet interface retained and expanded.
- Express/MySQL seed values and API response metadata aligned to NPR.

## Before a real production deployment

The repository includes an Express/MySQL transactional backend, but the browser interface currently uses local persistence by default so it can run without credentials. Before a real company stores operational data, connect the frontend to the included API and add authenticated users/RBAC, password hashing and account administration, centralized server-side audit retention, database backups, TLS, production secrets, validation for organization-specific tax rules, and applicable Nepal invoice/IRD compliance.

No real patient or sensitive clinical data should be stored in the browser demo.
