import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const businesses = JSON.parse(localStorage.getItem("businesses") || "[]");
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");

    const totalBusinesses = Array.isArray(businesses) ? businesses.length : 0;
    const totalProducts = Array.isArray(products)
      ? products.filter((p) => p.approved === true).length
      : 0;
    const pendingProducts = Array.isArray(products)
      ? products.filter((p) => p.approved === false).length
      : 0;
    const totalComplaints = Array.isArray(complaints) ? complaints.length : 0;

    setStats({
      totalBusinesses,
      totalProducts,
      pendingProducts,
      totalComplaints,
    });
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Yükleniyor...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Çıkış butonu */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          onClick={() => {
            localStorage.removeItem("admin_logged_in");
            window.location.href = "/admin/login";
          }}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 5,
            padding: "8px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Çıkış Yap
        </button>
      </div>
      <h2>Yönetici Paneli Ana Sayfa</h2>
      <p className="desc">
        Yöneticinin sistemin genel özetini görebildiği kontrol paneli.
      </p>

      <div className="welcome">
        <h3>Hoş geldin, Yönetici</h3>
        <p>Sisteme genel bakış</p>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-label">Toplam Kayıtlı Esnaf</div>
          <div className="stat-value">{stats.totalBusinesses}</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Yayındaki Ürün</div>
          <div className="stat-value">{stats.totalProducts}</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Onay Bekleyen Ürün</div>
          <div className="stat-value">{stats.pendingProducts}</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Şikayet Edilen Ürün</div>
          <div className="stat-value">{stats.totalComplaints}</div>
        </div>
      </div>

      <div className="shortcuts-row">
       <button className="shortcut-btn" onClick={() => navigate("/admin/urun-onayi")}>
  <span className="shortcut-icon">📝</span>
  <span>Ürün Onayı</span>
</button>
<button className="shortcut-btn" onClick={() => navigate("/admin/sikayetler")}>
  <span className="shortcut-icon">⚠️</span>
  <span>Şikayet Bildirimleri</span>
</button>
<button className="shortcut-btn" onClick={() => navigate("/admin/isletmeler")}>
  <span className="shortcut-icon">🏠</span>
  <span>Kayıtlı Esnaflar</span>
</button>
<button className="shortcut-btn" onClick={() => navigate("/admin/ayarlar")}>
  <span className="shortcut-icon">⚙️</span>
  <span>Ayarlar</span>
</button>

      </div>

      <div className="last-ops">
        <div>
          Son onaylanan ürün: <b>Tornavida</b>
        </div>
        <div>
          Son şikayet edilen ürün: <b>Matkap</b>
        </div>
      </div>
    </div>
  );
}
