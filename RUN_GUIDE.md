# MediStock Operations — Complete Windows Run Guide

This package has two runnable parts:

1. **Frontend demonstration:** the fastest option. It displays the dashboard and supports interactive NPR sales, purchase receipts, product creation, CSV exports, search, stock updates, audit entries, and browser persistence without requiring a database.
2. **MySQL + Express API:** the backend foundation for persistent real-world data. It can be run separately and tested through its API. The current browser interface is fully interactive with local persistence; `lib/api.ts` and the included transactional API are the handoff point for moving the same workflows to centralized company data.

## 1. Software required

Install these programs before starting:

- Node.js 22 LTS or later: https://nodejs.org/
- MySQL Community Server 8.0 or later: https://dev.mysql.com/downloads/mysql/
- MySQL Workbench, recommended: https://dev.mysql.com/downloads/workbench/
- Visual Studio Code, optional: https://code.visualstudio.com/

Verify Node.js from PowerShell:

```powershell
node --version
npm.cmd --version
```

The Node version should be `v22.13.0` or later. On Windows, use `npm.cmd` if PowerShell reports that `npm.ps1` cannot run because scripts are disabled.

## 2. Extract and open the project

1. Right-click `MediStock_Operations_Full_Project.zip` and choose **Extract All**.
2. Open the extracted `medistock-pro` folder.
3. Click the folder address bar, type `powershell`, and press Enter.

You should be in a path ending with:

```text
medistock-pro
```

## 3. Run the frontend demonstration

From the root `medistock-pro` folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Wait until the terminal displays a local address, normally:

```text
http://localhost:3000
```

Open that address in Chrome, Edge, or Firefox.

### Demo features to try

- Search for `amoxicillin`, `MED-001`, or `antibiotics`.
- Select **New sale**, choose a product and quantity, and create an invoice.
- Try to sell more units than are available; the sale should be blocked.
- Select **Receive stock** to increase product quantity.
- Add a product with an NPR selling price and reorder level.
- Export inventory, sales, or purchase records to CSV.
- Refresh the page and confirm working demo records persist in the browser.
- Observe the inventory value and low-stock indicators recalculate.
- Reduce the browser width to view the mobile navigation.

To stop the frontend, return to its PowerShell window and press `Ctrl+C`.

## 4. Create the MySQL database

### Option A — MySQL Workbench

1. Start MySQL Server and open MySQL Workbench.
2. Open your local MySQL connection.
3. Choose **File → Open SQL Script**.
4. Open `server/sql/schema.sql`.
5. Click the lightning-bolt **Execute** button.
6. Open and execute `server/sql/seed.sql`.
7. In the Schemas panel, refresh and confirm that `medistock` exists.

### Option B — MySQL command line

From the root project folder:

```powershell
mysql -u root -p < server\sql\schema.sql
mysql -u root -p medistock < server\sql\seed.sql
```

Enter the MySQL root password when requested.

### Recommended application account

Run the following in MySQL Workbench. Replace the example password with a strong private password:

```sql
CREATE USER IF NOT EXISTS 'medistock_app'@'localhost'
IDENTIFIED BY 'replace-with-a-strong-private-password';

GRANT SELECT, INSERT, UPDATE, DELETE
ON medistock.*
TO 'medistock_app'@'localhost';

FLUSH PRIVILEGES;
```

Do not commit the real password to GitHub.

## 5. Configure the Express backend

Open a second PowerShell window and move to the backend folder:

```powershell
cd server
Copy-Item .env.example .env
notepad .env
```

Update `.env` to match your MySQL installation:

```dotenv
PORT=4000
FRONTEND_URL=http://localhost:3000
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=medistock
MYSQL_USER=medistock_app
MYSQL_PASSWORD=your-real-private-password
MYSQL_CONNECTION_LIMIT=10
```

Save and close Notepad. Then install and start the API:

```powershell
npm.cmd install
npm.cmd run dev
```

