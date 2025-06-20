import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "https://yakinindabul-backend.onrender.com";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null); // hangi satırda dropdown açık

  // Giriş yapan mağazanın ID'si localStorage'dan (string veya number olabilir)
  const businessId = localStorage.getItem("businessId");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch(() => alert("Ürünler alınamadı"))
      .finally(() => setLoading(false));
  }, []);

  // Sadece bu mağazanın ürünleri filtrelenir
  const filteredProducts = products.filter(
    (p) => businessId && String(p.business_id) === String(businessId)
  );

  // Ürün kodu için varsayılan alan (yoksa id kullanılabilir)
  const getProductCode = (p) => p.product_code || p.code || p.id || "-";

  // Marka için varsayılan alan (yoksa boş göster)
  const getProductBrand = (p) => p.brand || p.marka || "-";

  // Kategori stringini en alt kategoriye çevirir (ör: "Ana > Alt > EnAlt" --> "EnAlt")
  const getLastCategory = (catPath) => {
    if (!catPath) return "-";
    const arr = catPath.split(">");
    return arr[arr.length - 1].trim();
  };

  // Silme fonksiyonu (TOKEN EKLENDİ)
  const handleDelete = async (id) => {
    if (!window.confirm("Ürünü silmek istediğine emin misin?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Silinemedi.");
    }
  };

  // Dropdown dışına tıklanınca kapatmak için hook
  const dropdownRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdown]);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-5">Tüm Ürünler</h2>
      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 font-semibold text-left">Görsel</th>
              <th className="p-3 font-semibold text-left">Kategori</th>
              <th className="p-3 font-semibold text-left">Ürün Kodu</th>
              <th className="p-3 font-semibold text-left">Marka</th>
              <th className="p-3 font-semibold text-left">Fiyat</th>
              <th className="p-3 font-semibold text-left">Stok Durumu</th>
              <th className="p-3 font-semibold text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-400">
                  Ürün bulunamadı.
                </td>
              </tr>
            )}
            {filteredProducts.map((p, idx) => {
              // Görsel:
              let firstImageUrl = "";
              try {
                if (p.images) {
                  const arr = JSON.parse(p.images);
                  if (Array.isArray(arr) && arr.length > 0) {
                    firstImageUrl = arr[0];
                  }
                }
              } catch (err) {
                if (typeof p.images === "string" && p.images.startsWith("http")) {
                  firstImageUrl = p.images;
                }
              }
              // stok durumu küçük harfe normalize et
              const stokVar = String(p.stock_status).toLowerCase() === "var";

              return (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Görsel */}
                  <td className="p-3">
                    {firstImageUrl ? (
                      <img
                        src={firstImageUrl}
                        alt={p.name}
                        className="w-14 h-14 object-contain border rounded bg-gray-50"
                      />
                    ) : (
                      <span className="w-14 h-14 flex items-center justify-center bg-blue-50 rounded text-blue-400 text-xl font-bold">
                        {p.name?.charAt(0) || "?"}
                      </span>
                    )}
                  </td>
                  {/* Kategori */}
                  <td className="p-3">{getLastCategory(p.category_path)}</td>
                  {/* Ürün Kodu */}
                  <td className="p-3">{getProductCode(p)}</td>
                  {/* Marka */}
                  <td className="p-3">{getProductBrand(p)}</td>
                  {/* Fiyat */}
                  <td className="p-3 font-semibold text-gray-900">₺{p.price}</td>
                  {/* Stok Durumu */}
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${stokVar ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {stokVar ? "var" : "yok"}
                    </span>
                  </td>
                  {/* İşlemler */}
                  <td className="p-3 relative" style={{ minWidth: 120 }}>
                    <div className="inline-block text-center" ref={openDropdown === idx ? dropdownRef : null}>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setOpenDropdown(idx === openDropdown ? null : idx); }}
                        className="text-gray-700 px-2 py-1 font-semibold border rounded w-32 flex items-center justify-between hover:bg-gray-100"
                      >
                        Ürün İşlemleri
                        <svg style={{ marginLeft: 6 }} width="16" height="16" fill="none" stroke="currentColor"><path d="M4 6l4 4 4-4" /></svg>
                      </button>
                      {openDropdown === idx && (
                        <div
                          className="absolute z-10 bg-white rounded shadow border mt-2 left-1/2 -translate-x-1/2 w-40"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-50"
                            onClick={() => { setOpenDropdown(null); alert("Düzenle sayfası yapılacak."); }}
                          >
                            Ürünü Düzenle
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            onClick={() => { setOpenDropdown(null); handleDelete(p.id); }}
                          >
                            Ürünü Sil
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
