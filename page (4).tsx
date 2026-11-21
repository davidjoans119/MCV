"use client";
import { useMemo,useState } from "react";
import { ModuleShell } from "@/components/module-shell";
const initial=[{id:1,name:"Masala Dosa",price:140,category:"Breakfast"},{id:2,name:"Paneer Sandwich",price:160,category:"Snacks"},{id:3,name:"Cold Coffee",price:120,category:"Beverages"},{id:4,name:"Veg Burger",price:130,category:"Snacks"},{id:5,name:"Margherita Pizza",price:240,category:"Mains"},{id:6,name:"French Fries",price:100,category:"Sides"}];
export default function POSPage(){
 const [cart,setCart]=useState<{id:number;name:string;price:number;qty:number}[]>([]);
 const [category,setCategory]=useState("All");const [notice,setNotice]=useState("");
 const cats=["All",...Array.from(new Set(initial.map(x=>x.category)))];
 const items=initial.filter(x=>category==="All"||x.category===category);
 const add=(p:typeof initial[number])=>setCart(old=>{const found=old.find(x=>x.id===p.id);return found?old.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...old,{...p,qty:1}]});
 const total=useMemo(()=>cart.reduce((s,x)=>s+x.price*x.qty,0),[cart]);
 return <ModuleShell title="POS & Billing" subtitle="A fast counter workflow for taking orders and preparing a bill. This is a UI preview with sample menu items.">
 <div className="pos-grid"><section className="panel"><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>{cats.map(c=><button key={c} className={`btn ${category===c?"btn-primary":"btn-light"}`} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="features" style={{gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",marginTop:0}}>{items.map(p=><button key={p.id} className="feature" style={{textAlign:"left",cursor:"pointer"}} onClick={()=>add(p)}><div className="feature-icon">＋</div><h3>{p.name}</h3><p>{p.category}</p><strong>₹{p.price}</strong></button>)}</div></section>
 <aside className="panel"><h2 style={{fontSize:22,marginTop:0}}>Current order</h2>{cart.length===0?<p className="muted">Select menu items to start an order.</p>:cart.map(x=><div className="preview-row" key={x.id}><span>{x.name} × {x.qty}</span><b>₹{x.price*x.qty}</b></div>)}<div style={{display:"flex",justifyContent:"space-between",padding:"18px 0",borderTop:"1px solid var(--line)",marginTop:12}}><b>Total</b><b>₹{total}</b></div><button className="btn btn-primary full" disabled={!cart.length} onClick={()=>{setNotice("Demo bill created. Connect order tables and payment workflow before live use.");setCart([])}}>Create bill</button>{notice&&<div className="notice">{notice}</div>}</aside></div>
 <style jsx>{`.pos-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(260px,.8fr);gap:18px}@media(max-width:760px){.pos-grid{grid-template-columns:1fr}}`}</style>
 </ModuleShell>;
}
