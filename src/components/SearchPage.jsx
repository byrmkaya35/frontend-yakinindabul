import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// İşletme adı -> slug eşleşmesi
const businessSlugs = {
  "Kaya Hırdavat": "kaya-hirdavat",
  "Demircioğlu Ticaret": "demircioglu-ticaret",
  "Çelik Yapı": "celik-yapi",
  "Özkan Ziraat": "ozkan-ziraat",
};

const services = [
  {
    id: 1,
    business: "Kaya Hırdavat",
    service: "Anahtar Çilingir",
    desc: "7/24 anahtar hizmeti",
    stars: 5,
    distance: 900,
    price: 300,
  },
  {
    id: 2,
    business: "Demircioğlu Ticaret",
    service: "Tamir ve Montaj",
    desc: "Evde tamir işleri",
    stars: 4,
    distance: 1500,
    price: 600,
  },
];

const products = [
  {
    id: 1,
    name: "Kaya Hırdavat",
    desc: "Pense",
    distance: 950,
    price: 125,
    stars: 4,
    category: "El Aletleri",
    lat: 38.4192,
    lng: 27.1287,
    image: "/pense.png"
  },
  {
    id: 2,
    name: "Demircioğlu Ticaret",
    desc: "Tornavida",
    distance: 1200,
    price: 230,
    stars: 4,
    category: "El Aletleri",
    lat: 38.4194,
    lng: 27.1255,
    image: "/tornavida.png"
  },
  {
    id: 3,
    name: "Çelik Yapı",
    desc: "5'li Priz",
    distance: 1600,
    price: 45,
    stars: 4,
    category: "Elektrik",
    lat: 38.4188,
    lng: 27.1231,
    image: "/priz.png"
  },
  {
    id: 4,
    name: "Özkan Ziraat",
    desc: "Su hortumu",
    distance: 2000,
    price: 510,
    stars: 4,
    category: "Bahçe",
    lat: 38.4169,
    lng: 27.1311,
    image: "/hortum.png"
  }
];

const mapContainerStyle = { width: "100%", height: "100%" };

