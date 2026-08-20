"use client";

import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Building2,
  ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Clock3, CreditCard, Download,
  FileDown, FileText, LayoutDashboard, Menu, Package2, Plus, ReceiptText, Search, Settings,
  ShieldCheck, ShoppingCart, Stethoscope, Truck, UserRound, Users, X, Save,
  BadgeDollarSign, Boxes, RotateCcw, Landmark, Phone,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Product = {
  id:string; name:string; category:string; manufacturer:string; stock:number; reorderAt:number;
  unitPrice:number; batch:string; expiry:string;
};
type SaleRecord = { id:string; customer:string; product:string; quantity:number; total:number; date:string; status:"Paid"|"Due" };
type PurchaseRecord = { id:string; vendor:string; product:string; quantity:number; total:number; date:string; reference:string };
type Customer = { code:string; name:string; type:string; phone:string; balance:number };
type Vendor = { code:string; name:string; contact:string; phone:string; leadTime:string };
type AuditEntry = { id:string; action:string; detail:string; time:string; type:"sale"|"stock"|"user"|"system" };

const initialProducts:Product[] = [
  { id:"MED-001", name:"Amoxicillin 500mg", category:"Antibiotics", manufacturer:"Nepal Pharma", stock:18, reorderAt:25, unitPrice:18, batch:"AMX-2408", expiry:"2026-10-12" },
  { id:"MED-002", name:"Nitrile Examination Gloves", category:"Consumables", manufacturer:"Himal Med", stock:240, reorderAt:100, unitPrice:12, batch:"GLV-1142", expiry:"2028-01-30" },
  { id:"MED-003", name:"Insulin Glargine 100 IU", category:"Diabetes Care", manufacturer:"BioCare", stock:12, reorderAt:18, unitPrice:1180, batch:"INS-7730", expiry:"2026-09-24" },
  { id:"MED-004", name:"Digital Thermometer", category:"Equipment", manufacturer:"MedTech", stock:68, reorderAt:20, unitPrice:950, batch:"THM-9901", expiry:"2030-12-31" },
  { id:"MED-005", name:"Normal Saline 500ml", category:"IV Fluids", manufacturer:"Lomus", stock:84, reorderAt:40, unitPrice:95, batch:"NSL-6208", expiry:"2026-09-02" },
];

const initialSales:SaleRecord[] = [
  {id:"INV-3418",customer:"Norvic Hospital",product:"Insulin Glargine 100 IU",quantity:8,total:9440,date:"2026-08-20T09:42:00",status:"Paid"},
  {id:"INV-3417",customer:"Green City Clinic",product:"Normal Saline 500ml",quantity:24,total:2280,date:"2026-08-19T15:18:00",status:"Paid"},
  {id:"INV-3416",customer:"Central Care Pharmacy",product:"Amoxicillin 500mg",quantity:60,total:1080,date:"2026-08-18T11:10:00",status:"Due"},
];
const initialPurchases:PurchaseRecord[] = [
  {id:"PO-1082",vendor:"Medline Distributors",product:"Nitrile Examination Gloves",quantity:120,total:1080,date:"2026-08-20T08:15:00",reference:"SUP-2026-184"},
  {id:"PO-1081",vendor:"Himalayan Surgical Supply",product:"Normal Saline 500ml",quantity:100,total:7800,date:"2026-08-18T13:30:00",reference:"HSS-8821"},
];
const customers:Customer[] = [
  {code:"CUS-001",name:"Norvic Hospital",type:"Hospital",phone:"01-5970032",balance:0},
  {code:"CUS-002",name:"Green City Clinic",type:"Clinic",phone:"01-5912288",balance:0},
  {code:"CUS-003",name:"Central Care Pharmacy",type:"Pharmacy",phone:"9801002233",balance:1080},
  {code:"CUS-004",name:"Valley Health Centre",type:"Clinic",phone:"01-5458901",balance:0},
];
const vendors:Vendor[] = [
  {code:"VEN-001",name:"Medline Distributors",contact:"Rajan Shrestha",phone:"9802004411",leadTime:"2–3 days"},
  {code:"VEN-002",name:"Himalayan Surgical Supply",contact:"Prakriti Karki",phone:"9818005622",leadTime:"3–5 days"},
  {code:"VEN-003",name:"Global Pharma Trade",contact:"Suman Rai",phone:"9851130088",leadTime:"5–7 days"},
];
const initialAudit:AuditEntry[] = [
  {id:"AUD-1",action:"Invoice INV-3418 issued",detail:"Norvic Hospital · NPR 9,440",time:"Today, 9:42 AM",type:"sale"},
  {id:"AUD-2",action:"Purchase PO-1082 received",detail:"Medline Distributors · 120 units",time:"Today, 8:15 AM",type:"stock"},
  {id:"AUD-3",action:"Customer profile updated",detail:"Green City Clinic",time:"Yesterday",type:"user"},
];

