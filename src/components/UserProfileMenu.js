import React, { useState, useRef, useEffect } from "react";

export default function UserProfileMenu({ userName, onLogout, onFavorites, onSettings, onNotifications }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setConfirmOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Çıkışa tıklayınca, onay penceresi açılır
  const handleLogoutClick = () => setConfirmOpen(true);

  // Onay kutusunda evet tıklanırsa gerçek çıkış
  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    setOpen(false);
    onLogout && onLogout();
  };

  // Onay kutusunda hayır tıklanırsa sadece kapat
  const handleCancelLogout = () => setConfirmOpen(false);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        className="flex items-center gap-2 bg-white rounded-full border px-3 py-1 hover:shadow transition"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-blue-700">{userName}</span>
        <img src="/profile.svg" alt="Profil" className="w-7 h-7 rounded-full border" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          {/* Bildirimler */}
          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => { setOpen(false); onNotifications && onNotifications(); }}
          >
            <img src="/bell.svg" alt="Bildirimler" className="w-5 h-5" />
            <span>Bildirimler</span>
          </button>
          {/* Favorilerim */}
          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => { setOpen(false); onFavorites && onFavorites(); }}
          >
            <img src="/star.svg" alt="Favorilerim" className="w-5 h-5" />
            <span>Favorilerim</span>
          </button>
          {/* Ayarlar */}
          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => { setOpen(false); onSettings && onSettings(); }}
          >
            <img src="/settings.svg" alt="Ayarlar" className="w-5 h-5" />
            <span>Ayarlar</span>
          </button>
          {/* Çıkış Yap */}
          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            onClick={handleLogoutClick}
          >
            <img src="/logout.svg" alt="Çıkış Yap" className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}

      {/* Çıkış Onay Kutusu */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4 min-w-[300px]">
            <span className="text-lg font-medium text-gray-800">Çıkış yapmak istiyor musunuz?</span>
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                Hayır
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Evet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
