"use client";
import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export function DashboardClient(){
 const [loading,setLoading]=useState(true);const [email,setEmail]=useState("");const [org,setOrg]=useState("");const [outlet,setOutlet]=useState("");const [error,setError]=useState("");
 const router=useRouter();
 useEffect(()=>{(async()=>{try{const sb=getSupabase();const {data:{user}}=await sb.auth.getUser();if(!user){router.replace("/login");return;}setEmail(user.email??"");
 const {data:membership,error:mErr}=await sb.from("organization_members").select("organization_id").eq("user_id",user.id).eq("status","active").maybeSingle();if(mErr)throw mErr;
 if(!membership){router.replace("/onboarding");return;}
 const {data:o,error:oErr}=await sb.from("organizations").select("name").eq("id",membership.organization_id).single();if(oErr)throw oErr;setOrg(o.name);
 const {data:l,error:lErr}=await sb.from("locations").select("name").eq("organization_id",membership.organization_id).limit(1).maybeSingle();if(lErr)throw lErr;setOutlet(l?.name??"");
 }catch(e){setError(e instanceof Error?e.message:"Could not load workspace.");}finally{setLoading(false);}})();},[router]);
 async function logout(){await getSupabase().auth.signOut();router.push("/");}
 return <main className="container dashboard">{loading?<p className="muted">Loading your workspace…</p>:error?<div className="notice error">{error}</div>:<><div style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}><div><span className="eyebrow">Owner workspace</span><h1 style={{fontSize:38,letterSpacing:"-.05em",margin:"16px 0 6px"}}>Welcome to MCV-OS</h1><p className="muted">{email}</p></div><button className="btn btn-light" onClick={logout}>Log out</button></div>
 <section className="panel" style={{marginTop:28}}><small className="muted">YOUR RESTAURANT</small><h2 style={{fontSize:27,margin:"8px 0"}}>{org}</h2><p className="muted">First outlet: {outlet}</p><div className="notice">Your workspace is ready. Restaurant operations modules will be added in upcoming development phases.</div></section>
 <div className="features"><article className="feature"><div className="feature-icon">01</div><h3>Orders & billing</h3><p>Module planned for the next development phase.</p></article><article className="feature"><div className="feature-icon">02</div><h3>Menu management</h3><p>Manage menu items, categories and availability.</p></article><article className="feature"><div className="feature-icon">03</div><h3>Team & outlets</h3><p>Your workspace foundation is active.</p></article></div>
 </>}</main>;
}
