import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar.jsx";
import Topbar from "./Topbar/Topbar.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="admin-shell">
      <Sidebar mobileMenuOpen={mobileMenuOpen} onNavigate={() => setMobileMenuOpen(false)} />
      {mobileMenuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}
      <div className="admin-main">
        <Topbar onMenuClick={() => setMobileMenuOpen((open) => !open)} />
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}
