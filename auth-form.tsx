"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

type Mode = "signup" | "login" | "forgot";
export function AuthForm({mode}:{mode:Mode}) {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState("");
  const router=useRouter();
  const title=mode==="signup"?"Create your MCV-OS account":mode==="login"?"Welcome back":"Reset your password";
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setError("");setMessage("");
    try{
      const supabase=getSupabase();
      if(mode==="signup"){
        const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name},emailRedirectTo:`${window.location.origin}/auth/callback`}});
        if(error) throw error;
        if(data.session) router.push("/onboarding");
        else setMessage("Account created. Check your email for the verification link, then log in.");
      } else if(mode==="login"){
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error) throw error;
        router.push("/onboarding");
      } else {
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});
        if(error) throw error;
        setMessage("If an account exists for this email, a password reset link has been sent.");
      }
    }catch(err){setError(err instanceof Error?err.message:"Something went wrong.");}
    finally{setBusy(false);}
  }
  return <main className="auth-wrap"><section className="auth-card"><span className="eyebrow">MCV-OS account</span><h1 style={{marginTop:18}}>{title}</h1><p className="muted">{mode==="signup"?"Create your account to set up your restaurant workspace.":mode==="login"?"Log in to continue to your restaurant workspace.":"Enter your account email to receive a reset link."}</p>
    <form onSubmit={submit}>
      {mode==="signup"&&<div className="field"><label>Full name</label><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name"/></div>}
      <div className="field"><label>Email address</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></div>
      {mode!=="forgot"&&<div className="field"><label>Password</label><input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode==="signup"?"new-password":"current-password"}/></div>}
      {error&&<div className="notice error">{error}</div>}{message&&<div className="notice">{message}</div>}
      <button className="btn btn-primary full" disabled={busy}>{busy?"Please wait…":mode==="signup"?"Create account":mode==="login"?"Log in":"Send reset link"}</button>
    </form>
    <div className="auth-links">{mode!=="login"?<Link href="/login">Already have an account? Log in</Link>:<Link href="/signup">Create account</Link>}{mode!=="forgot"&&<Link href="/forgot-password">Forgot password?</Link>}</div>
  </section></main>;
}
