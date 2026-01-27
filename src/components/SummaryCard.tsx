import React, { ReactNode } from "react";
import "./SummaryCard.css";

type SummaryCardProps = {
  title: string;
  value: string;
  accentColor: string;
  icon?: ReactNode;
  onClick?: () => void;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  accentColor,
  icon,
  onClick,
}) => {
  if (title === "Clientes con abono") {
    return (
      <div className="summary-card clientes-con-abono-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="clientes-con-abono-header" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span className="clientes-con-abono-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#F3F4F6"/>
              <path d="M8 15C8 13.3431 9.34315 12 11 12H13C14.6569 12 16 13.3431 16 15V16C16 16.5523 15.5523 17 15 17H9C8.44772 17 8 16.5523 8 16V15Z" fill="#6366F1"/>
              <circle cx="10" cy="10" r="2" fill="#6366F1"/>
              <circle cx="14" cy="10" r="2" fill="#6366F1"/>
            </svg>
          </span>
          <span className="clientes-con-abono-title" style={{ fontWeight: 600, fontSize: 16, color: '#222', letterSpacing: '-0.5px' }}>Clientes con abono</span>
        </div>
        <div className="clientes-con-abono-value" style={{ color: '#6366F1', fontWeight: 700, fontSize: 22, marginTop: 6, marginBottom: 2, letterSpacing: '-1px' }}>{value}</div>
        <div className="clientes-con-abono-bg">
          <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30 Q 50 35 100 28 T 200 30 V40 H0Z" fill="#6366F111" />
            <path d="M0 35 Q 50 38 100 32 T 200 35" stroke="#6366F122" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    );
  }
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
  if (title === "Clientes nuevos") {
    return (
      <div className="summary-card clientes-nuevos-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="clientes-nuevos-header">
          <span className="clientes-nuevos-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#EEF2FF"/>
              <text x="12" y="16" textAnchor="middle" fontSize="13" fill="#6366F1" fontWeight="bold">🆕</text>
            </svg>
          </span>
          <span className="clientes-nuevos-title">Clientes nuevos</span>
        </div>
        <div className="clientes-nuevos-value" style={{ color: accentColor }}>{value}</div>
        <div className="clientes-nuevos-bg">
          <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30 Q 50 35 100 28 T 200 30 V40 H0Z" fill="#6366F111" />
            <path d="M0 35 Q 50 38 100 32 T 200 35" stroke="#6366F122" strokeWidth="2" fill="none" />
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
  if (title === "Total por cobrar") {
    return (
      <div className="summary-card total-por-cobrar-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="total-por-cobrar-header" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span className="total-por-cobrar-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#E6F9F0"/>
              <path d="M7 16C7 13.7909 8.79086 12 11 12H13C15.2091 12 17 13.7909 17 16V17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17V16Z" fill="#4CAF7A"/>
              <circle cx="12" cy="10" r="2" fill="#FFD600" stroke="#4CAF7A" strokeWidth="1.2"/>
              <path d="M12 13V15" stroke="#FFD600" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="total-por-cobrar-title" style={{
            fontWeight: 600,
            fontSize: 16,
            color: '#222',
            letterSpacing: '-0.5px',
          }}>Total por cobrar</span>
        </div>
        <div className="total-por-cobrar-value" style={{
          color: accentColor,
          fontWeight: 700,
          fontSize: 28,
          marginTop: 6,
          marginBottom: 2,
          letterSpacing: '-1px',
        }}>{value}</div>
        <div className="total-por-cobrar-bg">
          <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30 Q 50 35 100 28 T 200 30 V40 H0Z" fill="#4CAF7A11" />
            <path d="M0 35 Q 50 38 100 32 T 200 35" stroke="#4CAF7A22" strokeWidth="2" fill="none" />
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

export default SummaryCard;
