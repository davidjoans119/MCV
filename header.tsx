import Link from "next/link";
import { Brand } from "./brand";
export function Header() {
  return <header className="container nav"><Brand/><nav className="nav-links" style={{display:"flex",alignItems:"center",gap:12}}><Link className="btn btn-light" href="/login">Log in</Link><Link className="btn btn-primary" href="/signup">Create account</Link></nav></header>;
}
