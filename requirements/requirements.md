# Software Requirements Specification

## Purpose and problem

Small medical distributors often record products, purchases, invoices, and stock on paper or separate spreadsheets. Updates are delayed, duplicated, or lost; staff cannot reliably see available batch quantities; expired products may be sold; and monthly reporting requires manual reconciliation. MediStock centralizes these operations while keeping a permanent stock ledger and audit trail.

## Scope

The first release supports authorized staff, products and batches, suppliers, hospital/clinic/pharmacy customers, purchase receiving, sales and invoices, automatic inventory movement, low-stock and near-expiry alerts, dashboards, reporting, and audit history. Accounting, e-commerce, patient records, prescribing, and clinical decisions are out of scope.

## Functional requirements

| ID | Requirement | Acceptance summary |
|---|---|---|
| FR-01 | Authenticate and authorize users | Only active users can access features permitted to their role. |
| FR-02 | Manage products and batches | Staff can create, edit, search, deactivate, and view batch/expiry data. |
| FR-03 | Manage suppliers | Purchasing staff can maintain supplier contacts and lead times. |
| FR-04 | Manage customers | Staff can maintain hospitals, clinics, pharmacies, and credit limits. |
| FR-05 | Receive purchases | A received purchase increases the exact batch quantity in one transaction. |
| FR-06 | Record sales and invoices | A posted sale creates an invoice and decreases the selected batch quantity atomically. |
| FR-07 | Prevent invalid stock | The system rejects zero/negative quantities and sales greater than available stock. |
| FR-08 | Track inventory | Every change creates an immutable inventory transaction linked to its source. |
| FR-09 | Alert users | Low-stock, near-expiry, expired, and recall conditions are prioritised. |
| FR-10 | Report operations | Authorized users can filter/export sales, inventory valuation, expiry, and movement reports. |
| FR-11 | Audit changes | Security-sensitive and financial actions include user, time, entity, and details. |
| FR-12 | Support FEFO | The system recommends the earliest valid expiry batch when fulfilling a sale. |

## Non-functional requirements

| ID | Area | Measurable requirement |
|---|---|---|
| NFR-01 | Performance | 95% of ordinary reads return within 2 seconds at 100 concurrent users. |
| NFR-02 | Availability | Target 99.5% monthly availability excluding approved maintenance. |
| NFR-03 | Security | TLS, strong password hashing, RBAC, validation, least-privilege DB access, and rate limiting. |
| NFR-04 | Integrity | Purchases and sales use database transactions and row locks; stock cannot become negative. |
| NFR-05 | Recovery | Encrypted daily backups; RPO 24 hours and RTO 4 hours for the first release. |
| NFR-06 | Usability | A trained clerk completes a standard sale in under 90 seconds with no assistance. |
| NFR-07 | Accessibility | Keyboard access, labelled controls, visible focus, responsive layout, and WCAG 2.1 AA intent. |
| NFR-08 | Maintainability | Feature modules have clear API boundaries, migrations, tests, and configuration outside source. |
| NFR-09 | Scalability | Data model supports multiple locations and 1 million ledger movements without redesign. |
| NFR-10 | Privacy | Store business/customer contacts only; never store patient or clinical information. |

## Real-world and emerging risks

- Batch recalls require rapid traceability from supplier purchase to customer invoice.
- Network outages can interrupt receiving or sales; future offline queues must prevent duplicate posting.
- Counterfeit or incorrect products require barcode/GS1 validation and controlled supplier onboarding.
- Demand spikes and supply shortages need forecasting, safety stock, and substitute-product rules.
- Multi-location growth creates transfers, reservations, and ownership conflicts.
- Regulatory, tax, and retention rules differ by country and must be configurable.
- AI forecasts can be wrong or biased; human approval and explanation remain mandatory.
- Cyberattacks, credential theft, ransomware, and malicious exports require MFA, monitoring, and tested recovery.

## Requirement techniques used

Interviews with store and inventory roles; questionnaire responses; observation of paper/spreadsheet workflows; document analysis of invoices/registers; prototype feedback; and risk-based workshops. Requirements should be reviewed at each sprint review and traced to tests before release.
