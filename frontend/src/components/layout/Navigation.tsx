import { NavLink } from "react-router-dom";
const menu = [{ to: "/", label: "Ana Sayfa", end: true }, { to: "/events", label: "Etkinlikler" }, { to: "/admin", label: "Yönetim" }, { to: "/login", label: "Giriş" }];
export default function Navigation() {
  return <nav className="menu" aria-label="Ana menü">{menu.map((item) => <NavLink key={item.to} to={item.to} end={item.end}>{item.label}</NavLink>)}</nav>;
}
