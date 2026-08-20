import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(){
  const workerUrl=new URL("../dist/server/index.js",import.meta.url);
  workerUrl.searchParams.set("test",`${process.pid}-${Date.now()}`);
  const {default:worker}=await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/",{headers:{accept:"text/html"}}),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
}

test("server-renders the MediStock operations dashboard",async()=>{
  const response=await render();
  assert.equal(response.status,200);
  assert.match(response.headers.get("content-type")??"",/^text\/html\b/i);
  const html=await response.text();
  assert.match(html,/<title>MediStock Operations<\/title>/i);
  assert.match(html,/Sales performance/);
  assert.match(html,/Inventory overview/);
  assert.match(html,/New sale/);
  assert.match(html,/Himanshu Shrestha/);
  assert.match(html,/Surya Malla/);
  assert.match(html,/Sandesh/);
  assert.match(html,/Gopal/);
  assert.doesNotMatch(html,/codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("ships the required workflows and extension assets",async()=>{
  const [page,styles,schema,requirements,testPlan]=await Promise.all([
    readFile(new URL("../app/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/globals.css",import.meta.url),"utf8"),
    readFile(new URL("../server/sql/schema.sql",import.meta.url),"utf8"),
    readFile(new URL("../requirements/requirements.md",import.meta.url),"utf8"),
    readFile(new URL("../testing/test-plan.md",import.meta.url),"utf8"),
  ]);
  assert.match(page,/recordSale/);
  assert.match(page,/recordPurchase/);
  assert.match(page,/aria-label="Search records"/);
  assert.match(styles,/@media\(max-width:560px\)/);
  assert.match(styles,/content:attr\(data-label\)/);
  assert.match(schema,/CREATE TABLE inventory_transactions/);
  assert.match(schema,/CREATE TABLE audit_logs/);
  assert.match(requirements,/FR-12/);
  assert.match(testPlan,/Integration tests/);
});
