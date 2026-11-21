import Link from "next/link";
import { Header } from "@/components/header";

const features = [
  ["01","Orders & billing","Keep counter orders, bills and service flow organized in one place."],
  ["02","Restaurant operations","Build a shared workspace for your team and outlets."],
  ["03","Reports & insights","Bring key business information together as your system grows."]
];

export default function Home() {
  return <><Header/><main>
    <section className="container hero">
      <div><span className="eyebrow">Restaurant operations, one workspace</span>
        <h1>Run your restaurant with more clarity.</h1>
        <p>MCV-OS brings your restaurant workflows into one clean workspace — from your first outlet to a growing team.</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:28}}><Link className="btn btn-primary" href="/signup">Get started →</Link><Link className="btn btn-light" href="#features">Explore features</Link></div>
        <p style={{fontSize:12,marginTop:18}}>A focused operating system for modern restaurants.</p>
      </div>
      <div className="preview"><div className="preview-top"><span>Workspace overview</span><span><i className="dot"/> System preview</span></div>
        <div className="metric-grid"><div className="metric"><small>Today&apos;s orders</small><strong>—</strong></div><div className="metric"><small>Net sales</small><strong>₹ —</strong></div><div className="metric"><small>Active tables</small><strong>—</strong></div><div className="metric"><small>Open bills</small><strong>—</strong></div></div>
        <div className="preview-list"><b style={{fontSize:13}}>Your workspace</b><div className="preview-row"><span>Orders & billing</span><span>Coming next</span></div><div className="preview-row"><span>Menu management</span><span>Coming next</span></div><div className="preview-row"><span>Team & outlets</span><span>Foundation ready</span></div></div>
      </div>
    </section>
    <section className="section" id="features"><div className="container"><span className="eyebrow">Built to work together</span><h2>Everything starts with one workspace.</h2><p className="section-lead">Start with your restaurant identity and first outlet. Add operational modules as MCV-OS develops.</p>
      <div className="features">{features.map(([n,t,d])=><article className="feature" key={n}><div className="feature-icon">{n}</div><h3>{t}</h3><p>{d}</p></article>)}</div>
    </div></section>
    <section className="section"><div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:24,flexWrap:"wrap"}}><div><h2 style={{marginTop:0}}>Set up your workspace.</h2><p className="section-lead">Create your account and register your first restaurant outlet.</p></div><Link className="btn btn-primary" href="/signup">Create your account →</Link></div></section>
  </main><footer className="container footer"><span>© {new Date().getFullYear()} MCV-OS</span><span>Restaurant Management Operating System</span></footer></>;
}
