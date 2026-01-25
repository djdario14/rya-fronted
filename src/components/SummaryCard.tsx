import React from "react";
import "./SummaryCard.css";

export default function SummaryCard({
  title,
  value,
  accentColor,
  icon,
  onClick,
}: {
  title: string;
  value: string;
  accentColor: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  // Card especial para "Cobrado hoy"
  if (title === "Cobrado hoy") {
    return (
      <div className="summary-card cobrador-hoy-card">
        <div className="cobrado-hoy-header">
          <span className="cobrado-hoy-icon">✔️</span>
          <span className="cobrado-hoy-title">Cobrado hoy</span>
        </div>
        <div className="cobrado-hoy-value">{value}</div>
        <div className="cobrado-hoy-bg">
          <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30 Q 50 10 100 30 T 200 30 V40 H0Z" fill="#22C55E11" />
            <path d="M0 35 Q 50 20 100 35 T 200 35" stroke="#22C55E22" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    );
  }
  // Card genérico
  return (
    <div
      className="summary-card"
      style={{ borderLeft: `4px solid ${accentColor}` }}
      onClick={onClick}
    >
      <div className="sc-label">{icon} {title}</div>
      <div className="sc-value" style={{ color: accentColor }}>{value}</div>
    </div>
  );
}
