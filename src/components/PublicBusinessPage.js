import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
// Örnek işletme verisi (logo ve kapak dahil)
const businesses = [
  {
    slug: "kaya-hirdavat",
    name: "Kaya Hırdavat",
    cover: "/cover/kaya.jpg",
    logo: "/logos/kayahirdavat.png",
    stars: 4.8,
    reviewCount: 215,
    address: "Konak, İzmir",
    lat: 38.4192,
    lng: 27.1287,
    products: [
      { id: 1, name: "Pense", desc: "Kaya Hırdavat", price: 125, image: "/pense.png", distance: 950 },
    ],
    services: [
      { id: 101, name: "Boya Badana", desc: "Kapsamlı badana", price: 900 },
    ],
  },
  {
    slug: "demircioglu-ticaret",
    name: "Demircioğlu Ticaret",
    cover: "/cover/demircioglu.jpg",
    logo: "/logos/demircioglu.png",
    stars: 4.7,
    reviewCount: 180,
    address: "Alsancak, İzmir",
    lat: 38.4320,
    lng: 27.1400,
    products: [
      { id: 2, name: "Tornavida", desc: "Demircioğlu Ticaret", price: 230, image: "/tornavida.png", distance: 1200 },
    ],
    services: [
      { id: 102, name: "Tesisat", desc: "Profesyonel tesisat hizmeti", price: 1250 },
    ],
  },
  {
    slug: "celik-yapi",
    name: "Çelik Yapı",
    cover: "/cover/celik.jpg",
    logo: "/logos/celikyapi.png",
    stars: 4.6,
    reviewCount: 150,
    address: "Bornova, İzmir",
    lat: 38.4690,
    lng: 27.2167,
    products: [
      { id: 3, name: "5'li Priz", desc: "Çelik Yapı", price: 45, image: "/priz.png", distance: 1600 },
    ],
    services: [
      { id: 103, name: "Elektrik Tesisatı", desc: "Elektrik işlerinde uzman ekip", price: 1800 },
    ],
  },
  {
    slug: "ozkan-ziraat",
    name: "Özkan Ziraat",
    cover: "/cover/ozkan.jpg",
    logo: "/logos/ozkanziraat.png",
    stars: 4.9,
    reviewCount: 242,
    address: "Buca, İzmir",
    lat: 38.3750,
    lng: 27.1500,
    products: [
      { id: 4, name: "Bahçe Hortumu", desc: "Özkan Ziraat", price: 510, image: "/hortum.png", distance: 2000 },
    ],
    services: [
      { id: 104, name: "Çim Biçme", desc: "Profesyonel çim bakımı", price: 350 },
    ],
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "230px",
  borderRadius: 14,
  marginTop: 10,
};

export default function PublicBusinessPage({ isOwner }) {
    const navigate = useNavigate();
  const { slug } = useParams();
  const [tab, setTab] = useState("products");
  const [selectedMapProduct, setSelectedMapProduct] = useState(null);
  const business = businesses.find(b => b.slug === slug) || businesses[0];
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY });
  const list = tab === "products" ? business.products : business.services;
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
   
   
   
   <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <div>
      {isOwner && (
        <button
          onClick={() => navigate("/business-panel/design")}
          className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
        >
          Mağaza Tasarımı
        </button>
      )}
      {/* ... diğer mağaza kodun ... */}
    </div>
      
      {/* Kapak ve İletişim Butonları */}
      <div className="relative h-36 bg-gray-100">
        <img
          src={business.cover}
          alt="Kapak"
          className="w-full h-full object-cover rounded-t-lg"
        />
        {/* Logo */}
        <div className="absolute -bottom-8 right-8">
          <div className="bg-white rounded-full p-1 border-4 border-blue-500 shadow-lg">
            <img
              src={business.logo}
              alt="Logo"
              className="w-14 h-14 object-contain rounded-full"
            />
          </div>
        </div>
        {/* Telefon Butonu */}
        <div className="absolute -bottom-28 right-11">
          <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <PhoneIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        {/* WhatsApp Butonu */}
        <div className="absolute -bottom-48 right-11">
          <button className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/whatsapp-icon.png"
              alt="WhatsApp"
              className="w-8 h-8"
            />
          </button>
        </div>
      </div>

      {/* İşletme Bilgileri */}
      <div className="px-8 pt-12 pb-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">{business.name}</h2>
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 font-semibold">★ {business.stars}</span>
          <span className="text-gray-400 text-sm">({business.reviewCount} değerlendirme)</span>
        </div>
        <div className="text-gray-500 text-sm">{business.address}</div>

        {/* Sekmeler */}
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg font-semibold border ${
              tab === "products" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setTab("products")}
          >
            Ürünler
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold border ${
              tab === "services" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setTab("services")}
          >
            Hizmetler
          </button>
        </div>

        {/* Liste + Harita */}
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* Kart Listesi */}
          <div className="flex-1 flex flex-col gap-3">
            {list.length === 0 ? (
              <div className="text-gray-400 py-8 text-center">
                {tab === "products" ? "Hiç ürün eklenmemiş" : "Hiç hizmet eklenmemiş"}
              </div>
            ) : (
              list.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                  onClick={tab === "products" ? () => setSelectedMapProduct(item) : undefined}
                >
                  {tab === "products" && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-gray-600 text-sm">{item.desc}</div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full ml-2">
                    <span
                      className="font-extrabold"
                      style={{
                        color: "#14b8a6",
                        fontSize: 18,
                        letterSpacing: "0.5px"
                      }}
                    >
                      {item.price} ₺
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Harita & InfoWindow */}
          <div className="relative w-full md:w-80 h-56">
            {isLoaded ? (
              <>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{ lat: business.lat, lng: business.lng }}
                  zoom={15}
                  onClick={() => setSelectedMapProduct(null)}
                >
                  <Marker position={{ lat: business.lat, lng: business.lng }} />
                </GoogleMap>

                {selectedMapProduct && (
                  <div style={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                    padding: 16,
                    width: 300,
                  }}>
                    <button
                      onClick={() => setSelectedMapProduct(null)}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        border: "none",
                        background: "none",
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                    <img
                      src={selectedMapProduct.image}
                      alt={selectedMapProduct.name}
                      style={{ width: 54, height: 54, objectFit: "contain", margin: "0 auto 8px" }}
                    />
                    <div style={{ fontWeight: 600, textAlign: "center", marginBottom: 4 }}>
                      {selectedMapProduct.name}
                    </div>
                    <div style={{ color: "#555", textAlign: "center", marginBottom: 6 }}>
                      {business.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#0980d6", marginBottom: 6 }}>
                      <MapPinIcon className="w-5 h-5 mr-1 text-blue-500" />
                      <span>{(selectedMapProduct.distance / 1000).toFixed(1)} km</span>
                    </div>
                    <div style={{ fontWeight: 600, textAlign: "center", marginBottom: 12 }}>
                      ₺{selectedMapProduct.price}
                    </div>
                    <button
                      onClick={() => window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`,
                        "_blank"
                      )}
                      style={{
                        display: "block",
                        margin: "0 auto",
                        padding: "4px 8px",
                        background: "#0980d6",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}>
                      Yol Tarifi Al
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">Harita yükleniyor...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
