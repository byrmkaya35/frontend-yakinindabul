import React, { useState, useRef, useEffect } from "react";

export default function BusinessProfileMenu({
  businessName,
  onLogout,
  onSettings,
  onNotifications,
  onFavorites,
}) {
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef(null);

  // Menü dışında bir yere tıklanınca kapansın
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Çıkış butonuna tıklanınca onay penceresini aç
  const handleLogoutClick = () => {
    setOpen(false);
    setShowLogoutConfirm(true);
  };

  // Onay penceresinde evet'e basılırsa çıkış yap
  const handleLogoutApprove = () => {
    setShowLogoutConfirm(false);
    onLogout && onLogout();
  };

  // Onay penceresinde hayır'a basılırsa sadece pencereyi kapat
  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profil butonu */}
      <button
        className="flex items-center gap-2 border-2 border-black rounded-full px-4 py-1 bg-white hover:shadow transition"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-bold text-blue-700">{businessName}</span>
        <span className="bg-blue-600 rounded-full p-1">
          {/* Profil ikonu */}
          <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
            <circle cx="12" cy="9" r="4" />
            <path d="M4 20c0-4 16-4 16 0" stroke="white" strokeWidth="2" />
          </svg>
        </span>
      </button>
      {/* Açılır Menü */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg z-50 flex flex-col py-2">
          <button
            className="flex items-center gap-3 px-5 py-2 text-[#189ab4] hover:bg-gray-50 transition text-base"
            onClick={() => { setOpen(false); onNotifications && onNotifications(); }}
          >
            <img src="/bell.svg" alt="Bildirimler" className="w-5 h-5" />
            Bildirimler
          </button>
          <button
            className="flex items-center gap-3 px-5 py-2 text-[#189ab4] hover:bg-gray-50 transition text-base"
            onClick={() => { setOpen(false); onFavorites && onFavorites(); }}
          >
            <img src="/star.svg" alt="Favorilerim" className="w-5 h-5" />
            Favorilerim
          </button>
          <button
            className="flex items-center gap-3 px-5 py-2 text-[#189ab4] hover:bg-gray-50 transition text-base"
            onClick={() => { setOpen(false); onSettings && onSettings(); }}
          >
            <img src="/settings.svg" alt="Ayarlar" className="w-5 h-5" />
            Ayarlar
          </button>
          <button
            className="flex items-center gap-3 px-5 py-2 text-red-500 hover:bg-gray-50 transition text-base"
            onClick={handleLogoutClick}
          >
            <img src="/logout.svg" alt="Çıkış Yap" className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      )}

      {/* Çıkış Onay Penceresi */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl min-w-[320px] flex flex-col items-center">
            <div className="text-xl font-semibold mb-4 text-center">
              Çıkış yapmak istiyor musunuz?
            </div>
            <div className="flex gap-4 mt-2">
              <button
                onClick={handleLogoutApprove}
                className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
              >
                Evet
              </button>
              <button
                onClick={handleLogoutCancel}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Hayır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
