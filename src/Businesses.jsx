import React, { useEffect, useState } from "react";
import "./Businesses.css";
import { useNavigate } from "react-router-dom";

export default function Businesses() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const bizList = JSON.parse(localStorage.getItem("businesses") || "[]");
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const bizWithProductCount = bizList.map((b) => {
      const productCount = allProducts.filter(
        (p) => String(p.businessId) === String(b.id) && p.approved === true
      ).length;
      return {
        ...b,
        productCount,
      };
    });
    setBusinesses(bizWithProductCount);
  }, []);

  return (
    <div className="businesses-page">
      <div className="businesses-header">
        <h2>Kayıtlı Esnaflar</h2>
        <div className="businesses-desc">
          Sisteme kayıtlı esnafların bilgilerinin yönetildiği tablo.
        </div>
      </div>
      <div className="businesses-table-wrap">
        <table className="businesses-table">
          <thead>
            <tr>
              <th>Mağaza Adı</th>
              <th>Yetkili Kişi</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Ürün Sayısı</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.owner}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>
                  <span className="b-prod-count">{b.productCount}</span>
                </td>
                <td>
                  <span
                    className={
                      b.isActive ? "b-status b-active" : "b-status b-passive"
                    }
                  >
                    {b.isActive ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td>
                  <button className="b-btn-inspect" onClick={() => navigate(`/esnaf/${b.id}`)}>
                    İncele
                  </button>
                </td>
              </tr>
            ))}
            {businesses.length === 0 && (
              <tr>
                <td colSpan="7" className="biz-no-data">
                  Kayıtlı esnaf bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="b-back-btn" onClick={() => navigate("/admin")}>
        ← Yönetici Paneline Dön
      </button>
    </div>
  );
}