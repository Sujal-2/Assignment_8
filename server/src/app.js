
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { z } from "zod";
import { pool, withTransaction } from "./db.js";
import "dotenv/config";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "250kb" }));

const lineSchema = z.object({ productId: z.number().int().positive(), batchId: z.number().int().positive(), quantity: z.number().int().positive(), unitPrice: z.number().nonnegative() });
const saleSchema = z.object({ customerId: z.number().int().positive(), reference: z.string().trim().max(80).optional(), createdBy: z.number().int().positive(), items: z.array(lineSchema).min(1).max(100) });
const purchaseSchema = z.object({ supplierId: z.number().int().positive(), supplierInvoice: z.string().trim().min(1).max(80), createdBy: z.number().int().positive(), items: z.array(lineSchema).min(1).max(100) });

app.get("/health", async (_request, response, next) => { try { await pool.query("SELECT 1"); response.json({ status: "ok", database: "connected" }); } catch (error) { next(error); } });

app.get("/api/products", async (request, response, next) => {
  try {
    const search = `%${String(request.query.search || "")}%`;
    const [rows] = await pool.execute(`SELECT p.id, p.sku, p.name, p.category, p.reorder_level AS reorderAt,
      COALESCE(SUM(b.quantity),0) AS stock, MIN(b.expiry_date) AS nearestExpiry,
      ROUND(SUM(b.quantity * b.unit_cost),2) AS inventoryValue
      FROM products p LEFT JOIN batches b ON b.product_id=p.id AND b.quantity>0
      WHERE p.active=1 AND (p.name LIKE ? OR p.sku LIKE ? OR p.category LIKE ?)
      GROUP BY p.id ORDER BY p.name LIMIT 200`, [search, search, search]);
    response.json(rows);
  } catch (error) { next(error); }
});

app.get("/api/dashboard", async (_request, response, next) => {
  try {
    const [[sales]] = await pool.query("SELECT COALESCE(SUM(total_amount),0) salesMonth, COUNT(*) orderCount FROM sales WHERE status='posted' AND sold_at>=DATE_FORMAT(CURRENT_DATE,'%Y-%m-01')");
    const [[inventory]] = await pool.query("SELECT COALESCE(SUM(quantity*unit_cost),0) inventoryValue, COALESCE(SUM(quantity),0) units FROM batches");
    const [[alerts]] = await pool.query("SELECT COUNT(*) alertCount FROM (SELECT p.id FROM products p LEFT JOIN batches b ON b.product_id=p.id GROUP BY p.id HAVING COALESCE(SUM(b.quantity),0)<=p.reorder_level) x");
    response.json({ currency: "NPR", ...sales, ...inventory, ...alerts });
  } catch (error) { next(error); }
});

app.post("/api/sales", async (request, response, next) => {
  try {
    const input = saleSchema.parse(request.body);
    const result = await withTransaction(async (connection) => {
      const invoice = `INV-${Date.now().toString().slice(-8)}`;
      const total = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const [sale] = await connection.execute("INSERT INTO sales (invoice_number,customer_id,customer_reference,total_amount,status,created_by) VALUES (?,?,?,?, 'posted',?)", [invoice,input.customerId,input.reference||null,total,input.createdBy]);
      for (const item of input.items) {
        const [[batch]] = await connection.execute("SELECT quantity FROM batches WHERE id=? AND product_id=? FOR UPDATE", [item.batchId,item.productId]);
        if (!batch || batch.quantity < item.quantity) throw Object.assign(new Error("Insufficient stock for one or more items"), { status: 409 });
        await connection.execute("INSERT INTO sale_items (sale_id,product_id,batch_id,quantity,unit_price) VALUES (?,?,?,?,?)", [sale.insertId,item.productId,item.batchId,item.quantity,item.unitPrice]);
        await connection.execute("UPDATE batches SET quantity=quantity-? WHERE id=?", [item.quantity,item.batchId]);
        await connection.execute("INSERT INTO inventory_transactions (product_id,batch_id,type,quantity,reference_type,reference_id,created_by) VALUES (?,?, 'sale', ?, 'sale', ?, ?)", [item.productId,item.batchId,-item.quantity,sale.insertId,input.createdBy]);
      }
      await connection.execute("INSERT INTO audit_logs (user_id,action,entity_type,entity_id,details) VALUES (?, 'SALE_POSTED', 'sale', ?, JSON_OBJECT('invoice',?,'total',?))", [input.createdBy,sale.insertId,invoice,total]);
      return { id:sale.insertId, invoice, total, currency:"NPR" };
    });
    response.status(201).json(result);
  } catch (error) { next(error); }
});

app.post("/api/purchases", async (request, response, next) => {
  try {
    const input = purchaseSchema.parse(request.body);
    const result = await withTransaction(async (connection) => {
      const total = input.items.reduce((sum,item)=>sum+item.quantity*item.unitPrice,0);
      const purchaseNumber = `PO-${Date.now().toString().slice(-8)}`;
      const [purchase] = await connection.execute("INSERT INTO purchases (purchase_number,supplier_id,supplier_invoice,total_amount,status,created_by,received_at) VALUES (?,?,?,?, 'received',?,NOW())", [purchaseNumber,input.supplierId,input.supplierInvoice,total,input.createdBy]);
      for (const item of input.items) {
        await connection.execute("INSERT INTO purchase_items (purchase_id,product_id,batch_id,quantity,unit_cost) VALUES (?,?,?,?,?)", [purchase.insertId,item.productId,item.batchId,item.quantity,item.unitPrice]);
        await connection.execute("UPDATE batches SET quantity=quantity+?, unit_cost=? WHERE id=? AND product_id=?", [item.quantity,item.unitPrice,item.batchId,item.productId]);
        await connection.execute("INSERT INTO inventory_transactions (product_id,batch_id,type,quantity,reference_type,reference_id,created_by) VALUES (?,?, 'purchase', ?, 'purchase', ?, ?)", [item.productId,item.batchId,item.quantity,purchase.insertId,input.createdBy]);
      }
      return { id:purchase.insertId, total, currency:"NPR" };
    });
    response.status(201).json(result);
  } catch (error) { next(error); }
});

app.use((error,_request,response,next)=>{
  void next;
  if (error instanceof z.ZodError) return response.status(400).json({ error:"Validation failed", details:error.flatten() });
  const status=Number(error.status)||500;
  if (status>=500) console.error(error);
  return response.status(status).json({ error:status>=500?"Unexpected server error":error.message });
});

const port=Number(process.env.PORT||4000);
app.listen(port,()=>console.log(`MediStock API listening on ${port}`));
