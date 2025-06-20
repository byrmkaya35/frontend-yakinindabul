import React, { useState } from "react";
import BusinessProfileMenu from "./BusinessProfileMenu";
import logo from "../yakınındabul-logo.png";
import { Link } from "react-router-dom";

export default function BusinessPanelHeader({ businessName, onLogout, onSettings, onNotifications, onFavorites }) {
  const [productOpen, setProductOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  React.useEffect(() => {
    function handleClick() {
      setProductOpen(false);
      setServiceOpen(false);
    }
    if (productOpen || serviceOpen) {
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [productOpen, serviceOpen]);

  return (
    <header className="bg-white shadow flex items-center justify-between px-8 py-2 sticky top-0 z-50">
      {/* Logo Sol Tarafta */}
      <div className="flex items-center gap-2 cursor-pointer select-none">
        <Link to="/business-panel">
          <img src={logo} alt="YakınındaBul Logo" className="h-10" />
        </Link>
      </div>

      {/* Menü Ortada */}
      <nav className="flex items-center gap-6">
        {/* Ürün Dropdown */}
        <div className="relative">
          <button
            className="px-4 py-2 rounded hover:bg-gray-100 font-medium text-blue-700 transition flex items-center gap-1"
            onClick={e => { e.stopPropagation(); setProductOpen(p => !p); setServiceOpen(false); }}
          >
            Ürün
            <span className="text-xs">{productOpen ? "▲" : "▼"}</span>
          </button>
          {productOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white border shadow-lg rounded z-40 flex flex-col py-2">
              <Link to="/business-panel/products" className="px-4 py-2 hover:bg-gray-100 text-gray-700">Ürün Listesi</Link>
              <Link to="/urun-ekle" className="px-4 py-2 hover:bg-gray-100 text-gray-700">Ürün Ekle</Link>
            </div>
          )}
        </div>
        {/* Hizmet Dropdown */}
        <div className="relative">
          <button
            className="px-4 py-2 rounded hover:bg-gray-100 font-medium text-blue-700 transition flex items-center gap-1"
            onClick={e => { e.stopPropagation(); setServiceOpen(s => !s); setProductOpen(false); }}
          >
            Hizmet
            <span className="text-xs">{serviceOpen ? "▲" : "▼"}</span>
          </button>
          {serviceOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white border shadow-lg rounded z-40 flex flex-col py-2">
              <Link to="/business-panel/services" className="px-4 py-2 hover:bg-gray-100 text-gray-700">Hizmet Listesi</Link>
              <Link to="/business-panel/service-add" className="px-4 py-2 hover:bg-gray-100 text-gray-700">Hizmet Ekle</Link>
            </div>
          )}
        </div>
        {/* Mağaza Tasarımı */}
        <Link
          to="/business-panel/design"
          className="text-base px-3 py-1 bg-blue-100 rounded-lg mx-2 hover:bg-blue-200"

        onClick={() => navigate('/business-panel/design')}

            

        >
          Mağaza Tasarımı
        </Link>
        {/* Değerlendirmeler */}
        <Link to="/business-panel/reviews" className="px-4 py-2 rounded hover:bg-gray-100 font-medium text-blue-700 transition">
          Değerlendirmeler
        </Link>
      </nav>

      {/* Sağda Mağaza İsmi + Profil Menü */}
      <div className="flex items-center gap-4">
        <BusinessProfileMenu
          businessName={businessName}
          onLogout={onLogout}
          onSettings={onSettings}
          onNotifications={onNotifications}
          onFavorites={onFavorites}
        />
      </div>
    </header>
  );
}
