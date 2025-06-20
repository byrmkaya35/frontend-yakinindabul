import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function BusinessLoginModal({ open, onClose, onRegisterClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/business-login`, {
        email,
        password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("business", JSON.stringify(res.data.business));
        localStorage.setItem("businessId", res.data.business.id); // EKLENDİ
        onClose();
        // navigate("/business-panel");  // <-- BUNU YORUM SATIRI YAP
        window.location.href = "/business-panel"; // <-- YENİ SATIR
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Bir hata oluştu, tekrar deneyin."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h2 className="text-3xl font-bold mb-4 text-center">İşletme Girişi</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-4 focus:outline-none focus:border-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Şifre"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg pr-12 focus:outline-none focus:border-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="h-6 w-6 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg className="h-6 w-6 opacity-70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.97 10.97 0 0 1 12 20c-7 0-11-8-11-8a21.29 21.29 0 0 1 5.17-6.17"/>
                  <path d="m1 1 22 22"/>
                </svg>
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-600 text-base text-center mb-3">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#2196F3] hover:bg-blue-600 text-white rounded-lg py-3 text-lg font-bold transition mb-2"
          >
            Giriş Yap
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600 text-base">
          Hesabınız yok mu?{" "}
          <button
            type="button"
            className="font-bold text-gray-900 hover:underline"
            onClick={onRegisterClick}
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  );
}
