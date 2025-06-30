import React, { useState, useEffect } from "react";
import "./App.css";

// Routing is done manually for simplicity due to minimal dependencies.
// All pages/components are lazy loaded as local imports.
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./pages/DashboardLayout";
import UploadPage from "./pages/UploadPage";
import GalleryPage from "./pages/GalleryPage";
import useAuth from "./hooks/useAuth";

import "./pages/DashboardLayout.css";
import "./pages/GalleryPage.css";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [sidebarKey, setSidebarKey] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);

  const { user, token, logout } = useAuth();

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync login state
  useEffect(() => {
    setLoggedIn(!!user && !!token);
  }, [user, token]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Navigation for sidebar (and logout)
  function handleNavigate(key) {
    if (key === "logout") {
      logout();
      setSidebarKey("dashboard");
      setLoggedIn(false);
    } else {
      setSidebarKey(key);
    }
  }

  // Auth flow
  if (!loggedIn) {
    return (
      <div className="App">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <AuthPage onAuthSuccess={() => setLoggedIn(true)} />
      </div>
    );
  }

  // Dashboard: sidebar + main content (upload, gallery, etc)
  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <DashboardLayout
        onNavigate={handleNavigate}
        active={sidebarKey}
        user={user}
      >
        {/* Simple content routing based on sidebarKey */}
        {sidebarKey === "dashboard" && (
          <section>
            <h2>Welcome to ImageFusion</h2>
            <p>
              Upload, process, and manage your images.<br />
              Use the sidebar to navigate between Dashboard, Upload, and Gallery.
            </p>
          </section>
        )}
        {sidebarKey === "upload" && (
          <UploadPage
            token={token}
            onUploadSuccess={() => setSidebarKey("gallery")}
          />
        )}
        {sidebarKey === "gallery" && <GalleryPage token={token} />}
      </DashboardLayout>
    </div>
  );
}

export default App;
