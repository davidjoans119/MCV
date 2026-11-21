import Link from "next/link";
import { Brand } from "./brand";
const links=[["/dashboard","Overview"],["/pos","POS & Billing"],["/orders","Orders"],["/menu","Menu"],["/inventory","Inventory"],["/staff","Staff"],["/reports","Reports"],["/settings","Settings"]];
export function AppNav(){return <header className="app-header"><div className="container nav"><Brand/><nav className="nav-links" style={{display:"flex",gap:7,flexWrap:"wrap"}}>{links.map(([href,label])=><Link key={href} href={href} className="btn btn-light" style={{padding:"9px 11px",fontSize:12}}>{label}</Link>)}</nav></div></header>}
