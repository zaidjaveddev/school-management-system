import {
  AppstoreOutlined,
  CarOutlined,
  LogoutOutlined,
  ReadOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Button, Menu, Popconfirm } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { endAdminSession } from "../../../utils/auth.js";
import "./Sidebar.css";

const navItems = [
  { key: "/dashboard", label: "Overview", icon: <AppstoreOutlined /> },
  { key: "/schools", label: "Schools", icon: <ShopOutlined /> },
  { key: "/teachers", label: "Teachers", icon: <ReadOutlined /> },
  { key: "/drivers", label: "Drivers", icon: <CarOutlined /> },
];

export default function Sidebar({ mobileMenuOpen, onNavigate }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selected = pathname.startsWith("/schools")
    ? "/schools"
    : pathname.startsWith("/teachers")
      ? "/teachers"
      : pathname.startsWith("/drivers")
        ? "/drivers"
        : "/dashboard";

  const logout = () => {
    endAdminSession();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`app-sidebar ${mobileMenuOpen ? "is-open" : ""}`}
      aria-label="Main sidebar"
    >
      <a
        className="sidebar-brand"
        href="/dashboard"
        onClick={(event) => {
          event.preventDefault();
          navigate("/dashboard");
          onNavigate();
        }}
      >
        <span className="brand-mark">
          S<span>+</span>
        </span>
        <span>
          <strong>Scholarly</strong>
          <small>ADMIN CONSOLE</small>
        </span>
      </a>
      <div className="sidebar-label">WORKSPACE</div>
      <Menu
        className="sidebar-menu"
        mode="inline"
        selectedKeys={[selected]}
        items={navItems.map((item) => ({
          ...item,
          onClick: () => {
            navigate(item.key);
            onNavigate();
          },
        }))}
      />
      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <span className="help-icon">✦</span>
          <strong>Need a hand?</strong>
          <p>Manage your school network from one place.</p>
        </div>
        <Popconfirm
          title="Log out of Scholarly?"
          okText="Log out"
          cancelText="Stay"
          onConfirm={logout}
          placement="topLeft"
        >
          <Button
            className="sidebar-logout"
            type="text"
            icon={<LogoutOutlined />}
          >
            Sign out
          </Button>
        </Popconfirm>
        <div className="sidebar-version">SCHOOL MANAGEMENT · V1.0</div>
      </div>
    </aside>
  );
}

