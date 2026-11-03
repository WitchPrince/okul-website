import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
export default function SiteLayout() {
  const location = useLocation();
  const title = location.pathname === "/" ? "Kampüs Etkinlikleri" : location.pathname.startsWith("/admin") ? "Etkinlik Yönetimi" : location.pathname === "/login" ? "Giriş Yap" : location.pathname === "/register" ? "Kayıt Ol" : location.pathname === "/forgot-password" ? "Şifremi Unuttum" : "Kampüs Etkinlikleri";
  return <><header className="site-baslik"><Header title={title} text="Fakültedeki etkinlikleri tek yerden takip edin." /><Navigation /></header><main><Outlet /></main><Footer /></>;
}
