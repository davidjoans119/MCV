"use client";
import { useCallback,useEffect,useState } from "react";
import { ModuleShell } from "@/components/module-shell";
import { getSupabase } from "@/lib/supabase";

type Order={id:string;order_number:number;order_type:string;status:string;notes:string|null;created_at:string};
type Line={id:string;order_id:string;item_name:string;quantity:number;line_total:number};
type Ticket=Order&{items:Line[]};
const stages=[{key:"placed",label:"New orders"},{key:"preparing",label:"Preparing"},{key:"ready",label:"Ready for pickup"}];
export default function KitchenPage(){
 const [tickets,setTickets]=useState<Ticket[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState("");
 const [lastUpdated,setLastUpdated]=useState<Date|null>(null);
 const load=useCallback(async()=>{
  try{
   const sb=getSupabase();
   const {data:{user}}=await sb.auth.getUser();
   if(!user)throw new Error("Please log in first.");
   const {data:m,error:me}=await sb.from("organization_members").select("organization_id").eq("user_id",user.id).eq("status","active").maybeSingle();
   if(me)throw me;if(!m)throw new Error("Restaurant workspace not found.");
   const {data:orders,error:oe}=await sb.from("restaurant_orders").select("id,order_number,order_type,status,notes,created_at").eq("organization_id",m.organization_id).in("status",["placed","preparing","ready"]).order("created_at",{ascending:true}).limit(100);
   if(oe)throw oe;
   const ids=(orders??[]).map(o=>o.id);
   let lines:Line[]=[];
   if(ids.length){const {data,error:ie}=await sb.from("restaurant_order_items").select("id,order_id,item_name,quantity,line_total").in("order_id",ids);if(ie)throw ie;lines=(data??[]) as Line[];}
   setTickets((orders??[]).map(o=>({...o,items:lines.filter(x=>x.order_id===o.id)})) as Ticket[]);
   setLastUpdated(new Date());setError("");
  }catch(e){setError(e instanceof Error?e.message:"Could not load kitchen orders.");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{load();const timer=window.setInterval(load,10000);return()=>window.clearInterval(timer);},[load]);
 async function advance(t:Ticket){
  const next=t.status==="placed"?"preparing":t.status==="preparing"?"ready":"completed";
  setBusy(t.id);setError("");
  const {error}=await getSupabase().from("restaurant_orders").update({status:next}).eq("id",t.id);
  if(error)setError(error.message);else await load();
  setBusy(""); 
 }
 return <ModuleShell title="Kitchen Display System" subtitle="Track incoming tickets and move each order through preparation. Orders refresh automatically every 10 seconds.">
  <div className="kds-toolbar"><div><b>Kitchen board</b><span>{tickets.length} active ticket{tickets.length===1?"":"s"}</span></div><div><small>{lastUpdated?`Updated ${lastUpdated.toLocaleTimeString("en-IN")}`:"Waiting for first refresh"}</small><button className="btn btn-light" onClick={load}>Refresh</button></div></div>
  {error&&<div className="notice error">{error}</div>}
  {loading?<div className="panel">Loading kitchen tickets…</div>:<div className="kds-board">{stages.map(stage=>{const group=tickets.filter(t=>t.status===stage.key);return <section className="kds-column" key={stage.key}><header><h2>{stage.label}</h2><span>{group.length}</span></header>{group.length===0?<div className="kds-empty">No orders</div>:group.map(t=><article className="kds-ticket" key={t.id}><div className="ticket-top"><b>#{t.order_number}</b><time>{new Date(t.created_at).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</time></div><span className="ticket-type">{t.order_type.replace("_"," ")}</span><div className="ticket-lines">{t.items.map(line=><div key={line.id}><b>{line.quantity} ×</b><span>{line.item_name}</span></div>)}</div>{t.notes&&<p className="ticket-note">Note: {t.notes}</p>}<button className="btn btn-primary full" disabled={busy===t.id} onClick={()=>advance(t)}>{busy===t.id?"Updating…":t.status==="placed"?"Start preparing":t.status==="preparing"?"Mark ready":"Complete order"}</button></article>)}</section>})}</div>}
  <style jsx>{`
   .kds-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px}.kds-toolbar>div{display:flex;align-items:center;gap:12px}.kds-toolbar b{font-size:14px}.kds-toolbar span,.kds-toolbar small{font-size:10px;color:var(--muted)}.kds-toolbar .btn{padding:8px 12px;font-size:11px}
   .kds-board{display:grid;grid-template-columns:repeat(3,minmax(230px,1fr));gap:13px;align-items:start;overflow-x:auto}.kds-column{background:#f4f7f5;border:1px solid var(--line);border-radius:14px;padding:12px;min-height:250px}.kds-column>header{display:flex;justify-content:space-between;align-items:center;padding:4px 3px 12px}.kds-column h2{font-size:13px;margin:0}.kds-column>header span{background:#e7eee9;border-radius:99px;padding:4px 8px;font-size:10px;font-weight:700}.kds-empty{background:#fff;border:1px dashed #dce5df;border-radius:10px;text-align:center;padding:28px 8px;color:var(--muted);font-size:11px}
   .kds-ticket{background:#fff;border:1px solid var(--line);border-radius:12px;padding:13px;margin-bottom:10px;box-shadow:0 2px 8px #17211d08}.ticket-top{display:flex;justify-content:space-between;align-items:center}.ticket-top b{font-size:18px}.ticket-top time{font-size:10px;color:var(--muted)}.ticket-type{display:inline-block;margin-top:7px;padding:4px 7px;border-radius:6px;background:#eff6f1;color:var(--green);font-size:9px;text-transform:capitalize}.ticket-lines{margin:12px 0}.ticket-lines>div{display:flex;gap:9px;padding:6px 0;border-bottom:1px solid #f0f2f0;font-size:12px}.ticket-lines b{min-width:25px}.ticket-note{font-size:10px;background:#fff8e8;padding:8px;border-radius:7px;color:#795b20}.kds-ticket .btn{font-size:11px;padding:10px}
   @media(max-width:800px){.kds-board{grid-template-columns:repeat(3,minmax(250px,1fr))}.kds-toolbar{align-items:flex-start}.kds-toolbar>div{flex-wrap:wrap}}
  `}</style>
 </ModuleShell>;
}