const navItems = [
  ["Dashboard",LayoutDashboard],["Products",Package2],["Purchases",Truck],["Sales & invoices",ShoppingCart],
  ["Customers",Building2],["Vendors",Users],["Reports",BarChart3],["Project team",Users]
] as const;
const teamMembers=[
  {name:"Himanshu Shrestha",initials:"HS",role:"Scrum Master / Project Coordinator",focus:"Sprint coordination, blockers and Agile ceremonies"},
  {name:"Surya Malla",initials:"SM",role:"Business Analyst",focus:"Requirements, workflows and business rules"},
  {name:"Sujal Tuladhar",initials:"ST",role:"Product Owner",focus:"Backlog priority, scope and stakeholder acceptance"},
  {name:"Sandesh Bikram Malla",initials:"SB",role:"System Design & GitHub Coordinator",focus:"Architecture, diagrams and document version control"},
  {name:"Gopal Raut",initials:"GR",role:"QA & Testing Coordinator",focus:"Test planning, execution, defects and release quality"},
] as const;
const salesTrend=[42,55,49,68,62,74,71,86,78,92,84,96,91,108];
const money=(value:number, decimals=0)=>`NPR ${new Intl.NumberFormat("en-NP",{minimumFractionDigits:decimals,maximumFractionDigits:decimals}).format(value)}`;
const formatDate=(value:string)=>new Date(value).toLocaleDateString("en-NP",{month:"short",day:"2-digit",year:"numeric"});
const formatDateTime=(value:string)=>new Date(value).toLocaleString("en-NP",{month:"short",day:"2-digit",hour:"numeric",minute:"2-digit"});

function MiniTrend(){
  const path=salesTrend.map((value,index)=>`${index===0?"M":"L"} ${(index/(salesTrend.length-1))*100} ${100-((value-35)/80)*100}`).join(" ");
  return <div className="trend-wrap" aria-label="Sales trend over the last 14 days"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img"><defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1f8a70" stopOpacity=".28"/><stop offset="100%" stopColor="#1f8a70" stopOpacity="0"/></linearGradient></defs><path d={`${path} L 100 100 L 0 100 Z`} fill="url(#salesFill)"/><path d={path} fill="none" stroke="#1f8a70" strokeWidth="2.4" vectorEffect="non-scaling-stroke"/></svg><div className="chart-labels"><span>07 Aug</span><span>13 Aug</span><span>20 Aug</span></div></div>;
}

function EmptyState({title,detail}:{title:string;detail:string}){
  return <div className="empty-state"><Boxes size={26}/><strong>{title}</strong><span>{detail}</span></div>;
}

