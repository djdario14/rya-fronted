import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RyaMenuIcon from "./RyaMenuIcon";
import "./AppHeader.css";

export default function AppHeader({ title, date, avatar }: { title: string; date: string; avatar: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Si estamos en /reportes, el botón navega a clientes
  const handleMenuClick = () => {
    if (location.pathname === "/reportes") {
      navigate("/");
    }
  };
  return (
    <header className="app-header">
      <button className="menu-btn" onClick={handleMenuClick} aria-label="Ir a clientes">
        <RyaMenuIcon size={48} />
      </button>
      <div>
        <div className="header-title">{title}</div>
        <div className="header-date">{date}</div>
      </div>
      <div className="header-avatar">{avatar}</div>
    </header>
  );
}
