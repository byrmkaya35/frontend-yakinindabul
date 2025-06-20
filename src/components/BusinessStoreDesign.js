// BusinessStoreDesign.js
import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
const containerStyle = {
  width: "100%",
  height: "240px",
  borderRadius: "16px",
  marginTop: "12px",
};

export default function BusinessStoreDesign() {
    const navigate = useNavigate();
  const handleSave = () => {
  // ... işlemler ...
  navigate("/business-panel");
};
  const [cover, setCover] = useState("/default-cover.jpg");
  const [logo, setLogo] = useState("/default-logo.png");
  const [phone, setPhone] = useState("0555 123 45 67");
  const [whatsapp, setWhatsapp] = useState("0555 123 45 67");
  const [location, setLocation] = useState({ lat: 38.4192, lng: 27.1287 });
  const [locationLocked, setLocationLocked] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "cover") setCover(url);
    else if (type === "logo") setLogo(url);
  };

  const handleMapClick = (e) => {
    if (!locationLocked) {
      setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setLocationLocked(true);
      // Burada backend'e kaydedilecek!
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-5 mt-4">
      {/* Kapak + logo */}
      <div className="relative">
        <img src={cover} alt="Kapak" className="w-full h-36 rounded-t-xl object-cover" />
        <input
          type="file"
          accept="image/*"
          className="absolute top-3 right-3"
          onChange={e => handleFileChange(e, "cover")}
          style={{ zIndex: 2, background: "#fff", borderRadius: 6, fontSize: 12, padding: "2px 7px" }}
        />
        <img src={logo} alt="Logo" className="absolute left-5 bottom-[-24px] w-16 h-16 rounded-full shadow border-2 border-white bg-white object-cover" />
        <input
          type="file"
          accept="image/*"
          className="absolute left-24 bottom-[-18px] w-16"
          onChange={e => handleFileChange(e, "logo")}
          style={{ zIndex: 2, fontSize: 10 }}
        />
      </div>
      <div className="pt-9 pb-2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-bold text-xl text-gray-800 mb-2">İşletme Adı</div>
          <div className="flex gap-4 mb-1">
            <button className="bg-blue-100 text-blue-800 rounded px-3 py-1 text-sm" onClick={() => window.open(`tel:${phone.replace(/\s/g,"")}`)}>
              Telefon
            </button>
            <button className="bg-green-100 text-green-800 rounded px-3 py-1 text-sm" onClick={() => window.open(`https://wa.me/90${whatsapp.replace(/\D/g,"")}`)}>
              WhatsApp
            </button>
          </div>
        </div>
        <div className="mt-2 md:mt-0">
          <label className="block text-sm mb-1 font-semibold">Telefon:</label>
          <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          <label className="block text-sm mt-2 mb-1 font-semibold">WhatsApp:</label>
          <input type="text" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} className="border rounded px-2 py-1 text-sm" />
        </div>
      </div>
      {/* Harita */}
      <div className="mb-4">
        <label className="font-semibold text-sm">Mağaza Konumu:</label>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={14}
            onClick={handleMapClick}
          >
            <Marker position={location} />
          </GoogleMap>
        )}
        {!locationLocked && (
          <div className="text-xs mt-2 text-red-500">
            Konumunuzu bir defa seçebilirsiniz. Daha sonra değişiklik için admin onayı gerekecek.
          </div>
        )}
      </div>
              <button
  className="mt-6 bg-blue-600 text-white rounded px-5 py-2 hover:bg-blue-700 transition w-full font-bold"
  onClick={handleSave}
  type="button"
>
  Kaydet
</button>
    </div>
  );
}