import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function RegisterModal({ open, onClose, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handlePhoneChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "");
    setPhone(onlyNums);
  };

  function isPasswordStrong(pass) {
    return (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[0-9]/.test(pass)
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !password || !passwordAgain) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    if (!isPasswordStrong(password)) {
      setError("Şifre en az 8 karakter, bir büyük harf ve bir rakam içermelidir.");
      return;
    }
    if (password !== passwordAgain) {
      setError("Şifreler aynı olmalı!");
      return;
    }

    setLoading(true);
    const registerPayload = {
      fullName: name,
      email,
      phone,
      password,
    };

    try {
      await axios.post(`${API_URL}/api/auth/register`, registerPayload);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setPasswordAgain("");
      setError("");
      setLoading(false);
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      onClose();
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        <h2 className="text-3xl font-bold mb-4 text-center">Kullanıcı Paneli Kayıt</h2>
        <div className="flex justify-center mb-4">
          <img src="./yakınındabul-logo.png" alt="Logo" className="h-8" />
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Ad Soyad"
            className="w-full border border-gray-300 rounded-lg px-4 py-4 text-lg mb-4 focus:outline-none focus:border-blue-400"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input type="email" placeholder="E-posta"
            className="w-full border border-gray-300 rounded-lg px-4 py-4 text-lg mb-4 focus:outline-none focus:border-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Telefon"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={15}
            className="w-full border border-gray-300 rounded-lg px-4 py-4 text-lg mb-4 focus:outline-none focus:border-blue-400"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Şifre"
              className="w-full border border-gray-300 rounded-lg px-4 py-4 text-lg focus:outline-none focus:border-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              <img
                src={showPassword ? "/eye-open.svg" : "/eye-closed.svg"}
                alt="Şifreyi Göster/Gizle"
                className="h-6 w-6 opacity-70"
              />
            </button>
          </div>
          <div className="relative mb-6">
            <input
              type={showPasswordAgain ? "text" : "password"}
              placeholder="Şifre Tekrar"
              className="w-full border border-gray-300 rounded-lg px-4 py-4 text-lg focus:outline-none focus:border-blue-400"
              value={passwordAgain}
              onChange={e => setPasswordAgain(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={() => setShowPasswordAgain(v => !v)}
              tabIndex={-1}
            >
              <img
                src={showPasswordAgain ? "/eye-open.svg" : "/eye-closed.svg"}
                alt="Şifreyi Göster/Gizle"
                className="h-6 w-6 opacity-70"
              />
            </button>
          </div>
          {error && (
            <div className="text-red-600 text-base text-center mb-3">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#2196F3] hover:bg-blue-600 text-white rounded-lg py-4 text-xl font-bold transition mb-2"
            disabled={loading}
          >
            {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
          </button>
        </form>
        <div className="text-center mt-4 text-gray-600 text-base">
          Zaten hesabınız var mı?{" "}
          <button className="font-bold text-[#2196F3] hover:underline" onClick={onSwitchToLogin}>Giriş Yap</button>
        </div>
      </div>
    </div>
  );
}
