# Test Plan

## Strategy

Risk-based testing concentrates on stock integrity, expiry safety, invoice accuracy, access control, and audit evidence. Unit tests cover validation and calculations. Integration tests verify MySQL transactions across sales/purchases, batches, ledger entries, and audit logs. System tests exercise end-to-end workflows. UAT confirms that real staff can complete daily work. Positive, negative, boundary, security, performance, accessibility, regression, backup, and recovery scenarios supplement these levels.

## Environments and data

- Local demo for interface/usability checks.
- Dedicated non-production MySQL database for integration/system testing.
- Synthetic suppliers and business customers only; no patient or confidential production data.
- Fixed time zone and currency per test run; audit timestamps checked in UTC.

## Entry and exit criteria

Entry: accepted requirement and build deployed; environment healthy; test accounts/data available; blocking dependencies resolved. Exit: all critical/high tests pass, no open severity-1/2 defects, regression pass complete, UAT approval recorded, backup restore proven, and requirement-to-test traceability complete.

## Defect severity

Severity 1: data loss, unauthorized access, expired/insufficient stock sold, or service unavailable. Severity 2: key workflow produces wrong financial/stock result. Severity 3: noncritical feature impaired with workaround. Severity 4: cosmetic/documentation issue.

The Excel test matrix is the execution source of truth. Testers update Actual Output, Status, Executed By, Execution Date, Defect ID, and Evidence Link without altering the planned objective or expected result.
