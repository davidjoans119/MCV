"use client";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export function OnboardingForm(){
 const [name,setName]=useState("");const [outlet,setOutlet]=useState("");const [city,setCity]=useState("");
 const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [email,setEmail]=useState("");
 const router=useRouter();
 useEffect(()=>{getSupabase().auth.getUser().then(({data})=>{if(!data.user){router.replace("/login");return;}setEmail(data.user.email??"");});},[router]);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");
  try{const supabase=getSupabase();const {data,error}=await supabase.rpc("create_restaurant_workspace",{p_org_name:name,p_location_name:outlet,p_city:city||null});if(error)throw error;router.push("/dashboard");}
  catch(err){setError(err instanceof Error?err.message:"Could not create workspace.");}
  finally{setBusy(false);}
 }
 return <main className="auth-wrap"><section className="auth-card" style={{width:"min(560px,100%)"}}><span className="eyebrow">First-time setup</span><h1 style={{marginTop:18}}>Set up your restaurant</h1><p className="muted">Tell us a little about your business. You can add more outlets and team members later.</p><div className="notice">Signed in as {email||"checking account…"}</div>
 <form onSubmit={submit}><div className="field"><label>Restaurant / business name</label><input required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. The Green Table"/></div><div className="field"><label>First outlet name</label><input required minLength={2} maxLength={80} value={outlet} onChange={e=>setOutlet(e.target.value)} placeholder="e.g. Park Street Outlet"/></div><div className="field"><label>City (optional)</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="e.g. Kolkata"/></div>{error&&<div className="notice error">{error}</div>}<button className="btn btn-primary full" disabled={busy}>{busy?"Creating workspace…":"Create restaurant workspace"}</button></form></section></main>;
}
