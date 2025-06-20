import React, { useState, useEffect } from "react";

export default function SettingsModal({ user, onSave, onPasswordChange, onClose }) {
  const [name, setName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState(""); // Başarı/hata mesajı için
  const [updatedUser, setUpdatedUser] = useState(user);

  useEffect(() => {
    setName(user?.full_name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setUpdatedUser(user);
  }, [user, onClose]);

  // Şifre alanları
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Göz ikonları için state
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Kullanıcı güncelleme fonksiyonu
  const handleUserSave = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          full_name: name,
          email,
          phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("BİLGİLERİNİZ BAŞARIYLA GÜNCELLENMİŞTİR");
        setUpdatedUser(data.user);
        if (onSave) onSave(data.user);
      } else {
        const data = await response.json();
        setMessage(data.message || "Bir hata oluştu.");
      }
    } catch (err) {
      setMessage("Sunucuya bağlanılamadı!");
    }
  };

  // Şifre güncelle fonksiyonu
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== repeatPassword) {
      setPasswordError("Yeni şifreler eşleşmiyor.");
      return;
    }
    setPasswordError("");
    try {
      const response = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordError("");
        setOldPassword("");
        setNewPassword("");
        setRepeatPassword("");
        setMessage("ŞİFRENİZ BAŞARIYLA GÜNCELLENDİ");
      } else {
        setPasswordError(data.message || "Bir hata oluştu!");
      }
    } catch (err) {
      setPasswordError("Sunucuya bağlanılamadı!");
    }
  };

  // Güncel kullanıcıyı gösterelim
  const displayUser = updatedUser || { full_name: name, email, phone };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Ayarlar</h2>

        {/* Diğer hata/uyarı mesajları üstte gösterilmeye devam */}
        {message && message !== "BİLGİLERİNİZ BAŞARIYLA GÜNCELLENMİŞTİR" && message !== "ŞİFRENİZ BAŞARIYLA GÜNCELLENDİ" && (
          <div
            className="mb-4 p-3 rounded-lg text-center text-sm font-bold"
            style={{
              background: "#FDE2E1",
              color: "#D14343",
              border: "1.5px solid #D14343",
            }}
          >
            {message}
          </div>
        )}

        {/* Kullanıcı Bilgileri */}
        <form onSubmit={handleUserSave}>
          <div className="mb-4">
            <div className="font-semibold mb-1">Kullanıcı Bilgileri</div>
            <div className="border rounded-lg overflow-hidden">
              <div className="p-3 border-b flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Ad Soyad</label>
                <input
                  type="text"
                  className="outline-none bg-transparent"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="p-3 border-b flex flex-col">
                <label className="text-gray-500 text-sm mb-1">E-posta</label>
                <input
                  type="email"
                  className="outline-none bg-transparent"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="p-3 flex flex-col">
                <label className="text-gray-500 text-sm mb-1">Telefon Numarası</label>
                <input
                  type="tel"
                  className="outline-none bg-transparent"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* Sade başarı mesajı burada */}
            {message === "BİLGİLERİNİZ BAŞARIYLA GÜNCELLENMİŞTİR" && (
              <div
                className="w-full text-center text-base font-bold mt-3 mb-1"
                style={{ color: "#23A6AE" }}
              >
                {message}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg mt-2"
            >
              Güncelle & Kaydet
            </button>
          </div>
        </form>

        {/* Şifreyi Güncelle */}
        <form onSubmit={handlePasswordChange}>
          <div className="font-semibold mb-1 mt-6">Şifreyi Güncelle</div>
          <div className="border rounded-lg overflow-hidden mb-1">
            {/* Eski Şifre */}
            <div className="p-3 border-b flex flex-col relative">
              <label className="text-gray-500 text-sm mb-1">Eski Şifre</label>
              <input
                type={showOldPassword ? "text" : "password"}
                className="outline-none bg-transparent pr-10"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8"
                tabIndex={-1}
                onClick={() => setShowOldPassword((v) => !v)}
              >
                <img
                  src={showOldPassword ? "/eye-open.svg" : "/eye-closed.svg"}
                  alt="Şifreyi Göster/Gizle"
                  className="h-5 w-5 opacity-70"
                />
              </button>
            </div>
            {/* Yeni Şifre */}
            <div className="p-3 border-b flex flex-col relative">
              <label className="text-gray-500 text-sm mb-1">Yeni Şifre</label>
              <input
                type={showNewPassword ? "text" : "password"}
                className="outline-none bg-transparent pr-10"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8"
                tabIndex={-1}
                onClick={() => setShowNewPassword((v) => !v)}
              >
                <img
                  src={showNewPassword ? "/eye-open.svg" : "/eye-closed.svg"}
                  alt="Şifreyi Göster/Gizle"
                  className="h-5 w-5 opacity-70"
                />
              </button>
            </div>
            {/* Yeni Şifre Tekrar */}
            <div className="p-3 flex flex-col relative">
              <label className="text-gray-500 text-sm mb-1">Yeni Şifre (Tekrar)</label>
              <input
                type={showRepeatPassword ? "text" : "password"}
                className="outline-none bg-transparent pr-10"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8"
                tabIndex={-1}
                onClick={() => setShowRepeatPassword((v) => !v)}
              >
                <img
                  src={showRepeatPassword ? "/eye-open.svg" : "/eye-closed.svg"}
                  alt="Şifreyi Göster/Gizle"
                  className="h-5 w-5 opacity-70"
                />
              </button>
            </div>
          </div>
          {/* Şifre güncelleme başarı mesajı */}
          {message === "ŞİFRENİZ BAŞARIYLA GÜNCELLENDİ" && (
            <div className="w-full text-center text-base font-bold mt-3 mb-1" style={{ color: "#23A6AE" }}>
              {message}
            </div>
          )}
          {passwordError && (
            <div className="text-red-500 text-sm mb-2">{passwordError}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
          >
            Şifreyi Güncelle
          </button>
        </form>
      </div>
    </div>
  );
}
