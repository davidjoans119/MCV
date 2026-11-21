"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MapPin, Store, Building2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [outlet, setOutlet] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const supabase = getSupabase();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) { router.replace("/login"); return; }
        if (!alive) return;
        setEmail(user.email ?? "");
        const { data: membership, error: membershipError } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();
        if (membershipError) throw membershipError;
        if (membership) { router.replace("/dashboard"); return; }
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Could not verify your account.");
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => { alive = false; };
  }, [router]);

  async function createWorkspace() {
    setBusy(true); setError("");
    try {
      const supabase = getSupabase();
      const { error } = await supabase.rpc("create_restaurant_workspace", {
        p_org_name: name.trim(),
        p_location_name: outlet.trim(),
        p_city: city.trim() || null
      });
      if (error) throw error;
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Workspace creation failed.");
    } finally {
      setBusy(false);
    }
  }

  const canContinue = name.trim().length >= 2 && name.trim().length <= 100;
  const canCreate = outlet.trim().length >= 2 && outlet.trim().length <= 80;

  if (checking) return <main className="auth-wrap"><section className="auth-card"><p className="muted">Checking your account…</p></section></main>;

  return <main className="auth-wrap">
    <section className="auth-card onboarding-card">
      <div className="onboarding-brand"><span className="brand-mark">M</span><span>MCV-OS setup</span></div>
      <div className="progress-track"><span style={{ width: step === 1 ? "50%" : "100%" }} /></div>
      <div className="step-label">STEP {step} OF 2</div>
      {step === 1 ? <>
        <div className="onboard-icon"><Building2 size={22}/></div>
        <h1>Let&apos;s set up your restaurant.</h1>
        <p className="muted">Start with your business identity. You can update these details later.</p>
        <div className="field"><label>Restaurant / business name</label><input autoFocus required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. The Green Table"/></div>
        <div className="account-chip">Signed in as <strong>{email || "your account"}</strong></div>
        <button className="btn btn-primary full" disabled={!canContinue} onClick={()=>{setError("");setStep(2);}}>Continue <ArrowRight size={16}/></button>
      </> : <>
        <div className="onboard-icon"><Store size={22}/></div>
        <h1>Add your first outlet.</h1>
        <p className="muted">An outlet is a physical restaurant location. You can add more locations later.</p>
        <div className="field"><label>Outlet name</label><input autoFocus required minLength={2} maxLength={80} value={outlet} onChange={e=>setOutlet(e.target.value)} placeholder="e.g. Park Street Outlet"/></div>
        <div className="field"><label>City <span className="optional">(optional)</span></label><div className="input-with-icon"><MapPin size={16}/><input value={city} onChange={e=>setCity(e.target.value)} placeholder="e.g. Kolkata"/></div></div>
        {error && <div className="notice error">{error}</div>}
        <div className="wizard-actions"><button className="btn btn-light" onClick={()=>{setError("");setStep(1);}} disabled={busy}><ArrowLeft size={16}/> Back</button><button className="btn btn-primary" onClick={createWorkspace} disabled={!canCreate || busy}>{busy?"Creating…":<>Create workspace <Check size={16}/></>}</button></div>
      </>}
      {step===1 && error && <div className="notice error">{error}</div>}
      <p className="onboard-foot">Your workspace data is isolated from other restaurants.</p>
    </section>
  </main>;
}
