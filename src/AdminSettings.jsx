import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "user", label: "Kullanıcı / Yetki Ayarları" },
  { id: "security", label: "Güvenlik Ayarları" },
  { id: "notification", label: "Bildirim Ayarları" },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "16px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
        Yönetici Paneli Ayarlar
      </h2>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              margin: "0 8px",
              padding: "10px 24px",
              borderRadius: 8,
              border: activeTab === tab.id ? "2px solid #1d4ed8" : "1px solid #ccc",
              background: activeTab === tab.id ? "#2563eb" : "#f1f5f9",
              color: activeTab === tab.id ? "#fff" : "#1e293b",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{
        boxShadow: "0 4px 24px #0002",
        borderRadius: 16,
        padding: 28,
        background: "#fff"
      }}>
        {activeTab === "user" && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              Kullanıcı / Yetki Ayarları
            </h3>
            <ul>
              <li>Yönetici ekle / kaldır</li>
              <li>Yetki seviyelerini düzenle</li>
              <li>Mevcut yöneticileri görüntüle</li>
            </ul>
          </div>
        )}
        {activeTab === "security" && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              Güvenlik Ayarları
            </h3>
            <ul>
              <li>Şifre değiştir</li>
              <li>2 Adımlı doğrulama (2FA) aktif/pasif</li>
              <li>Hesap güvenlik geçmişi</li>
            </ul>
          </div>
        )}
        {activeTab === "notification" && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              Bildirim Ayarları
            </h3>
            <ul>
              <li>Email/SMS bildirimleri aç/kapat</li>
              <li>Panel içi bildirimleri yönet</li>
              <li>Bildirimi özelleştir</li>
            </ul>
          </div>
        )}
      </div>

      <button
        className="pa-back-btn"
        style={{ marginTop: 32 }}
        onClick={() => navigate("/admin")}
      >
        ← Yönetici Paneline Dön
      </button>
    </div>
  );
}