export default function Home(){
  const [active,setActive]=useState("Dashboard");
  const [products,setProducts]=useState(initialProducts);
  const [sales,setSales]=useState(initialSales);
  const [purchases,setPurchases]=useState(initialPurchases);
  const [audit,setAudit]=useState(initialAudit);
  const [query,setQuery]=useState("");
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [saleOpen,setSaleOpen]=useState(false);
  const [purchaseOpen,setPurchaseOpen]=useState(false);
  const [productOpen,setProductOpen]=useState(false);
  const [notice,setNotice]=useState("All systems operational · Data is saved in this browser");
  const [companyName,setCompanyName]=useState("MediStock Operations");
  const [companyPan,setCompanyPan]=useState("600123456");
  const [hydrated,setHydrated]=useState(false);
  const searchRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{
    try{
      const saved=localStorage.getItem("medistock-company-demo-v2");
      if(saved){
        const data=JSON.parse(saved);
        if(Array.isArray(data.products)) setProducts(data.products);
        if(Array.isArray(data.sales)) setSales(data.sales);
        if(Array.isArray(data.purchases)) setPurchases(data.purchases);
        if(Array.isArray(data.audit)) setAudit(data.audit);
        if(data.companyName) setCompanyName(data.companyName);
        if(data.companyPan) setCompanyPan(data.companyPan);
      }
    }catch{ /* keep safe demo defaults */ }
    finally{ setHydrated(true); }
  },[]);
  useEffect(()=>{
    if(!hydrated) return;
    localStorage.setItem("medistock-company-demo-v2",JSON.stringify({products,sales,purchases,audit,companyName,companyPan}));
  },[hydrated,products,sales,purchases,audit,companyName,companyPan]);
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();searchRef.current?.focus();}};
    window.addEventListener("keydown",onKey); return()=>window.removeEventListener("keydown",onKey);
  },[]);

  const lowStock=products.filter(product=>product.stock<=product.reorderAt);
  const filteredProducts=useMemo(()=>products.filter(product=>`${product.name} ${product.id} ${product.category} ${product.manufacturer} ${product.batch}`.toLowerCase().includes(query.toLowerCase())),[products,query]);
  const filteredSales=useMemo(()=>sales.filter(item=>`${item.id} ${item.customer} ${item.product} ${item.status}`.toLowerCase().includes(query.toLowerCase())),[sales,query]);
  const filteredPurchases=useMemo(()=>purchases.filter(item=>`${item.id} ${item.vendor} ${item.product} ${item.reference}`.toLowerCase().includes(query.toLowerCase())),[purchases,query]);
  const inventoryValue=products.reduce((sum,p)=>sum+p.stock*p.unitPrice,0);
  const salesValue=sales.reduce((sum,item)=>sum+item.total,0);
  const dueValue=sales.filter(s=>s.status==="Due").reduce((sum,item)=>sum+item.total,0);

  function addAudit(action:string,detail:string,type:AuditEntry["type"]){
    setAudit(items=>[{id:`AUD-${Date.now()}`,action,detail,time:"Just now",type},...items].slice(0,30));
  }
  function recordSale(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); const data=new FormData(event.currentTarget); const id=String(data.get("product"));
    const quantity=Number(data.get("quantity")); const customer=String(data.get("customer")); const status=String(data.get("status")) as "Paid"|"Due";
    const product=products.find(item=>item.id===id);
    if(!product||quantity<1||quantity>product.stock){setNotice("Sale blocked: quantity exceeds available stock or is invalid");return;}
    const invoice=`INV-${Math.floor(3500+Math.random()*500)}`; const total=quantity*product.unitPrice;
    setProducts(items=>items.map(item=>item.id===id?{...item,stock:item.stock-quantity}:item));
    setSales(items=>[{id:invoice,customer,product:product.name,quantity,total,date:new Date().toISOString(),status},...items]);
    addAudit(`Invoice ${invoice} issued`,`${customer} · ${money(total)}`,"sale");
    setNotice(`${invoice} created · ${money(total)} · stock updated automatically`); setSaleOpen(false);
  }
  function recordPurchase(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); const data=new FormData(event.currentTarget); const id=String(data.get("product")); const quantity=Number(data.get("quantity"));
    const vendor=String(data.get("vendor")); const reference=String(data.get("reference")||""); const unitCost=Number(data.get("unitCost")); const product=products.find(item=>item.id===id);
    if(!product||quantity<1||unitCost<0){setNotice("Purchase blocked: check quantity and unit cost");return;}
    const po=`PO-${Math.floor(1100+Math.random()*400)}`; const total=quantity*unitCost;
    setProducts(items=>items.map(item=>item.id===id?{...item,stock:item.stock+quantity}:item));
    setPurchases(items=>[{id:po,vendor,product:product.name,quantity,total,date:new Date().toISOString(),reference:reference||"—"},...items]);
    addAudit(`Purchase ${po} received`,`${vendor} · ${quantity} units · ${money(total)}`,"stock");
    setNotice(`${po} received · ${quantity} units added to ${product.name}`); setPurchaseOpen(false);
  }
  function addProduct(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); const data=new FormData(event.currentTarget);
    const product:Product={id:String(data.get("sku")).trim().toUpperCase(),name:String(data.get("name")).trim(),category:String(data.get("category")).trim(),manufacturer:String(data.get("manufacturer")).trim(),stock:Number(data.get("stock")),reorderAt:Number(data.get("reorderAt")),unitPrice:Number(data.get("unitPrice")),batch:String(data.get("batch")).trim(),expiry:String(data.get("expiry"))};
    if(!product.id||!product.name||products.some(p=>p.id===product.id)){setNotice("Product not added: SKU must be unique and product name is required");return;}
    setProducts(items=>[product,...items]); addAudit(`Product ${product.id} added`,product.name,"system"); setNotice(`${product.name} added to inventory`); setProductOpen(false);
  }
  function exportCSV(kind:"products"|"sales"|"purchases"){
    const rows = kind==="products" ? [["SKU","Product","Category","Manufacturer","Batch","Stock","Reorder Level","Expiry","Unit Price NPR"],...products.map(p=>[p.id,p.name,p.category,p.manufacturer,p.batch,p.stock,p.reorderAt,p.expiry,p.unitPrice])]
      : kind==="sales" ? [["Invoice","Customer","Product","Quantity","Total NPR","Status","Date"],...sales.map(s=>[s.id,s.customer,s.product,s.quantity,s.total,s.status,s.date])]
      : [["PO","Vendor","Product","Quantity","Total NPR","Supplier Reference","Date"],...purchases.map(p=>[p.id,p.vendor,p.product,p.quantity,p.total,p.reference,p.date])];
    const csv=rows.map(row=>row.map(cell=>`"${String(cell).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`medistock-${kind}-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url); setNotice(`${kind[0].toUpperCase()+kind.slice(1)} report exported as CSV`);
  }
  function resetDemo(){
    setProducts(initialProducts);setSales(initialSales);setPurchases(initialPurchases);setAudit(initialAudit);setCompanyName("MediStock Operations");setCompanyPan("600123456");setNotice("Demo data reset successfully");
  }

  const pageDescription:Record<string,string>={
    Dashboard:"Monitor medical stock, fulfil customer orders, and act on risks early.",Products:"Manage products, batches, expiry dates, selling prices, and reorder thresholds.",Purchases:"Receive supplier stock and keep a traceable purchase history.","Sales & invoices":"Record sales, issue invoice references, and track payment status.",Customers:"Manage hospitals, clinics, pharmacies, credit exposure, and contacts.",Vendors:"Maintain approved supplier contacts and expected lead times.",Reports:"Review operational KPIs and export records for finance or management.","Project team":"Project ownership and Agile responsibilities for the five-member team.","Audit log":"Review traceable business activity recorded by the interface.",Settings:"Configure company identity and reset local demonstration data."
  };

  function renderDashboard(){return <>
    <section className="metrics-grid" aria-label="Business metrics">
      <article className="metric-card"><div className="metric-icon green"><CreditCard size={20}/></div><div className="metric-top"><span>Recorded sales</span><span className="pill positive"><ArrowUpRight size={13}/>NPR</span></div><strong>{money(salesValue)}</strong><small>{sales.length} invoices currently recorded</small></article>
      <article className="metric-card"><div className="metric-icon blue"><Package2 size={20}/></div><div className="metric-top"><span>Inventory retail value</span><span className="pill positive"><ArrowUpRight size={13}/>{products.length} SKUs</span></div><strong>{money(inventoryValue)}</strong><small>{products.reduce((sum,p)=>sum+p.stock,0).toLocaleString("en-NP")} units in stock</small></article>
      <article className="metric-card attention"><div className="metric-icon amber"><AlertTriangle size={20}/></div><div className="metric-top"><span>Stock requiring action</span><span className="pill negative"><ArrowDownRight size={13}/>Urgent</span></div><strong>{lowStock.length}</strong><small>{lowStock.filter(p=>new Date(p.expiry)<new Date("2026-11-01")).length} also near expiry</small></article>
      <article className="metric-card"><div className="metric-icon violet"><BadgeDollarSign size={20}/></div><div className="metric-top"><span>Outstanding receivables</span><span className="pill neutral">Due</span></div><strong>{money(dueValue)}</strong><small>From {sales.filter(s=>s.status==="Due").length} unpaid invoice(s)</small></article>
    </section>
    <section className="dashboard-grid"><article className="panel sales-panel"><div className="panel-head"><div><h2>Sales performance</h2><p>Operational trend for the last 14 days</p></div><span className="select-button">Last 14 days <ChevronDown size={15}/></span></div><div className="chart-summary"><div><span>Revenue</span><strong>{money(salesValue)}</strong></div><div><span>Orders</span><strong>{sales.length}</strong></div><div><span>Average order</span><strong>{money(sales.length?salesValue/sales.length:0)}</strong></div></div><MiniTrend/></article>
      <article className="panel alert-panel"><div className="panel-head"><div><h2>Needs attention</h2><p>Prioritised by operational risk</p></div><button className="text-button" onClick={()=>setActive("Products")}>View all <ChevronRight size={15}/></button></div><div className="alert-list">{lowStock.length?lowStock.slice(0,3).map((product,index)=><div className="alert-row" key={product.id}><div className={`alert-symbol ${index===0?"red":"amber"}`}><AlertTriangle size={17}/></div><div><strong>{product.name}</strong><span>{product.stock} left · reorder at {product.reorderAt}</span></div><button onClick={()=>{setPurchaseOpen(true);setNotice(`Reorder workflow opened for ${product.name}`)}}>Reorder</button></div>):<EmptyState title="Stock levels look healthy" detail="No products are at or below their reorder point."/>}</div></article></section>
    {renderInventoryPanel(true)}
    <section className="bottom-grid"><article className="panel activity-panel"><div className="panel-head"><div><h2>Recent activity</h2><p>Traceable operational updates</p></div><button className="text-button" onClick={()=>setActive("Audit log")}>Audit log <ChevronRight size={15}/></button></div>{renderTimeline(audit.slice(0,3))}</article><article className="panel quick-panel"><div className="panel-head"><div><h2>Quick actions</h2><p>Common operational workflows</p></div></div><div className="quick-grid"><button onClick={()=>setSaleOpen(true)}><span><ShoppingCart size={19}/></span>Record sale</button><button onClick={()=>setPurchaseOpen(true)}><span><Truck size={19}/></span>Receive stock</button><button onClick={()=>exportCSV("sales")}><span><FileText size={19}/></span>Sales report</button><button onClick={()=>setProductOpen(true)}><span><Package2 size={19}/></span>Add product</button></div></article></section>
  </>}

  function renderInventoryPanel(compact=false){return <section className="panel inventory-panel"><div className="panel-head inventory-head"><div><h2>{compact?"Inventory overview":"Product & batch inventory"}</h2><p>Live batch, stock, expiry and NPR selling-price visibility</p></div><div className="inventory-tools"><div className="mini-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter inventory" aria-label="Filter inventory"/></div><button className="icon-button" aria-label="Export inventory" onClick={()=>exportCSV("products")}><FileDown size={18}/></button>{!compact&&<button className="btn primary small" onClick={()=>setProductOpen(true)}><Plus size={15}/> Add product</button>}</div></div><div className="table-wrap"><table><thead><tr><th>Product</th><th>Manufacturer</th><th>Batch</th><th>Stock</th><th>Expiry</th><th>Unit price</th><th>Status</th></tr></thead><tbody>{filteredProducts.map(product=>{const atRisk=product.stock<=product.reorderAt;const expired=new Date(product.expiry)<new Date();return <tr key={product.id}><td data-label="Product"><div className="product-cell"><div className="product-box"><Package2 size={17}/></div><div><strong>{product.name}</strong><span>{product.id} · {product.category}</span></div></div></td><td data-label="Manufacturer">{product.manufacturer}</td><td data-label="Batch">{product.batch}</td><td data-label="Stock"><strong>{product.stock}</strong> units</td><td data-label="Expiry">{formatDate(product.expiry)}</td><td data-label="Unit price">{money(product.unitPrice,2)}</td><td data-label="Status"><span className={`status ${expired?"danger":atRisk?"low":"good"}`}><i/>{expired?"Expired":atRisk?"Low stock":"Healthy"}</span></td></tr>})}</tbody></table>{!filteredProducts.length&&<EmptyState title="No matching products" detail="Try a different product, SKU, category, batch, or manufacturer."/>}</div><div className="table-foot"><span>Showing {filteredProducts.length} of {products.length} products</span>{compact?<button onClick={()=>setActive("Products")}>Manage inventory <ChevronRight size={15}/></button>:<span className="table-note">All values in Nepalese Rupees (NPR)</span>}</div></section>}

  function renderSales(){return <section className="panel records-panel"><div className="panel-head records-head"><div><h2>Sales & invoices</h2><p>Every recorded sale reduces inventory automatically.</p></div><div className="record-actions"><button className="btn secondary" onClick={()=>exportCSV("sales")}><Download size={16}/> Export CSV</button><button className="btn primary" onClick={()=>setSaleOpen(true)}><Plus size={16}/> New sale</button></div></div><div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{filteredSales.map(s=><tr key={s.id}><td data-label="Invoice"><strong>{s.id}</strong></td><td data-label="Customer">{s.customer}</td><td data-label="Product">{s.product}</td><td data-label="Qty">{s.quantity}</td><td data-label="Total"><strong>{money(s.total)}</strong></td><td data-label="Status"><span className={`status ${s.status==="Paid"?"good":"low"}`}><i/>{s.status}</span></td><td data-label="Date">{formatDateTime(s.date)}</td></tr>)}</tbody></table></div></section>}
  function renderPurchases(){return <section className="panel records-panel"><div className="panel-head records-head"><div><h2>Purchase receipts</h2><p>Received quantities increase stock and remain traceable by supplier reference.</p></div><div className="record-actions"><button className="btn secondary" onClick={()=>exportCSV("purchases")}><Download size={16}/> Export CSV</button><button className="btn primary" onClick={()=>setPurchaseOpen(true)}><Plus size={16}/> Receive stock</button></div></div><div className="table-wrap"><table><thead><tr><th>Purchase</th><th>Vendor</th><th>Product</th><th>Qty</th><th>Cost</th><th>Supplier ref.</th><th>Date</th></tr></thead><tbody>{filteredPurchases.map(p=><tr key={p.id}><td data-label="Purchase"><strong>{p.id}</strong></td><td data-label="Vendor">{p.vendor}</td><td data-label="Product">{p.product}</td><td data-label="Qty">{p.quantity}</td><td data-label="Cost"><strong>{money(p.total)}</strong></td><td data-label="Supplier ref.">{p.reference}</td><td data-label="Date">{formatDateTime(p.date)}</td></tr>)}</tbody></table></div></section>}
  function renderCustomers(){return <section className="entity-grid">{customers.map(c=><article className="panel entity-card" key={c.code}><div className="entity-icon"><Building2 size={20}/></div><div className="entity-main"><span className="record-code">{c.code} · {c.type}</span><h3>{c.name}</h3><p><Phone size={14}/>{c.phone}</p><p><Landmark size={14}/>Credit balance: <strong>{money(c.balance)}</strong></p></div><span className={`status ${c.balance?"low":"good"}`}><i/>{c.balance?"Balance due":"In good standing"}</span></article>)}</section>}
  function renderVendors(){return <section className="entity-grid">{vendors.map(v=><article className="panel entity-card" key={v.code}><div className="entity-icon"><Truck size={20}/></div><div className="entity-main"><span className="record-code">{v.code}</span><h3>{v.name}</h3><p><UserRound size={14}/>{v.contact}</p><p><Phone size={14}/>{v.phone}</p><p><Clock3 size={14}/>Lead time: {v.leadTime}</p></div><span className="status good"><i/>Approved vendor</span></article>)}</section>}
  function renderReports(){return <><section className="report-kpis"><article className="panel report-card"><span>Sales value</span><strong>{money(salesValue)}</strong><small>{sales.length} invoices</small></article><article className="panel report-card"><span>Inventory value</span><strong>{money(inventoryValue)}</strong><small>Based on current NPR selling price</small></article><article className="panel report-card"><span>Purchase cost</span><strong>{money(purchases.reduce((s,p)=>s+p.total,0))}</strong><small>{purchases.length} receipts</small></article><article className="panel report-card"><span>Receivables</span><strong>{money(dueValue)}</strong><small>Invoices marked due</small></article></section><section className="panel report-downloads"><div className="panel-head"><div><h2>Exportable business records</h2><p>CSV files can be opened in Excel, Google Sheets, or accounting workflows.</p></div></div><div className="export-grid"><button onClick={()=>exportCSV("sales")}><ReceiptText size={22}/><strong>Sales register</strong><span>Invoices, customers, totals and payment status</span><Download size={17}/></button><button onClick={()=>exportCSV("purchases")}><Truck size={22}/><strong>Purchase register</strong><span>Supplier receipts, quantities and NPR costs</span><Download size={17}/></button><button onClick={()=>exportCSV("products")}><Package2 size={22}/><strong>Inventory report</strong><span>SKU, batch, stock, expiry and selling price</span><Download size={17}/></button></div></section></>}
  function renderTimeline(items:AuditEntry[]){return <div className="timeline">{items.map(item=><div key={item.id}><span className={`timeline-icon ${item.type}`} >{item.type==="sale"?<ReceiptText size={16}/>:item.type==="stock"?<Truck size={16}/>:item.type==="user"?<UserRound size={16}/>:<Activity size={16}/>}</span><p><strong>{item.action}</strong><small>{item.detail} · {item.time}</small></p></div>)}</div>}
  function renderAudit(){return <section className="panel audit-panel"><div className="panel-head"><div><h2>Audit log</h2><p>Browser-level trace of actions performed in this working interface.</p></div><span className="status good"><i/>Logging enabled</span></div>{renderTimeline(audit)}</section>}
  function renderTeam(){return <section className="panel team-panel" id="project-team" aria-labelledby="team-title"><div className="team-heading"><div><p className="eyebrow">Shared ownership</p><h2 id="team-title">Meet the five-person project team</h2><p>Clear Agile roles help the team move from requirements to design, testing, stakeholder acceptance, and project control.</p></div><span className="team-count"><Users size={17}/> 5 members</span></div><div className="team-grid">{teamMembers.map((member,index)=><article className="team-card" key={member.name}><div className={`team-avatar tone-${index+1}`}>{member.initials}</div><div><strong>{member.name}</strong><span>{member.role}</span><p>{member.focus}</p></div></article>)}</div></section>}
  function renderSettings(){return <section className="settings-grid"><article className="panel settings-card"><div className="settings-title"><Building2 size={21}/><div><h2>Company profile</h2><p>Used as the operating identity in this browser demo.</p></div></div><label>Company name<input value={companyName} onChange={e=>setCompanyName(e.target.value)}/></label><label>PAN / VAT number<input value={companyPan} onChange={e=>setCompanyPan(e.target.value)}/></label><label>Base currency<input value="NPR — Nepalese Rupee" disabled/></label><button className="btn primary" onClick={()=>{setNotice("Company settings saved");addAudit("Company settings updated",companyName,"system")}}><Save size={16}/> Save settings</button></article><article className="panel settings-card danger-zone"><div className="settings-title"><RotateCcw size={21}/><div><h2>Demo data</h2><p>Restore the original working dataset stored in this project.</p></div></div><p className="settings-copy">This interface stores its working demo records in your browser. For a real deployment, connect the included Express/MySQL API and authentication layer.</p><button className="btn secondary" onClick={resetDemo}><RotateCcw size={16}/> Reset demo data</button></article></section>}

  const content=active==="Dashboard"?renderDashboard():active==="Products"?renderInventoryPanel(false):active==="Purchases"?renderPurchases():active==="Sales & invoices"?renderSales():active==="Customers"?renderCustomers():active==="Vendors"?renderVendors():active==="Reports"?renderReports():active==="Project team"?renderTeam():active==="Audit log"?renderAudit():renderSettings();

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen?"open":""}`}><div className="brand"><div className="brand-mark"><Stethoscope size={20}/></div><div><strong>MediStock</strong><span>Operations</span></div><button className="sidebar-close" aria-label="Close navigation" onClick={()=>setSidebarOpen(false)}><X size={20}/></button></div>
      <nav aria-label="Main navigation"><p className="nav-label">Workspace</p>{navItems.map(([label,Icon])=><button key={label} className={active===label?"nav-item active":"nav-item"} onClick={()=>{setActive(label);setSidebarOpen(false)}}><Icon size={18}/><span>{label}</span>{label==="Products"&&lowStock.length>0?<em>{lowStock.length}</em>:null}</button>)}<p className="nav-label nav-label-second">Manage</p><button className={active==="Audit log"?"nav-item active":"nav-item"} onClick={()=>{setActive("Audit log");setSidebarOpen(false)}}><ClipboardCheck size={18}/><span>Audit log</span></button><button className={active==="Settings"?"nav-item active":"nav-item"} onClick={()=>{setActive("Settings");setSidebarOpen(false)}}><Settings size={18}/><span>Settings</span></button></nav>
      <div className="sidebar-foot"><div className="health"><span className="health-dot"/><div><strong>System healthy</strong><small>Local persistence enabled</small></div></div><div className="profile"><div className="avatar">MS</div><div><strong>{companyName}</strong><small>Currency: NPR</small></div><ChevronDown size={16}/></div></div>
    </aside>
    <main className="main-content"><header className="topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={()=>setSidebarOpen(true)}><Menu size={21}/></button><div className="search-box"><Search size={18}/><input ref={searchRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, invoices, customers..." aria-label="Search records"/><kbd>Ctrl K</kbd></div><div className="top-actions"><span className="currency-chip">NPR</span><button className="icon-button notification" aria-label="View stock notifications" onClick={()=>{setActive("Products");setNotice(`${lowStock.length} product(s) currently need stock attention`)}}><Bell size={19}/>{lowStock.length>0&&<span/>}</button><button className="help-button" onClick={()=>setNotice("Tip: use Ctrl+K to search, and export CSV reports from Reports.")}><CircleHelp size={18}/> Help</button></div></header>
      <div className="page-wrap"><section className="page-heading"><div><p className="eyebrow">{companyName} · Nepal</p><h1>{active}</h1><p>{pageDescription[active]}</p></div><div className="heading-actions">{!(["Customers","Vendors","Project team","Audit log","Settings"].includes(active))&&<button className="btn secondary" onClick={()=>setPurchaseOpen(true)}><Truck size={17}/> Receive stock</button>}{!(["Project team","Audit log","Settings"].includes(active))&&<button className="btn primary" onClick={()=>setSaleOpen(true)}><Plus size={17}/> New sale</button>}</div></section>
        <div className={`status-strip ${notice.includes("blocked")||notice.includes("not added")?"warning":""}`}><ShieldCheck size={17}/><span>{notice}</span><button onClick={()=>setNotice("All systems operational · Data is saved in this browser")}>Dismiss</button></div>
        {content}
        <footer><span><ShieldCheck size={15}/> NPR currency · Batch traceability · Local audit trail</span><span>Built for CSE 220 · Production-ready architecture includes Express + MySQL integration</span></footer>
      </div>
    </main>

    {saleOpen&&<div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-label="Record a new sale"><div className="modal-head"><div className="modal-icon"><ShoppingCart size={21}/></div><div><h2>Record a new sale</h2><p>Create an invoice in NPR and update stock automatically.</p></div><button className="icon-button" aria-label="Close sale modal" onClick={()=>setSaleOpen(false)}><X size={19}/></button></div><form onSubmit={recordSale}><label>Customer<select name="customer" defaultValue={customers[0].name}>{customers.map(c=><option key={c.code}>{c.name}</option>)}</select></label><label>Product<select name="product" defaultValue={products[0]?.id}>{products.map(product=><option value={product.id} key={product.id}>{product.name} · {money(product.unitPrice,2)} ({product.stock} available)</option>)}</select></label><div className="form-row"><label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required/></label><label>Payment status<select name="status" defaultValue="Paid"><option>Paid</option><option>Due</option></select></label></div><label>Customer PO / reference<input name="reference" placeholder="Optional reference"/></label><div className="modal-note"><Clock3 size={16}/> Invoice, stock movement, and audit record are created together.</div><div className="modal-actions"><button type="button" className="btn secondary" onClick={()=>setSaleOpen(false)}>Cancel</button><button type="submit" className="btn primary">Create invoice</button></div></form></div></div>}

    {purchaseOpen&&<div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-label="Receive stock"><div className="modal-head"><div className="modal-icon"><Truck size={21}/></div><div><h2>Receive a purchase</h2><p>Add received quantities and record supplier cost in NPR.</p></div><button className="icon-button" aria-label="Close purchase modal" onClick={()=>setPurchaseOpen(false)}><X size={19}/></button></div><form onSubmit={recordPurchase}><label>Vendor<select name="vendor" defaultValue={vendors[0].name}>{vendors.map(v=><option key={v.code}>{v.name}</option>)}</select></label><label>Product<select name="product" defaultValue={products[0]?.id}>{products.map(product=><option value={product.id} key={product.id}>{product.name} ({product.stock} in stock)</option>)}</select></label><div className="form-row"><label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required/></label><label>Unit cost (NPR)<input name="unitCost" type="number" min="0" step="0.01" defaultValue="10" required/></label></div><label>Supplier invoice / reference<input name="reference" placeholder="e.g. SUP-2026-184" required/></label><div className="modal-note"><Clock3 size={16}/> Received stock is added immediately and the purchase remains traceable.</div><div className="modal-actions"><button type="button" className="btn secondary" onClick={()=>setPurchaseOpen(false)}>Cancel</button><button type="submit" className="btn primary">Receive stock</button></div></form></div></div>}

    {productOpen&&<div className="modal-backdrop" role="presentation"><div className="modal wide" role="dialog" aria-modal="true" aria-label="Add product"><div className="modal-head"><div className="modal-icon"><Package2 size={21}/></div><div><h2>Add product & opening batch</h2><p>Create a stock item with NPR selling price and reorder controls.</p></div><button className="icon-button" aria-label="Close product modal" onClick={()=>setProductOpen(false)}><X size={19}/></button></div><form onSubmit={addProduct}><div className="form-row"><label>SKU<input name="sku" placeholder="MED-006" required/></label><label>Product name<input name="name" placeholder="Paracetamol 500mg" required/></label></div><div className="form-row"><label>Category<input name="category" placeholder="Analgesics" required/></label><label>Manufacturer<input name="manufacturer" placeholder="Manufacturer" required/></label></div><div className="form-row"><label>Batch number<input name="batch" placeholder="PCM-2608" required/></label><label>Expiry date<input name="expiry" type="date" required/></label></div><div className="form-row three"><label>Opening stock<input name="stock" type="number" min="0" defaultValue="0" required/></label><label>Reorder level<input name="reorderAt" type="number" min="0" defaultValue="10" required/></label><label>Selling price (NPR)<input name="unitPrice" type="number" min="0" step="0.01" defaultValue="0" required/></label></div><div className="modal-actions"><button type="button" className="btn secondary" onClick={()=>setProductOpen(false)}>Cancel</button><button type="submit" className="btn primary">Add product</button></div></form></div></div>}

    {sidebarOpen&&<button className="sidebar-scrim" aria-label="Close menu" onClick={()=>setSidebarOpen(false)}/>}</div>;
}
