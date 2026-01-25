import React from "react";
import "./MainBalanceCard.css";

export default function MainBalanceCard({ label, amount, today }: { label: string; amount: string; today?: string }) {
  return (
    <div className="main-balance-card modern-balance-card">
      <div className="mbc-content">
        <div className="mbc-label">{label}</div>
        <div className="mbc-amount">{amount}</div>
        {today && <div className="mbc-today"><span className="mbc-today-icon">+</span> <span className="mbc-today-value">{today}</span> <span className="mbc-today-text">hoy</span></div>}
      </div>
      <div className="mbc-bg">
        <svg width="100%" height="70" viewBox="0 0 400 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60 Q 80 30 160 50 Q 240 70 320 30 Q 360 10 400 40 V70 H0Z" fill="#22C55E11" />
          <path d="M0 55 Q 80 25 160 45 Q 240 65 320 25 Q 360 5 400 35" stroke="#22C55E55" strokeWidth="3" fill="none" />
          <circle cx="370" cy="18" r="6" fill="#22C55E33" />
          <circle cx="320" cy="25" r="4" fill="#22C55E22" />
        </svg>
      </div>
    </div>
  );
}
