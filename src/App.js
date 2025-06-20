import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';
import logo from "./yakınındabul-logo.png";
import SearchMap from "./components/SearchMap";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import BusinessLoginModal from "./components/BusinessLoginModal";
import BusinessRegisterModal from "./components/BusinessRegisterModal";
import UserProfileMenu from "./components/UserProfileMenu";
import BusinessPanelHeader from "./components/BusinessPanelHeader";
import SettingsModal from "./components/SettingsModal";
import BusinessPanel from "./components/business-panel";
import AddProduct from "./components/AddProduct";
import ProductsList from "./components/ProductsList";
import PublicBusinessPage from "./components/PublicBusinessPage";
import { Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import BusinessStoreDesign from "./components/BusinessStoreDesign";
// Admin paneli dosyalarının importu
import AdminDashboard from "./AdminDashboard";
import ProductApproval from "./ProductApproval";
import Complaints from "./Complaints";
import Businesses from "./Businesses";
import AdminSettings from "./AdminSettings";
import AdminLogin from "./AdminLogin";

// Route koruma (private route) component'i:
function isAdminLoggedIn() {
  // Basit bir örnek: localStorage'da 'admin_token' varsa girişli kabul edilir
  return !!localStorage.getItem("admin_token");
}

function RequireAdmin({ children }) {
  return isAdminLoggedIn() ? children : <Navigate to="/admin/login" />;
}

function AppContent() {
    const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [businessLoginOpen, setBusinessLoginOpen] = useState(false);
  const [businessRegisterOpen, setBusinessRegisterOpen] = useState(false);
  const [loginUserType, setLoginUserType] = useState("kullanici");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInBusiness, setLoggedInBusiness] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const businessData = localStorage.getItem("business");
    if (userData) setLoggedInUser(JSON.parse(userData));
    if (businessData) setLoggedInBusiness(JSON.parse(businessData));
  }, []);

  const handleLogout = () => {
  if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
      setLoggedInUser(null);
      setLoggedInBusiness(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("business");
     navigate("/"); // anasayfaya yönlendir
}
  };

  const handleLoginClick = (type) => {
    setLoginUserType(type);
    if (type === "kullanici") setLoginModalOpen(true);
    else if (type === "isletme") setBusinessLoginOpen(true);
  };

  const handleRegisterClick = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleFavorites = () => alert("Favorilerim özelliği eklenebilir!");
  const handleNotifications = () => alert("Bildirimler özelliği eklenebilir!");

  // HEADER (her zaman üstte)
  const renderHeader = () => {
    if (
      loggedInBusiness &&
      (location.pathname.startsWith("/business-panel") ||
        location.pathname.startsWith("/urun-ekle"))
    ) {
      return (
        <BusinessPanelHeader
          businessName={loggedInBusiness.business_name}
          onLogout={handleLogout}
          onSettings={() => setSettingsOpen(true)}
          onNotifications={handleNotifications}
          onFavorites={handleFavorites}
        />
      );
    }
    if (loggedInUser) {
      return (
        <header className="header-main">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="YakınındaBul Logo" className="header-logo" />
          </Link>
          <div className="header-btns">
            <UserProfileMenu
              userName={loggedInUser.full_name}
              onLogout={handleLogout}
              onFavorites={handleFavorites}
              onSettings={() => setSettingsOpen(true)}
              onNotifications={handleNotifications}
            />
            {settingsOpen && (
              <SettingsModal
                user={loggedInUser}
                onSave={(updatedUser) => setLoggedInUser(updatedUser)}
                onPasswordChange={() => {}}
                onClose={() => setSettingsOpen(false)}
              />
            )}
          </div>
        </header>
      );
    }
    return (
      <header className="header-main">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="YakınındaBul Logo" className="header-logo" />
        </Link>
        <div className="header-btns">
          <button className="header-btn" onClick={() => handleLoginClick("kullanici")}>
            Kullanıcı Girişi
          </button>
          <button className="header-btn blue" onClick={() => handleLoginClick("isletme")}>
            İşletme Girişi
          </button>
        </div>
      </header>
    );
  };

  return (
    <div className="main-bg">
      {renderHeader()}

      {/* Modals */}
      <BusinessLoginModal
        open={businessLoginOpen}
        onClose={() => setBusinessLoginOpen(false)}
        onRegisterClick={() => {
          setBusinessLoginOpen(false);
          setBusinessRegisterOpen(true);
        }}
        onLoginSuccess={(business) => {
          setLoggedInBusiness(business);
          localStorage.setItem("business", JSON.stringify(business));
        }}
      />
      <BusinessRegisterModal
        open={businessRegisterOpen}
        onClose={() => setBusinessRegisterOpen(false)}
        onLoginClick={() => {
          setBusinessRegisterOpen(false);
          setBusinessLoginOpen(true);
        }}
      />
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        userType={loginUserType}
        onRegisterClick={handleRegisterClick}
        onLoginSuccess={(user) => {
          setLoggedInUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        }}
      />
      <RegisterModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <main className="w-full min-h-[calc(100vh-64px)] bg-gray-50">
        <Routes>
          <Route path="/" element={<SearchMap />} />
                 <Route path="/business-panel/design" element={<BusinessStoreDesign />} />
          <Route path="/business-panel" element={<PublicBusinessPage isOwner={true} />} />
          <Route path="/urun-ekle" element={<AddProduct />} />
          <Route path="/business-panel/products" element={<ProductsList />} />
          <Route path="/isletme/:slug" element={<PublicBusinessPage />} />
          <Route path="/search" element={<SearchPage />} />
          
          {/* === ADMIN PANEL ROUTES === */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/urun-onayi"
            element={
              <RequireAdmin>
                <ProductApproval />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/sikayetler"
            element={
              <RequireAdmin>
                <Complaints />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/isletmeler"
            element={
              <RequireAdmin>
                <Businesses />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/ayarlar"
            element={
              <RequireAdmin>
                <AdminSettings />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
