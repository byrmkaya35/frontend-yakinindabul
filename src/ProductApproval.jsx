import React, { useEffect, useState } from "react";
import "./ProductApproval.css";
import { useNavigate } from "react-router-dom";

export default function ProductApproval() {
  const navigate = useNavigate();
  const [pendingProducts, setPendingProducts] = useState([]);

  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const pending = allProducts.filter((p) => p.approved === false);
    setPendingProducts(pending);
  }, []);

  const handleApprove = (productId) => {
    // 1. localStorage'den tüm ürünleri alıp, ilgili ürünün approved alanını true yap
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const updated = allProducts.map((p) =>
      p.id === productId ? { ...p, approved: true } : p
    );
    localStorage.setItem("products", JSON.stringify(updated));

    // 2. Bu ürünü bekleyenler listesinden çıkar
    setPendingProducts((prev) => prev.filter((p) => p.id !== productId));

    // 3. Onay işlemi tamamlandıktan sonra ana sayfaya yönlendir
    navigate("/");
  };

  const handleReject = (productId) => {
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const updated = allProducts.filter((p) => p.id !== productId);
    localStorage.setItem("products", JSON.stringify(updated));
    setPendingProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const getBusinessName = (bizId) => {
    const businesses = JSON.parse(localStorage.getItem("businesses") || "[]");
    const biz = businesses.find((b) => String(b.id) === String(bizId));
    return biz ? biz.name : "Bilinmiyor";
  };

  return (
    <div className="product-approval-page">
      <div className="pa-header">
        <span className="pa-site">yakinindabul.com</span>
        <h2>Ürün Onayı Bekleyenler</h2>
      </div>
      <div className="pa-table-wrap">
        <table className="pa-table">
          <thead>
            <tr>
              <th>Ürün Fotoğrafı</th>
              <th>Ürün</th>
              <th>Esnaf</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Tarih</th>
              <th className="pa-action-header">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pendingProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="pa-img"
                    />
                  ) : (
                    <div className="pa-no-img">Yok</div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{getBusinessName(product.businessId)}</td>
                <td>{product.categoryGroup}</td>
                <td>{product.price}₺</td>
                <td>{product.createdAt}</td>
                <td>
                  <div className="pa-btn-group">
                    <button
                      className="pa-btn pa-btn-inspect"
                      onClick={() =>
                        alert(`${product.name}\n\n${product.description}`)
                      }
                    >
                      İncele
                    </button>
                    <button
                      className="pa-btn pa-btn-approve"
                      onClick={() => handleApprove(product.id)}
                    >
                      Onayla
                    </button>
                    <button
                      className="pa-btn pa-btn-reject"
                      onClick={() => handleReject(product.id)}
                    >
                      Reddet
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pendingProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="pa-no-data">
                  Onay bekleyen ürün bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="pa-back-btn" onClick={() => navigate("/admin")}>
        ← Yönetici Paneline Dön
      </button>
    </div>
  );
}
