import { Link } from "react-router-dom";
export default function NotFoundPage(){return <section className="hata-kutusu"><h2>Sayfa bulunamadı</h2><p>Aradığınız sayfa mevcut değil.</p><Link className="button-link" to="/">Ana sayfaya dön</Link></section>;}
