import React, { useEffect, useState } from "react";
import "./Complaints.css";
import { useNavigate } from "react-router-dom";

export default function Complaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const allComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    setComplaints(allComplaints);
  }, []);

  const handleDelete = (complaintId) => {
    const allComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const updated = allComplaints.filter((c) => c.id !== complaintId);
    localStorage.setItem("complaints", JSON.stringify(updated));
    setComplaints(updated);
  };

  const handleResolve = (complaintId) => {
    const allComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
    const updated = allComplaints.map((c) =>
      c.id === complaintId ? { ...c, isResolved: true } : c
    );
    localStorage.setItem("complaints", JSON.stringify(updated));
    setComplaints(updated.filter((c) => c.isResolved !== true));
  };

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <h2>Şikayet Edilen Ürünler</h2>
        <div className="complaints-desc">
          Kullanıcıların şikayet ettiği ürünlerin listelendiği yönetim paneli.
        </div>
      </div>
      <div className="complaints-table-wrap">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Ürün / Şikayet Nedeni</th>
              <th>Bildirilen Kullanıcı</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td>
                  <span className="complaint-product">{c.product}</span>
                  <div className="complaint-reason">{c.reason}</div>
                </td>
                <td>{c.user}</td>
                <td>{c.date}</td>
                <td>
                  <button
                    className="comp-btn comp-inspect"
                    onClick={() => alert(`Ürün: ${c.product}\nSebep: ${c.reason}`)}
                  >
                    İncele
                  </button>
                  <button
                    className="comp-btn comp-delete"
                    onClick={() => handleDelete(c.id)}
                  >
                    Sil
                  </button>
                  <button
                    className="comp-btn comp-resolve"
                    onClick={() => handleResolve(c.id)}
                  >
                    Çöz
                  </button>
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan="4" className="comp-no-data">
                  Şikayet bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="comp-back-btn" onClick={() => navigate("/admin")}>
        ← Yönetici Paneline Dön
      </button>
    </div>
  );
}