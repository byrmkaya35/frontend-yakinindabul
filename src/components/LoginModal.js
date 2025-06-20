import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const LoginModal = ({ open, onClose, userType, onRegisterClick, onLoginSuccess }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  if (!open) return null;

  // Giriş işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        emailOrPhone,
        password
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      if (onLoginSuccess) onLoginSuccess(res.data.user);
      setEmailOrPhone("");
      setPassword("");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Bir hata oluştu, tekrar deneyin."
      );
    }
  };

  // Şifremi Unuttum işlemi (Backend'de endpoint yoksa çalışmaz!)
  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    if (!forgotEmail) return setForgotMessage("E-posta alanı boş olamaz.");
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: forgotEmail
      });
      setForgotMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
      setForgotEmail("");
    } catch (err) {
      setForgotMessage(
        err.response?.data?.message || "Bir hata oluştu, tekrar deneyin."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative">
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {userType === "kullanici" ? "Kullanıcı Girişi" : "İşletme Paneli Girişi"}
        </h2>
        {forgotMode ? (
          <form onSubmit={handleForgot} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="E-posta adresinizi girin"
              className="border rounded px-4 py-2"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            {forgotMessage && (
              <div className={`text-sm text-center ${forgotMessage.includes("gönderildi") ? "text-green-600" : "text-red-500"}`}>
                {forgotMessage}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 font-semibold"
            >
              Şifre Sıfırlama Linki Gönder
            </button>
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => setForgotMode(false)}
            >
              Geri Dön
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="E-posta veya Telefon"
              className="border rounded px-4 py-2"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Şifre"
                className="border rounded px-4 py-2 w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-2.5"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                <img
                  src={showPassword ? "/eye-open.svg" : "/eye-closed.svg"}
                  alt="Şifreyi Göster/Gizle"
                  className="h-6 w-6 opacity-70"
                />
              </button>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 font-semibold mt-2"
            >
              Giriş Yap
            </button>
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => setForgotMode(true)}
            >
              Şifremi Unuttum
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          Hesabınız yok mu?{" "}
          <button
            className="text-blue-600 hover:underline font-medium"
            onClick={onRegisterClick}
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