const customMapStyle = [
  { featureType: "poi.business", elementType: "all", stylers: [{ visibility: "off" }] },
  // Diğer stiller...
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMapProduct, setSelectedMapProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Filtre State'leri
  const params = new URLSearchParams(location.search);
  const urlSearch = params.get("q") || "";
  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [distance, setDistance] = useState("");
  const [sort, setSort] = useState("");
  const [stars, setStars] = useState("");

  const isMobile = useIsMobile();

  // Google Haritalar API yüklenmesi
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Filtreleme ve sıralama işlemleri
  const filteredProducts = useMemo(() => {
    let result = products;
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.desc.toLowerCase().includes(s)
      );
    }
    if (category && category !== "Kategori") {
      result = result.filter((p) => p.category === category);
    }
    if (stars) {
      if (stars === "5") {
        result = result.filter((p) => (p.stars || 4) === 5);
      } else {
        result = result.filter((p) => (p.stars || 4) >= parseInt(stars));
      }
    }
    if (price) {
      if (price === "0-100 TL") result = result.filter((p) => p.price <= 100);
      else if (price === "100-300 TL") result = result.filter((p) => p.price > 100 && p.price <= 300);
      else if (price === "300+ TL") result = result.filter((p) => p.price > 300);
    }
    if (distance) {
      if (distance === "1 km") result = result.filter((p) => p.distance <= 1000);
      else if (distance === "5 km") result = result.filter((p) => p.distance <= 5000);
      else if (distance === "10 km") result = result.filter((p) => p.distance <= 10000);
    }
    if (sort) {
      if (sort === "En Yakın") result = [...result].sort((a, b) => a.distance - b.distance);
      else if (sort === "En Ucuz") result = [...result].sort((a, b) => a.price - b.price);
      else if (sort === "En Pahalı") result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [search, category, price, distance, sort, stars]);

  // Arama çubuğuna tıklayınca SearchPage'e yönlendir
  const handleSearchBarFocus = () => {
    navigate("/search?q=" + encodeURIComponent(search));
  };

  // Eğer url değişirse, search input da güncellensin
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // --- FİLTRELER ---
  function renderFilters() {
    if (isMobile) {
      return (
        <div
          className="mobile-filters trendyol-scrollbar"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            display: "flex",
            flexWrap: "nowrap",
            gap: "10px",
            paddingBottom: 4,
            marginBottom: 10,
            WebkitOverflowScrolling: "touch"
          }}
        >
          <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Kategori</option>
            <option>El Aletleri</option>
            <option>Bahçe</option>
            <option>Elektrik</option>
          </select>
          <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Sıralama</option>
            <option>En Yakın</option>
            <option>En Ucuz</option>
            <option>En Pahalı</option>
          </select>
          <select className="filter-select" value={distance} onChange={e => setDistance(e.target.value)}>
            <option value="">Mesafe</option>
            <option>1 km</option>
            <option>5 km</option>
            <option>10 km</option>
          </select>
          <select className="filter-select" value={price} onChange={e => setPrice(e.target.value)}>
            <option value="">Fiyat Aralığı</option>
            <option>0-100 TL</option>
            <option>100-300 TL</option>
            <option>300+ TL</option>
          </select>
          <select className="filter-select" value={stars} onChange={e => setStars(e.target.value)}>
            <option value="">Puan</option>
            <option value="1">1 ★ üstü</option>
            <option value="2">2 ★ üstü</option>
            <option value="3">3 ★ üstü</option>
            <option value="4">4 ★ üstü</option>
            <option value="5">5 ★</option>
          </select>
        </div>
      );
    } else {
      // Masaüstü klasik görünüm
      return (
        <div className="filters">
          <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Kategori</option>
            <option>El Aletleri</option>
            <option>Bahçe</option>
            <option>Elektrik</option>
          </select>
          <select className="filter-select" value={price} onChange={e => setPrice(e.target.value)}>
            <option value="">Fiyat Aralığı</option>
            <option>0-100 TL</option>
            <option>100-300 TL</option>
            <option>300+ TL</option>
          </select>
          <select className="filter-select" value={distance} onChange={e => setDistance(e.target.value)}>
            <option value="">Mesafe</option>
            <option>1 km</option>
            <option>5 km</option>
            <option>10 km</option>
          </select>
          <select className="filter-select" value={stars} onChange={e => setStars(e.target.value)}>
            <option value="">Puan</option>
            <option value="1">1 ★</option>
            <option value="2">2 ★</option>
            <option value="3">3 ★</option>
            <option value="4">4 ★</option>
            <option value="5">5 ★</option>
          </select>
          <select className="filter-select ml-auto" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Sıralama</option>
            <option>En Yakın</option>
            <option>En Ucuz</option>
            <option>En Pahalı</option>
          </select>
        </div>
      );
    }
  }

  return (
    <div
      className={`w-full max-w-[1280px] h-[calc(100vh-64px)] mx-auto flex ${isMobile ? "flex-col" : ""} bg-gray-50 rounded-2xl shadow-xl overflow-hidden`}
      style={{ marginTop: 0, marginBottom: 0, position: "relative" }}
    >
      {/* SOL PANEL */}
      <div className={`${isMobile ? "w-full" : "w-[440px]"} bg-white p-6 flex flex-col gap-3 shadow-md z-10`}>
        {/* ARAMA & SEKME BUTONLARI */}
        <input
          type="text"
          placeholder="ürün ara"
          value={search}
          onFocus={handleSearchBarFocus}
          readOnly
          className="w-full px-4 py-2 border rounded-md mb-1 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50"
        />
        <div className="text-xs text-gray-500 mb-2" style={{marginTop:"-4px", marginBottom:"4px"}}>
          İzmir'de {filteredProducts.length} ürün bulundu
        </div>
        <div className={`flex items-center gap-2 mb-2 ${isMobile ? "justify-center" : ""}`}>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition ${
              tab === "list"
                ? "bg-blue-100 text-blue-700"
                : "bg-transparent text-gray-500"
            }`}
            onClick={() => setTab("list")}
          >
            Ürünler
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition ${
              tab === "services"
                ? "bg-blue-100 text-blue-700"
                : "bg-transparent text-gray-500"
            }`}
            onClick={() => setTab("services")}
          >
            Hizmetler
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition ${
              tab === "map"
                ? "bg-blue-100 text-blue-700"
                : "bg-transparent text-gray-500"
            }`}
            onClick={() => setTab("map")}
          >
            Harita
          </button>
        </div>
        {renderFilters()}

        {/* Hizmet Detay Kartı */}
        {selectedService && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-xs relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setSelectedService(null)}
              >✕</button>
              <div className="flex flex-col items-center gap-2">
                <div className="text-lg font-bold">{selectedService.service}</div>
                <div className="text-md text-gray-600">{selectedService.business}</div>
                <div className="text-sm text-gray-500">{selectedService.desc}</div>
                <div className="font-semibold text-blue-600 flex items-center gap-1 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="16" height="16">
                    <path
                      d="M20 3C12.268 3 6 9.268 6 17c0 8.351 11.515 17.21 12.008 17.591a2 2 0 0 0 2.484 0C22.485 34.21 34 25.351 34 17c0-7.732-6.268-14-14-14zm0 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
                      fill="#4fc3f7"
                    />
                    <circle cx="20" cy="17" r="4" fill="#fff"/>
                  </svg>
                  {(selectedService.distance / 1000).toFixed(1)} km
                </div>
                <div className="font-semibold text-gray-700 mt-1">{selectedService.price} ₺</div>
              </div>
            </div>
          </div>
        )}

        {/* Hizmet Kartları */}
        {tab === "services" && (
          <div
            style={{
              maxHeight: isMobile
                ? "calc(100vh - 270px)"
                : "calc(100vh - 220px)",
              minHeight: 200,
              overflowY: "auto",
              paddingRight: 4
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="product-list-card relative"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex flex-col gap-1 px-3 py-4 flex-1 relative">
                    <div className="font-bold text-[15px] text-gray-800 line-clamp-1">{service.service}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{service.desc}</div>
                    <div className="text-xs text-teal-600 font-semibold hover:underline mt-1 mb-1">
                      <Link
                        to={`/isletme/${businessSlugs[service.business] || ""}`}
                        onClick={e => e.stopPropagation()}
                      >
                        {service.business}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1 mb-0">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="14" height="14" fill={i < (service.stars || 4) ? "#FACC15" : "#E5E7EB"}>
                          <polygon points="7.5,1 9.5,6 15,6 10.5,9.5 12,15 7.5,12 3,15 4.5,9.5 0,6 5.5,6" />
                        </svg>
                      ))}
                      <span className="text-gray-500 font-medium ml-1">{service.stars || 4}.0</span>
                    </div>
                    <div className="flex items-end justify-between mt-auto pt-3 pb-1">
                      <span className="flex items-center text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#23A6AE" viewBox="0 0 40 40">
                          <path d="M20 3C12.268 3 6 9.268 6 17c0 8.351 11.515 17.21 12.008 17.591a2 2 0 0 0 2.484 0C22.485 34.21 34 25.351 34 17c0-7.732-6.268-14-14-14zm0 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
                          <circle cx="20" cy="17" r="4" fill="#fff"/>
                        </svg>
                        <span className="ml-1">{(service.distance / 1000).toFixed(1)} km</span>
                      </span>
                      <span className="font-extrabold text-teal-600 text-base text-right" style={{fontSize: 14, minWidth: 42}}>
                        {service.price} ₺
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ürün KARTLARI */}
        {tab === "list" && (
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: isMobile
                ? "calc(100vh - 270px)"
                : "calc(100vh - 220px)",
              minHeight: 200,
              paddingRight: 4
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white rounded-2xl shadow hover:shadow-lg border border-gray-100 flex flex-col cursor-pointer transition-all group min-h-[205px] max-h-[240px] p-0"
                  onClick={() => setSelectedProduct(product)}
                  style={{ minHeight: 205, height: "100%" }}
                >
                  {/* Favori (Kalp) */}
                  <button
                    className="absolute top-3 right-3 z-10 text-gray-300 hover:text-pink-500 transition-colors"
                    onClick={e => { e.stopPropagation(); }}
                  >
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16.5 4.75a4.5 4.5 0 0 0-6.364 0l-.636.637-.636-.637A4.5 4.5 0 0 0 2.5 11.114l.637.636L11 19.613l7.863-7.863.637-.636A4.5 4.5 0 0 0 16.5 4.75Z" />
                    </svg>
                  </button>
                  {/* Ürün görseli */}
                  <div className="flex items-center justify-center pt-4 pb-2 h-24 bg-gray-50">
                    <img src={product.image} alt={product.desc} className="max-h-16 object-contain" />
                  </div>
                  <div className="flex flex-col gap-1 px-3 pb-2 pt-1 flex-1 relative">
                    <div className="font-bold text-[15px] text-gray-800 line-clamp-1">{product.desc}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{product.shortDesc || "Kısa açıklama burada."}</div>
                    <div className="text-xs text-teal-600 font-semibold hover:underline mt-1 mb-1">
                      <Link
                        to={`/isletme/${businessSlugs[product.name] || ""}`}
                        onClick={e => e.stopPropagation()}
                      >
                        {product.name}
                      </Link>
                    </div>
                    {/* Yıldız puanlama */}
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="14" height="14" fill={i < (product.stars || 4) ? "#FACC15" : "#E5E7EB"}>
                          <polygon points="7.5,1 9.5,6 15,6 10.5,9.5 12,15 7.5,12 3,15 4.5,9.5 0,6 5.5,6" />
                        </svg>
                      ))}
                      <span className="text-gray-500 font-medium ml-1">{product.stars || 4}.0</span>
                    </div>
                    {/* Alt satır: uzaklık solda, fiyat sağda */}
                    <div className="flex items-end justify-between mt-auto pt-3 pb-1">
                      <span className="flex items-center text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#23A6AE" viewBox="0 0 40 40">
                          <path d="M20 3C12.268 3 6 9.268 6 17c0 8.351 11.515 17.21 12.008 17.591a2 2 0 0 0 2.484 0C22.485 34.21 34 25.351 34 17c0-7.732-6.268-14-14-14zm0 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/>
                          <circle cx="20" cy="17" r="4" fill="#fff"/>
                        </svg>
                        <span className="ml-1">{(product.distance / 1000).toFixed(1)} km</span>
                      </span>
                      <span className="font-extrabold text-teal-600 text-base text-right" style={{fontSize: 14, minWidth: 42}}>
                        {product.price} ₺
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobilde Harita */}
        {isMobile && tab === "map" && (
          <div className="w-full h-[60vh] min-h-[350px] bg-white rounded-xl overflow-hidden mt-4" style={{position:"relative"}}>
            {isLoaded ? (
              <>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{ lat: 38.4192, lng: 27.1287 }}
                  zoom={13}
                  options={{ styles: customMapStyle }}
                  onClick={() => setSelectedMapProduct(null)}
                >
                  {filteredProducts.map((p) => (
                    <Marker
                      key={p.id}
                      position={{ lat: p.lat, lng: p.lng }}
                      icon={{
                        url: p.image,
                        scaledSize: new window.google.maps.Size(42, 42),
                      }}
                      onClick={() => setSelectedMapProduct(p)}
                    />
                  ))}
                </GoogleMap>
                {/* Harita Detay Kartı */}
                {selectedMapProduct && (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 40,
                      transform: "translateX(-50%)",
                      zIndex: 20,
                      minWidth: 270,
                      maxWidth: 320,
                      background: "#fff",
                      borderRadius: 16,
                      boxShadow: "0 2px 16px #0002",
                      padding: 20,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <button
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 12,
                        background: "none",
                        border: "none",
                        fontSize: 18,
                        color: "#888",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedMapProduct(null)}
                    >✕</button>
                    <img src={selectedMapProduct.image} alt={selectedMapProduct.name} style={{width: 54, height: 54, objectFit: "contain", marginBottom: 10}} />
                    <div style={{fontWeight: "bold", fontSize: 19, marginBottom: 2}}>{selectedMapProduct.desc}</div>
                    <div style={{color: "#555", fontSize: 15, marginBottom: 6}}>
                      <Link to={`/isletme/${businessSlugs[selectedMapProduct.name] || ""}`} style={{color:"#2184c4", fontWeight:"600"}}>
                        {selectedMapProduct.name}
                      </Link>
                    </div>
                    <div style={{color: "#0980d6", fontWeight: 500, fontSize: 15, marginBottom: 6}}>
                      {(selectedMapProduct.distance / 1000).toFixed(1)} km
                    </div>
                    <div style={{fontWeight: 600, fontSize: 17, marginBottom: 9}}>₺{selectedMapProduct.price}</div>
                    <button
                      style={{
                        padding: "8px 20px",
                        background: "#0980d6",
                        color: "#fff",
                        borderRadius: 9,
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer"
                      }}
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${selectedMapProduct.lat},${selectedMapProduct.lng}`,
                          "_blank"
                        )
                      }
                    >
                      Yol Tarifi Al
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div>Harita yükleniyor...</div>
            )}
          </div>
        )}
      </div>

      {/* Masaüstünde harita */}
      {!isMobile && (
        <div className="flex-1 relative flex items-center justify-center min-h-[350px] bg-white" style={{position:"relative"}}>
          {isLoaded ? (
            <>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: 38.4192, lng: 27.1287 }}
                zoom={13}
                options={{ styles: customMapStyle }}
                onClick={() => setSelectedMapProduct(null)}
              >
                {filteredProducts.map((p) => (
                  <Marker
                    key={p.id}
                    position={{ lat: p.lat, lng: p.lng }}
                    icon={{
                      url: p.image,
                      scaledSize: new window.google.maps.Size(42, 42),
                    }}
                    onClick={() => setSelectedMapProduct(p)}
                  />
                ))}
              </GoogleMap>
              {/* Masaüstü için de Kart */}
              {selectedMapProduct && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 40,
                    transform: "translateX(-50%)",
                    zIndex: 20,
                    minWidth: 270,
                    maxWidth: 320,
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 2px 16px #0002",
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <button
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 12,
                      background: "none",
                      border: "none",
                      fontSize: 18,
                      color: "#888",
                      cursor: "pointer"
                    }}
                    onClick={() => setSelectedMapProduct(null)}
                  >✕</button>
                  <img src={selectedMapProduct.image} alt={selectedMapProduct.name} style={{width: 54, height: 54, objectFit: "contain", marginBottom: 10}} />
                  <div style={{fontWeight: "bold", fontSize: 19, marginBottom: 2}}>{selectedMapProduct.desc}</div>
                  <div style={{color: "#555", fontSize: 15, marginBottom: 6}}>
                    <Link to={`/isletme/${businessSlugs[selectedMapProduct.name] || ""}`} style={{color:"#2184c4", fontWeight:"600"}}>
                      {selectedMapProduct.name}
                    </Link>
                  </div>
                  <div style={{color: "#0980d6", fontWeight: 500, fontSize: 15, marginBottom: 6}}>
                    {(selectedMapProduct.distance / 1000).toFixed(1)} km
                  </div>
                  <div style={{fontWeight: 600, fontSize: 17, marginBottom: 9}}>₺{selectedMapProduct.price}</div>
                  <button
                    style={{
                      padding: "8px 20px",
                      background: "#0980d6",
                      color: "#fff",
                      borderRadius: 9,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${selectedMapProduct.lat},${selectedMapProduct.lng}`,
                        "_blank"
                      )
                    }
                  >
                    Yol Tarifi Al
                  </button>
                </div>
              )}
            </>
          ) : (
            <div>Harita yükleniyor...</div>
          )}
        </div>
      )}

      {/* Liste Detay Modalı (ürün kutucuğuna tıklayınca açılır) */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-xs relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setSelectedProduct(null)}
            >✕</button>
            <div className="flex flex-col items-center gap-2">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-16 h-16 object-contain mb-2" />
              <div className="text-lg font-bold">{selectedProduct.desc}</div>
              <div className="text-md text-gray-600">{selectedProduct.name}</div>
              <div className="font-semibold text-blue-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="16" height="16">
                  <path
                    d="M20 3C12.268 3 6 9.268 6 17c0 8.351 11.515 17.21 12.008 17.591a2 2 0 0 0 2.484 0C22.485 34.21 34 25.351 34 17c0-7.732-6.268-14-14-14zm0 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
                    fill="#4fc3f7"
                  />
                  <circle cx="20" cy="17" r="4" fill="#fff"/>
                </svg>
                {(selectedProduct.distance / 1000).toFixed(1)} km
              </div>
              <div className="font-semibold text-gray-700">₺{selectedProduct.price}</div>
            </div>
            <button
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${selectedProduct.lat},${selectedProduct.lng}`,
                  "_blank"
                );
              }}
            >
              Yol Tarifi Al
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
