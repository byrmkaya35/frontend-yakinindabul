import React, { useState, useRef } from "react";
import axios from "axios";
import CategorySelector from "./CategorySelector";

// 👇 ENV üzerinden API_URL çekiliyor

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


export default function AddProduct() {
  const [urunAdi, setUrunAdi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [fiyat, setFiyat] = useState("");
  const [stokDurumu, setStokDurumu] = useState("var");
  const [kategoriPath, setKategoriPath] = useState("");
  const [marka, setMarka] = useState("");
  const [renk, setRenk] = useState("");
  const [boyut, setBoyut] = useState("");
  const [malzeme, setMalzeme] = useState("");
  const [urunKodu, setUrunKodu] = useState("");
  const [images, setImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);

  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewIndex(null);
  };

  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleDragEnter = (e, position) => { dragOverItem.current = position; };
  const handleDragEnd = () => {
    const listCopy = [...images];
    const dragItemContent = listCopy[dragItem.current];
    listCopy.splice(dragItem.current, 1);
    listCopy.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setImages(listCopy);
  };

  const handleCategorySelect = (categoryPathString) => {
    setKategoriPath(categoryPathString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("urunAdi", urunAdi);
      formData.append("aciklama", aciklama);
      formData.append("fiyat", fiyat);
      formData.append("stokDurumu", stokDurumu);
      formData.append("kategoriPath", kategoriPath);
      formData.append("marka", marka);
      formData.append("renk", renk);
      formData.append("boyut", boyut);
      formData.append("malzeme", malzeme);
      formData.append("urunKodu", urunKodu);
      images.forEach((img) => formData.append("images", img));

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Ürün başarıyla eklendi!");
        setUrunAdi(""); setAciklama(""); setFiyat("");
        setStokDurumu("var"); setKategoriPath(""); setMarka("");
        setRenk(""); setBoyut(""); setMalzeme(""); setUrunKodu("");
        setImages([]); setPreviewIndex(null);
      } else {
        alert(res.data.message || "Bir hata oluştu!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Sunucu hatası!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pt-16 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 max-w-6xl w-full grid grid-cols-2 gap-6 relative"
      >
        {/* Ürün Bilgileri */}
        <div className="col-span-2">
          <h2 className="font-bold mb-4 text-lg">Ürün Bilgileri</h2>
          <input
            type="text"
            placeholder="Ürün Adı"
            value={urunAdi}
            onChange={(e) => setUrunAdi(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Açıklama"
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        {/* Kategori Seçici */}
        <div className="col-span-2 flex flex-col items-start">
          <h3 className="font-semibold mb-3">Kategori Seçimi</h3>
          <CategorySelector onChange={handleCategorySelect} />
          <div className="mt-1 text-sm text-gray-600">{kategoriPath}</div>
        </div>

        {/* Görsel Yükle */}
        <div className="relative col-span-1">
          <h3 className="font-semibold mb-3">Görsel Yükle</h3>
          <label
            htmlFor="gorselInput"
            className="border-2 border-dashed border-gray-400 rounded-lg cursor-pointer flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-blue-500 hover:border-blue-500"
            style={{ minHeight: "48px" }}
          >
            <div className="text-4xl select-none">+</div>
            <div>Görsel yükle</div>
            <input
              id="gorselInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesChange}
              className="hidden"
            />
          </label>
          {images.length > 0 && (
            <>
              <h4 className="mt-4 mb-2 font-semibold text-gray-700">
                Yüklenen Görseller
              </h4>
              <div className="flex" style={{ gap: "1rem" }}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() =>
                      setPreviewIndex(previewIndex === index ? null : index)
                    }
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`upload-${index}`}
                      className="w-full h-full object-cover"
                    />
                    {previewIndex === index && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(index);
                        }}
                        className="absolute top-0 right-0 bg-red-600 rounded-full w-5 h-5 text-white flex items-center justify-center text-xs"
                        title="Sil"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {previewIndex !== null && images[previewIndex] && (
                <div className="mt-4 p-2 border border-gray-300 rounded shadow max-w-xs">
                  <img
                    src={URL.createObjectURL(images[previewIndex])}
                    alt={`preview-${previewIndex}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Ürün Özellikleri */}
        <div>
          <h3 className="font-semibold mb-3">Ürün Özellikleri</h3>
          <input
            type="text"
            placeholder="Marka"
            value={marka}
            onChange={(e) => setMarka(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Renk"
            value={renk}
            onChange={(e) => setRenk(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Boyut"
            value={boyut}
            onChange={(e) => setBoyut(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Malzeme"
            value={malzeme}
            onChange={(e) => setMalzeme(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Ürün Kodu"
            value={urunKodu}
            onChange={(e) => setUrunKodu(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Fiyat Alanı */}
          <div className="mt-3">
            <label className="block mb-1 font-semibold" htmlFor="fiyat">
              Fiyat <span className="text-red-500">*</span>
            </label>
            <input
              id="fiyat"
              type="number"
              placeholder="Fiyat"
              value={fiyat}
              onChange={(e) => setFiyat(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Butonlar */}
        <div className="col-span-2 flex justify-between items-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-5 py-2 hover:bg-blue-700 transition"
          >
            Kaydet ve Yayınla
          </button>
          <button
            type="reset"
            onClick={() => {
              setUrunAdi(""); setAciklama(""); setFiyat("");
              setStokDurumu("var"); setKategoriPath(""); setMarka("");
              setRenk(""); setBoyut(""); setMalzeme(""); setUrunKodu("");
              setImages([]); setPreviewIndex(null);
            }}
            className="bg-gray-200 rounded px-5 py-2 hover:bg-gray-300 transition"
          >
            Temizle
          </button>
        </div>
      </form>
    </div>
  );
}
