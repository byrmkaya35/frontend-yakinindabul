import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const BusinessRegisterModal = ({ open, onClose, onLoginClick }) => {
  const [form, setForm] = useState({
    storeName: "",
    fullname: "",
    email: "",
    phone: "",
    password: "",
    passwordRepeat: "",
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isPasswordStrong = (pw) =>
    pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !form.storeName ||
      !form.fullname ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.passwordRepeat
    ) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    if (!form.agree) {
      setError("Kullanıcı sözleşmesini kabul etmelisiniz.");
      return;
    }
    if (!isPasswordStrong(form.password)) {
      setError("Şifre en az 8 karakter, bir büyük harf ve bir rakam içermelidir.");
      return;
    }
    if (form.password !== form.passwordRepeat) {
      setError("Şifreler aynı olmalı!");
      return;
    }
    // KAYIT API İSTEĞİ
    try {
      const res = await axios.post(`${API_URL}/api/auth/business-register`, {
        business_code: form.storeName,
        business_name: form.storeName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      if (res.data.business) {
        alert("Kayıt başarılı! Artık giriş yapabilirsiniz.");
        onClose();
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
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center">İşletme Kaydı</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="storeName"
            placeholder="İşletme Adı"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-3 focus:outline-none focus:border-blue-400"
            value={form.storeName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fullname"
            placeholder="Ad Soyad"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-3 focus:outline-none focus:border-blue-400"
            value={form.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-3 focus:outline-none focus:border-blue-400"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Telefon"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg mb-3 focus:outline-none focus:border-blue-400"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Şifre"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg pr-12 focus:outline-none focus:border-blue-400"
              value={form.password}
              onChange={handleChange}
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
          <div className="relative mb-3">
            <input
              type={showRepeatPassword ? "text" : "password"}
              name="passwordRepeat"
              placeholder="Şifre (Tekrar)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg pr-12 focus:outline-none focus:border-blue-400"
              value={form.passwordRepeat}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={() => setShowRepeatPassword((v) => !v)}
              tabIndex={-1}
            >
              {showRepeatPassword ? (
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
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label htmlFor="agree" className="text-gray-700 text-base">
              <a href="/kullanicisozlesmesi.pdf" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                Kullanıcı sözleşmesini okudum, onaylıyorum.
              </a>
            </label>
          </div>
          {error && (
            <div className="text-red-600 text-base text-center mb-3">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#2196F3] hover:bg-blue-600 text-white rounded-lg py-3 text-lg font-bold transition mb-2"
          >
            Kayıt Ol
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600 text-base">
          Zaten hesabınız var mı?{" "}
          <button
            type="button"
            className="font-bold text-gray-900 hover:underline"
            onClick={onLoginClick}
          >
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegisterModal;
