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
  if (title === "Gastos del día") {
    return (
      <div className="summary-card gastos-dia-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="gastos-dia-header">
          <span className="gastos-dia-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#FEECEC"/>
              <path d="M12 7V17" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M7 12L12 17L17 12" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="gastos-dia-title">Gastos del día</span>
        </div>
        <div className="gastos-dia-value">{value}</div>
        <div className="gastos-dia-bg">
          <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 35 Q 50 38 100 32 T 200 35 V40 H0Z" fill="#EF444411" />
            <path d="M0 38 Q 50 40 100 36 T 200 38" stroke="#EF444422" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    );
  }
  // Card especial para "Cobrado hoy"
  if (title === "Cobrado hoy") {
    return (
      <div className="summary-card cobrador-hoy-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
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

  if (title === "Prestado hoy") {
    return (
      <div className="summary-card prestado-hoy-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="prestado-hoy-header">
          <span className="prestado-hoy-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#E6F4FF"/>
              <path d="M7 15L15 7" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M9.5 7H15V12.5" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="prestado-hoy-title">Prestado hoy</span>
        </div>
        <div className="prestado-hoy-value">{value}</div>
        <div className="prestado-hoy-bg">
          <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30 Q 50 20 100 30 T 200 30 V40 H0Z" fill="#3B82F611" />
            <path d="M0 35 Q 50 28 100 35 T 200 35" stroke="#3B82F622" strokeWidth="2" fill="none" />
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
