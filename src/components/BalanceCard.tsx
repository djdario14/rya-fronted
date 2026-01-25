import React from "react";
import "./BalanceCard.css";

export default function BalanceCard({ balance, loan, installments, delayDays }: {
  balance: string;
  loan: string;
  installments: string;
  delayDays: string;
}) {
  return (
    <div className="balance-card">
      <div className="balance-label">Saldo pendiente</div>
      <div className="balance-amount">{balance}</div>
      <div className="balance-metrics">
        <div>
          <span className="metric-label">Préstamo</span>
          <div className="metric-value">{loan}</div>
        </div>
        <div>
          <span className="metric-label">Cuotas</span>
          <div className="metric-value">{installments}</div>
        </div>
        <div>
          <span className="metric-label">Atraso</span>
          <div className="metric-value delay">{delayDays}</div>
        </div>
      </div>
    </div>
  );
}
