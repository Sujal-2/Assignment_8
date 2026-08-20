# Product Backlog

Story points use the Fibonacci scale. Priority follows MoSCoW.

| ID | User story | Points | Priority | Initial status | Acceptance summary |
|---|---|---:|---|---|---|
| US-01 | As a staff member, I want secure role-based sign-in so business data is protected. | 5 | Must | Sprint 1 | Valid users enter; invalid/inactive users are rejected; permissions apply. |
| US-02 | As an inventory manager, I want to manage products and batches so stock data is accurate. | 8 | Must | Sprint 1 | SKU is unique; batch, cost, price, expiry and reorder level are validated. |
| US-03 | As a purchasing officer, I want to manage suppliers so sourcing information is available. | 3 | Should | Sprint 1 | Supplier contacts and lead time can be maintained and deactivated. |
| US-04 | As a purchasing officer, I want to receive purchases so stock increases automatically. | 8 | Must | Sprint 1 | One receipt creates purchase lines, ledger movements and exact stock updates. |
| US-05 | As a sales officer, I want to maintain customers so invoices use correct details. | 3 | Should | Backlog | Hospitals, clinics and pharmacies can be searched and updated. |
| US-06 | As a sales officer, I want to post a sale and invoice so fulfilment is fast and traceable. | 13 | Must | Backlog | Stock is locked/validated, invoice created, batch reduced, ledger written atomically. |
| US-07 | As an inventory manager, I want low-stock and expiry alerts so risk is handled early. | 5 | Must | Sprint 1 | Alerts reflect configurable thresholds and cannot recommend expired stock. |
| US-08 | As a manager, I want a dashboard so I can see sales, inventory value, and risks. | 5 | Should | Sprint 1 | KPIs reconcile to transaction data and support date/location filters. |
| US-09 | As an auditor, I want reports and immutable logs so changes can be investigated. | 8 | Must | Backlog | Reports export with filters; financial/security actions show actor and time. |
| US-10 | As warehouse staff, I want barcode and FEFO guidance so picking is faster and safer. | 8 | Could | Future | Scans match an active batch and recommend earliest valid expiry. |

Definition of Ready: user value, acceptance criteria, dependencies, data/security impact, estimate, and owner are clear. Definition of Done: reviewed code/document, tests pass, accessibility checked, documentation updated, acceptance criteria met, and product owner accepts.