The backend should display:

```text
MediStock API listening on 4000
```

## 6. Verify the backend

Open a third PowerShell window.

### Health check

```powershell
Invoke-RestMethod http://localhost:4000/health
```

Expected result:

```text
status database
------ --------
ok     connected
```

### Read seeded products

```powershell
Invoke-RestMethod "http://localhost:4000/api/products?search=amoxicillin"
```

### Read dashboard totals

```powershell
Invoke-RestMethod http://localhost:4000/api/dashboard
```

### Create a test sale through the API

The seed data creates product 1, batch 1, customer 1, and user 1 in a new database:

```powershell
$sale = @{
  customerId = 1
  reference = "DEMO-PO-001"
  createdBy = 1
  items = @(
    @{
      productId = 1
      batchId = 1
      quantity = 2
      unitPrice = 18.00
    }
  )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Uri http://localhost:4000/api/sales `
  -Method Post `
  -ContentType "application/json" `
  -Body $sale
```

The response should contain a new invoice number and total. Run the product query again to confirm the batch quantity decreased.

### Receive stock through the API

```powershell
$purchase = @{
  supplierId = 1
  supplierInvoice = "SUP-DEMO-001"
  createdBy = 1
  items = @(
    @{
      productId = 1
      batchId = 1
      quantity = 20
      unitPrice = 12.00
    }
  )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Uri http://localhost:4000/api/purchases `
  -Method Post `
  -ContentType "application/json" `
  -Body $purchase
```

Use a different `supplierInvoice` value each time because duplicate supplier invoices are rejected.

## 7. Production build check

From the root `medistock-pro` folder:

```powershell
npm.cmd run build
node --test tests\rendered-html.test.mjs
```

The build should complete and both automated tests should pass.

## 8. Coursework files

- `requirements/` — functional/non-functional requirements and stakeholders
- `planning/` — 10 user stories, Sprint 1, Gantt, and Trello import
- `design/` — Use Case, Class, Sequence, Activity, and architecture diagrams
- `testing/MediStock_Test_Matrix.xlsx` — Excel test execution matrix
- `docs/project-report.md` — structured report
- `docs/github-workflow.md` — branch, pull request, commit, and screenshot procedure

Import `planning/trello-import.csv` into Trello and capture genuine board/activity screenshots. Upload the extracted project to a real GitHub repository and follow `docs/github-workflow.md`; screenshots must show actual Trello and GitHub history.

## 9. Common problems

### `npm.ps1 cannot be loaded`

Use `npm.cmd` instead of `npm`:

```powershell
npm.cmd install
npm.cmd run dev
```

### Port 3000 or 4000 is already used

Stop the other process, or change `PORT=4000` in `server/.env`. The frontend development server may automatically choose a different available port.

### MySQL access denied

Confirm the username/password in `server/.env`, test the account in Workbench, and ensure the account has access to `medistock`.

### Backend says the database does not exist

Execute `server/sql/schema.sql`, then `server/sql/seed.sql`, and restart the backend.

### Empty product results

Execute `server/sql/seed.sql` once. If it was already executed successfully, query without a search value:

```powershell
Invoke-RestMethod http://localhost:4000/api/products
```

## 10. Important production limitations

This is an academic demonstration and extensible foundation. Before real business deployment, complete authentication, password hashing, role middleware, database migrations, automated API tests, rate limiting, HTTPS, secure secret storage, backups, monitoring, barcode/FEFO enforcement, returns/recalls, and legal/tax review. Never use real patient data in this system.


## 10. Nepal / NPR deployment note

The interface and seeded monetary values use **NPR (Nepalese Rupees)**. The MySQL schema stores money as `DECIMAL`, so no floating-point currency conversion is performed. For a real Nepal deployment, configure the company PAN/VAT details, invoice numbering policy, tax treatment for each product category, and any IRD-compliant billing requirements with the company accountant before issuing statutory invoices.
