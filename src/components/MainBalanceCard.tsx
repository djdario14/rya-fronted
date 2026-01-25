import React from "react";
import "./MainBalanceCard.css";

export default function MainBalanceCard({ label, amount, today }: { label: string; amount: string; today?: string }) {
  return (
    <div className="main-balance-card">
      <div className="mb-label">{label}</div>
      <div className="mb-amount">{amount}</div>
      {today && <div className="mb-today">+ {today} hoy</div>}
    </div>
  );
}
