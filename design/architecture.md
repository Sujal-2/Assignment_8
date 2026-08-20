# Extensible Architecture

```mermaid
flowchart LR
  Browser[React / Tailwind client] --> Adapter[API adapter]
  Adapter --> API[Express REST API]
  API --> Validation[Validation + RBAC]
  Validation --> Services[Sales, purchasing, inventory services]
  Services --> MySQL[(MySQL 8)]
  Services --> Audit[Audit and inventory ledger]
  Services -. future .-> Queue[Jobs / notifications]
  Services -. future .-> Barcode[Barcode / GS1]
  Services -. future .-> Analytics[Forecasting and BI]
```

The UI can run against demo data for presentation or switch to the API adapter. Service boundaries isolate domain rules from transport and storage. MySQL transactions and row locks keep sales, purchases, batches, ledger entries, and audits consistent. New integrations should subscribe to committed events rather than changing stock directly.
