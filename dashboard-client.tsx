"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight, Bell, ChevronDown, CircleHelp, ClipboardList, CreditCard,
  LayoutDashboard, LogOut, Package, Settings, ShoppingBag, Store, Users,
  Utensils, BarChart3, CheckCircle2, Clock3
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type Outlet = { id: string; name: string; city: string | null };
type Workspace = { id: string; name: string };

const modules = [
  { title: "POS & Billing", desc: "Take counter orders and prepare bills", href: "/pos", icon: CreditCard, status: "UI preview" },
  { title: "Orders", desc: "View and manage restaurant orders", href: "/orders", icon: ClipboardList, status: "Coming next" },
  { title: "Menu", desc: "Manage items, categories and prices", href: "/menu", icon: Utensils, status: "Coming next" },
  { title: "Inventory", desc: "Track ingredients and stock", href: "/inventory", icon: Package, status: "Coming next" },
  { title: "Team & Staff", desc: "Manage staff and outlet access", href: "/staff", icon: Users, status: "Coming next" },
  { title: "Reports", desc: "Review sales and business insights", href: "/reports", icon: BarChart3, status: "Coming next" }
];

export function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const supabase = getSupabase();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) { router.replace("/login"); return; }
        if (!alive) return;
        setEmail(user.email ?? "");

        const { data: membership, error: memberError } = await supabase
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();
        if (memberError) throw memberError;
        if (!membership) { router.replace("/onboarding"); return; }

        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .select("id,name")
          .eq("id", membership.organization_id)
          .single();
        if (orgError) throw orgError;

        const { data: locations, error: locationError } = await supabase
          .from("locations")
          .select("id,name,city")
          .eq("organization_id", membership.organization_id)
          .order("created_at", { ascending: true });
        if (locationError) throw locationError;
        if (!alive) return;
        setWorkspace(org);
        setOutlets(locations ?? []);
        setSelectedOutlet(locations?.[0]?.id ?? "");
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : "Could not load your workspace.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [router]);

  const currentOutlet = useMemo(() => outlets.find(x => x.id === selectedOutlet), [outlets, selectedOutlet]);

  async function logout() {
    await getSupabase().auth.signOut();
    router.replace("/");
  }

  if (loading) return <main className="container dashboard"><div className="panel"><p className="muted">Loading your MCV-OS workspace…</p></div></main>;
  if (error) return <main className="container dashboard"><div className="panel"><div className="notice error">{error}</div><p className="muted">Check your Supabase connection, membership row and Row Level Security policies.</p><button className="btn btn-light" onClick={() => router.refresh()}>Try again</button></div></main>;

  return <div className="owner-layout">
    <aside className="owner-sidebar">
      <div className="sidebar-brand"><span className="brand-mark">M</span><span>MCV-OS</span></div>
      <div className="sidebar-label">WORKSPACE</div>
      <Link className="sidebar-link active" href="/dashboard"><LayoutDashboard size={17}/> Overview</Link>
      <div className="sidebar-label">OPERATIONS</div>
      {modules.map(item => { const Icon = item.icon; return <Link className="sidebar-link" href={item.href} key={item.title}><Icon size={17}/>{item.title}</Link>; })}
      <div className="sidebar-spacer"/>
      <Link className="sidebar-link" href="/settings"><Settings size={17}/> Settings</Link>
      <button className="sidebar-link sidebar-button" onClick={logout}><LogOut size={17}/> Log out</button>
      <div className="sidebar-user"><div className="avatar">{(email[0] ?? "O").toUpperCase()}</div><div className="sidebar-user-text"><b>{email || "Owner"}</b><span>Workspace account</span></div></div>
    </aside>

    <main className="owner-main">
      <header className="owner-topbar">
        <div className="mobile-brand"><span className="brand-mark">M</span><b>MCV-OS</b></div>
        <div className="topbar-right"><span className="online-pill"><i/> Workspace connected</span><button className="icon-button" aria-label="Help"><CircleHelp size={18}/></button><button className="icon-button" aria-label="Notifications"><Bell size={18}/></button></div>
      </header>

      <div className="owner-content">
        <div className="welcome-row">
          <div><div className="eyebrow">OWNER OVERVIEW</div><h1>Good to see you.</h1><p className="muted">Here&apos;s your restaurant workspace at a glance.</p></div>
          <Link className="btn btn-primary" href="/pos">Open POS <ArrowUpRight size={16}/></Link>
        </div>

        <section className="workspace-banner">
          <div className="workspace-icon"><Store size={22}/></div>
          <div className="workspace-info"><span>YOUR RESTAURANT</span><h2>{workspace?.name ?? "Restaurant workspace"}</h2><p>{currentOutlet ? `${currentOutlet.name}${currentOutlet.city ? ` · ${currentOutlet.city}` : ""}` : "No outlet found"}</p></div>
          {outlets.length > 1 && <label className="outlet-select"><span>Active outlet</span><select value={selectedOutlet} onChange={e=>setSelectedOutlet(e.target.value)}>{outlets.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select><ChevronDown size={14}/></label>}
        </section>

        <div className="section-heading"><div><h2>Today at a glance</h2><p className="muted">Live sales metrics will appear when POS and order processing are connected.</p></div></div>
        <section className="overview-stats">
          <article className="stat-card"><div className="stat-top"><span>Today&apos;s sales</span><CreditCard size={17}/></div><strong>—</strong><small>Available after billing goes live</small></article>
          <article className="stat-card"><div className="stat-top"><span>Orders today</span><ShoppingBag size={17}/></div><strong>—</strong><small>Available after orders go live</small></article>
          <article className="stat-card"><div className="stat-top"><span>Active outlets</span><Store size={17}/></div><strong>{outlets.length}</strong><small>Registered locations</small></article>
          <article className="stat-card"><div className="stat-top"><span>Team members</span><Users size={17}/></div><strong>—</strong><small>Staff management not connected</small></article>
        </section>

        <div className="section-heading"><div><h2>Restaurant operations</h2><p className="muted">Your modules, organized in one place.</p></div><Link href="/settings" className="text-link">Workspace settings <ArrowUpRight size={14}/></Link></div>
        <section className="module-grid">
          {modules.map(item=>{const Icon=item.icon;return <Link href={item.href} className="module-card" key={item.title}><div className="module-card-top"><div className="module-icon"><Icon size={19}/></div><ArrowUpRight size={16} className="module-arrow"/></div><h3>{item.title}</h3><p>{item.desc}</p><span className="module-status"><i/>{item.status}</span></Link>;})}
        </section>

        <section className="setup-panel">
          <div className="setup-icon"><CheckCircle2 size={20}/></div>
          <div className="setup-copy"><h3>Workspace foundation created</h3><p>Your restaurant and first outlet are registered. Next, connect your menu and billing workflows to start using MCV-OS operationally.</p></div>
          <span className="setup-complete"><CheckCircle2 size={14}/> Setup saved</span>
        </section>
        <footer className="owner-footer"><span>MCV-OS · Restaurant Management Operating System</span><span><Clock3 size={13}/> Dashboard foundation</span></footer>
      </div>
    </main>
  </div>;
}
