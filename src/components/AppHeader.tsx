import React from "react";
import "./AppHeader.css";

export default function AppHeader({ title, date, avatar }: { title: string; date: string; avatar: React.ReactNode }) {
  return (
    <header className="app-header">
      <button className="menu-btn">☰</button>
      <div>
        <div className="header-title">{title}</div>
        <div className="header-date">{date}</div>
      </div>
      <div className="header-avatar">{avatar}</div>
    </header>
  );
}
