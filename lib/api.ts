const API_URL=process.env.NEXT_PUBLIC_API_URL;
export const hasLiveApi=Boolean(API_URL);
async function request<T>(path:string,options?:RequestInit):Promise<T>{
  if(!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  const response=await fetch(`${API_URL}${path}`,{...options,headers:{"Content-Type":"application/json",...options?.headers}});
  if(!response.ok) throw new Error((await response.json().catch(()=>null))?.error||`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}
export const api={products:(search="")=>request(`/api/products?search=${encodeURIComponent(search)}`),dashboard:()=>request("/api/dashboard"),createSale:(payload:unknown)=>request("/api/sales",{method:"POST",body:JSON.stringify(payload)}),receivePurchase:(payload:unknown)=>request("/api/purchases",{method:"POST",body:JSON.stringify(payload)})};
