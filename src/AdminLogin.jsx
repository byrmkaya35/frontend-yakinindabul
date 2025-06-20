import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin35";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini önler

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_token", "true");
      navigate("/admin");
    } else {
      setError("Kullanıcı adı veya şifre hatalı");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fa",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 14,
          minWidth: 340,
          boxShadow: "0 4px 16px #0001",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 23, marginBottom: 16 }}>
          Yönetici Girişi
        </h2>
        <label style={{ marginBottom: 8, fontWeight: 500 }}>Kullanıcı Adı</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #eee",
            borderRadius: 6,
            marginBottom: 18,
            fontSize: 16,
          }}
        />
        <label style={{ marginBottom: 8, fontWeight: 500 }}>Şifre</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 8,
            border: "1px solid #eee",
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 16,
          }}
        />
        {error && (
          <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
        )}
        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "10px 0",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
