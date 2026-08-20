# MediStock Operations: Agile Software Project Report

## Introduction

MediStock Operations demonstrates how a medical supply business can replace paper registers and disconnected spreadsheets with a traceable sales and inventory platform. The project combines Agile planning, requirements engineering, UML design, testing, React/Tailwind prototyping, an Express API, and a normalized MySQL data model. The demo is usable now and deliberately structured for production hardening later.

## Scope and team roles

The release covers products and batches, suppliers, business customers, purchase receiving, sales/invoices, automatic stock movement, low-stock/expiry alerts, dashboard metrics, reporting, and audit history. Patient records, prescribing, accounting, and clinical decisions are excluded.

The five-person team divides responsibility as follows:

- **Himanshu Shrestha — Scrum Master:** coordinates the sprint, facilitates Agile ceremonies, tracks blockers, and protects the team process.
- **Surya Malla — Business Analyst and UI/UX:** supports requirements analysis, maps business workflows, and reviews responsive usability.
- **Sujal — Product Owner:** prioritises the backlog, confirms scope, represents stakeholder value, and accepts completed stories.
- **Sandesh — Full-stack Developer:** develops the React interface, Express API, MySQL services, and technical integration.
- **Gopal — QA and Test Engineer:** prepares and executes tests, records defects and evidence, and supports release-quality decisions.

Although each member has a primary role, design reviews, backlog refinement, sprint review, and retrospective remain shared team activities.

## Agile process used

Scrum uses a prioritised 10-story product backlog, a two-week Sprint 1, daily stand-ups, review, retrospective, Definition of Ready, and Definition of Done. Must-have stock integrity work is protected before reporting enhancements. New regulatory or operational needs return to backlog refinement rather than bypassing acceptance and testing.

## Requirements and design

Requirements were derived through interview, questionnaire, observation, document analysis, prototype review, and risk workshops. The four UML views cover actor goals, domain structure, sale interaction, and purchase activity. The normalized model separates products from batches and treats the inventory ledger as the evidence of change. Sales and receipts use transactions so partial writes cannot corrupt stock.

## Implementation demonstration

The React dashboard filters products, recalculates inventory KPIs, records demo sales, blocks invalid quantities, receives stock, updates low-stock alerts, and adapts to mobile screens. The Express API validates payloads and uses MySQL transactions and row locking. This is an educational baseline: production rollout also needs authentication, migrations, automated tests, observability, rate limiting, secure secret storage, backups, and operational ownership.

## Trello and GitHub usage

The supplied Trello CSV creates the backlog demonstration. Genuine board screenshots must show lists, labels, owners, dates, checklist detail, and activity history. The GitHub structure separates requirements, design, planning, server, app, and testing evidence. Progress should appear through focused commits, a feature branch, review comments, checks, and a merged pull request. The evidence guide avoids presenting generated placeholders as real tool activity.

## Testing

The Excel matrix covers unit, integration, system, UAT, security, performance, recovery, accessibility, and regression tests with inputs, objective, expected output, actual output, status, evidence and traceability. The highest-risk tests prove that stock cannot become negative, expired batches are not fulfilled, transactions roll back, unauthorized roles are denied, and concurrent sales cannot oversell.

## Future real-world problems and roadmap

Near-term work includes authentication/RBAC, FEFO picking, barcode scanning, returns/recalls, report exports, multi-location inventory, and backup drills. Later work can add offline operation, supplier integration, tax/localization, forecasting, delivery tracking, and BI. New threats include ransomware, credential theft, regulation changes, supply shortages, duplicate offline sync, counterfeit products, and unsafe AI recommendations; each requires controls, human oversight, and regression evidence.

## Reflection

Agile tools make invisible coordination visible. A board is useful only when cards contain acceptance criteria, responsibility, dates, and honest status. Version control is not merely storage: small commits and reviewed branches explain how decisions evolved. Requirements, diagrams, code, and tests become more valuable when they are traceable to one another. The largest lesson is that inventory correctness is a business control, not just a user-interface feature.

## References

Kung, D. C. (2024). *Software engineering: An agile unified methodology* (2nd ed.). McGraw Hill.

Schwaber, K., & Sutherland, J. (2020). *The Scrum guide*. Scrum.org. https://scrumguides.org/

Sommerville, I. (2020). *Engineering software products: An introduction to modern software engineering*. Pearson.

OWASP Foundation. (2021). *OWASP Top 10: The ten most critical web application security risks*. https://owasp.org/Top10/
