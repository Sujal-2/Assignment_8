USE medistock;

-- All monetary values in this seed file are Nepalese Rupees (NPR).

INSERT INTO users (role_id, full_name, email, password_hash)
SELECT id, 'Demo Inventory Manager', 'inventory@medistock.demo', '$2b$12$demo.hash.not.for.production'
FROM roles WHERE name = 'Inventory Manager'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), active = TRUE;

INSERT INTO suppliers (name, contact_name, phone, email, lead_time_days)
VALUES
  ('Medline Distributors', 'Anil Sharma', '+977-01-5550101', 'orders@medline.demo', 5),
  ('Himalayan Surgical Supply', 'Rina Karki', '+977-01-5550102', 'sales@himalayansurgical.demo', 8),
  ('Global Pharma Trade', 'David Lee', '+977-01-5550103', 'orders@globalpharma.demo', 12);

INSERT INTO customers (customer_code, name, type, credit_limit)
VALUES
  ('CUS-001', 'Norvic Hospital', 'hospital', 50000.00),
  ('CUS-002', 'Green City Clinic', 'clinic', 15000.00),
  ('CUS-003', 'Central Care Pharmacy', 'pharmacy', 10000.00)
ON DUPLICATE KEY UPDATE name = VALUES(name), type = VALUES(type), active = TRUE;

INSERT INTO products (sku, name, category, manufacturer, dosage_form, reorder_level, tax_rate)
VALUES
  ('MED-001', 'Amoxicillin 500mg', 'Antibiotics', 'Demo Pharma', 'Capsule', 25, 0),
  ('MED-002', 'Nitrile Examination Gloves', 'Consumables', 'SafeHands', 'Box', 100, 0),
  ('MED-003', 'Insulin Glargine 100 IU', 'Diabetes Care', 'Demo Biologics', 'Injection', 18, 0),
  ('MED-004', 'Digital Thermometer', 'Equipment', 'MedTech', 'Device', 20, 0),
  ('MED-005', 'Normal Saline 500ml', 'IV Fluids', 'Care Fluids', 'Bag', 40, 0)
ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category), reorder_level = VALUES(reorder_level), active = TRUE;

INSERT INTO batches (product_id, batch_number, expiry_date, quantity, unit_cost, sale_price, storage_zone)
SELECT id, 'AMX-2408', '2026-10-12', 18, 12.00, 18.00, 'A-01' FROM products WHERE sku = 'MED-001'
ON DUPLICATE KEY UPDATE expiry_date = VALUES(expiry_date), quantity = VALUES(quantity), unit_cost = VALUES(unit_cost), sale_price = VALUES(sale_price);

INSERT INTO batches (product_id, batch_number, expiry_date, quantity, unit_cost, sale_price, storage_zone)
SELECT id, 'GLV-1142', '2028-01-30', 240, 8.00, 12.00, 'B-04' FROM products WHERE sku = 'MED-002'
ON DUPLICATE KEY UPDATE expiry_date = VALUES(expiry_date), quantity = VALUES(quantity), unit_cost = VALUES(unit_cost), sale_price = VALUES(sale_price);

INSERT INTO batches (product_id, batch_number, expiry_date, quantity, unit_cost, sale_price, storage_zone)
SELECT id, 'INS-7730', '2026-09-24', 12, 950.00, 1180.00, 'COLD-01' FROM products WHERE sku = 'MED-003'
ON DUPLICATE KEY UPDATE expiry_date = VALUES(expiry_date), quantity = VALUES(quantity), unit_cost = VALUES(unit_cost), sale_price = VALUES(sale_price);

INSERT INTO batches (product_id, batch_number, expiry_date, quantity, unit_cost, sale_price, storage_zone)
SELECT id, 'THM-9901', '2030-12-31', 68, 700.00, 950.00, 'E-02' FROM products WHERE sku = 'MED-004'
ON DUPLICATE KEY UPDATE expiry_date = VALUES(expiry_date), quantity = VALUES(quantity), unit_cost = VALUES(unit_cost), sale_price = VALUES(sale_price);

INSERT INTO batches (product_id, batch_number, expiry_date, quantity, unit_cost, sale_price, storage_zone)
SELECT id, 'NSL-6208', '2026-09-02', 84, 75.00, 95.00, 'D-03' FROM products WHERE sku = 'MED-005'
ON DUPLICATE KEY UPDATE expiry_date = VALUES(expiry_date), quantity = VALUES(quantity), unit_cost = VALUES(unit_cost), sale_price = VALUES(sale_price);
