// src/components/business-panel.js
import React, { useState, useRef, useEffect } from "react";
import defaultLogo from "../yakınındabul-logo.png";
import defaultCover from "../default-cover.jpg";
import { FaCamera, FaSearch, FaMapMarkerAlt, FaBoxOpen } from "react-icons/fa";

export default function BusinessPanel() {
  const [business, setBusiness] = useState(null);
  const [cover, setCover] = useState(null);
  const [logo, setLogo] = useState(null);
  const coverInputRef = useRef();
  const logoInputRef = useRef();

  useEffect(() => {
    const biz = localStorage.getItem("business");
    if (biz) {
      const data = JSON.parse(biz);
      setBusiness(data);
      setCover(data.coverImage || null);
      setLogo(data.logo || null);
    }
  }, []);

  // Demo istatistik verileri
  const stats = {
    mostViewedProduct: "Pense",
    mostViewedMapProduct: "Matkap",
    totalClicks: 450,
    publishedProducts: 24,
    weeklyClicks: [8, 12, 18, 20, 23, 19, 10], // Son 7 gün
    weeklyLabels: [
      "Pzt",
      "Salı",
      "Çrş",
      "Perş",
      "Cuma",
      "Cts",
      "Paz"
    ],
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "cover") setCover(reader.result);
      if (type === "logo") setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        İşletme hesabı bulunamadı. Giriş yapınız.
      </div>
    );
  }

  // Max değer grafikteki yükseklik oranı için
  const maxClick = Math.max(...stats.weeklyClicks, 1);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pb-12">
      {/* Kapak ve logo */}
      <div className="w-full max-w-2xl relative flex flex-col items-center">
        <img
          src={cover || defaultCover}
          alt="Kapak"
          className="w-full h-40 md:h-60 object-cover rounded-b-2xl shadow-sm"
        />
        <button
          className="absolute bottom-4 right-4 bg-white/80 hover:bg-white/90 rounded-full p-3 shadow-lg"
          onClick={() => coverInputRef.current.click()}
        >
          <FaCamera className="text-xl text-gray-700" />
        </button>
        <input
          type="file"
          ref={coverInputRef}
          accept="image/*"
          className="hidden"
          onChange={e => handleImageChange(e, "cover")}
        />
        <div className="absolute left-1/2 bottom-[-40px] -translate-x-1/2">
          <div className="relative group">
            <img
              src={logo || defaultLogo}
              alt="Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white shadow-lg bg-white"
            />
            <button
              className="absolute bottom-0 right-0 bg-white/80 rounded-full p-2 shadow-md group-hover:scale-110 transition"
              onClick={() => logoInputRef.current.click()}
              title="Logo değiştir"
            >
              <FaCamera className="text-lg text-gray-700" />
            </button>
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              className="hidden"
              onChange={e => handleImageChange(e, "logo")}
            />
          </div>
        </div>
      </div>

      {/* Performans Kartları */}
      <div className="mt-20 md:mt-28 w-full max-w-2xl px-4 flex flex-col items-center">
        <div className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Mağaza Performansım
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
          <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
            <FaSearch className="text-blue-600 text-xl mb-1" />
            <div className="text-xs text-gray-500">En çok görüntülenen ürün</div>
            <div className="font-semibold text-sm">{stats.mostViewedProduct}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
            <FaMapMarkerAlt className="text-teal-600 text-xl mb-1" />
            <div className="text-xs text-gray-500">Haritada en çok gösterilen ürün</div>
            <div className="font-semibold text-sm">{stats.mostViewedMapProduct}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
            <FaBoxOpen className="text-yellow-600 text-xl mb-1" />
            <div className="text-xs text-gray-500">Toplam ürün tıklaması</div>
            <div className="font-semibold text-xl">{stats.totalClicks}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
            <span className="text-green-600 text-xl mb-1 font-bold">#</span>
            <div className="text-xs text-gray-500">Yayındaki ürün sayısı</div>
            <div className="font-semibold text-xl">{stats.publishedProducts}</div>
          </div>
        </div>
        {/* 7 Günlük Grafik (saf CSS ile) */}
        <div className="w-full bg-white rounded-xl shadow p-5 mt-2 mb-8 flex flex-col items-center">
          <div className="font-bold text-sm mb-2 text-gray-700">Son 7 gün ürün tıklamaları</div>
          <div className="w-full flex items-end gap-2 h-36">
            {stats.weeklyClicks.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end h-full">
                <div
                  className="bg-blue-500 rounded-t-md transition-all"
                  style={{
                    width: 22,
                    height: `${(val / maxClick) * 100}%`,
                    minHeight: 10,
                  }}
                  title={`${val} tıklama`}
                />
                <div className="text-xs mt-1 text-gray-500">{stats.weeklyLabels[idx]}</div>
              </div>
            ))}
          </div>
        </div>
        {/* İşletme Bilgileri */}
        <div className="w-full max-w-2xl px-4 mt-2">
          <div className="bg-white rounded-xl shadow p-5 text-gray-700 text-center">
            <div className="font-bold mb-2">İşletme Hakkında</div>
            <div>{business.description || "Henüz açıklama eklenmemişş."}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
