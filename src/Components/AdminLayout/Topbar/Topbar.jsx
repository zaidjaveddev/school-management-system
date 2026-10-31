import { MenuOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useLocation } from "react-router-dom";
import { getAdminAccount } from "../../../utils/auth.js";
import "./Topbar.css";

const pageInfo = {
  "/dashboard": ["Overview", "Here’s what’s happening across your schools."],
  "/schools": ["Schools", "Manage your school network and institution records."],
  "/teachers": ["Teachers", "Keep your teaching directory up to date."],
  "/drivers": ["Drivers", "Manage transport staff and driver records."],
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const [title, subtitle] = pageInfo[pathname] || pageInfo["/dashboard"];
  const user = getAdminAccount() || {};
  const initials = (user.name || "Admin").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-heading">
        <Button className="mobile-menu-button" type="text" icon={<MenuOutlined />} aria-label="Open menu" onClick={onMenuClick} />
        <div><h1>{title}</h1><p>{subtitle}</p></div>
      </div>
      <div className="topbar-actions">
        <span className="workspace-status"><i />Workspace active</span>
        <span className="topbar-divider" />
        <Avatar className="admin-avatar">{initials}</Avatar>
        <div className="admin-identity"><strong>{user.name || "Administrator"}</strong><span>School admin</span></div>
      </div>
    </header>
  );
}
