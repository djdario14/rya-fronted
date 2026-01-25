import React from "react";
import "./BalanceCard.css";

export default function BalanceCard({ balance, loan, installments, delayDays, date }: {
  balance: string;
  loan: string;
  installments: string;
  delayDays: string;
  date?: string;
}) {
  return (
    <div className="balance-card modern-balance-info-card">
      <div className="bc-row bc-row-top">
        <div className="bc-col bc-col-left">
          <div className="bc-label">SALDO PENDIENTE:</div>
          <div className="bc-balance">{balance}</div>
        </div>
        <div className="bc-col bc-col-right">
          <div className="bc-label bc-label-right">PRESTAMO REGISTRADO:</div>
          <div className="bc-date">{date}</div>
        </div>
      </div>
      <div className="bc-divider" />
      <div className="bc-row bc-row-bottom">
        <div className="bc-metric">
          <div className="bc-metric-label">Préstamo</div>
          <div className="bc-metric-value">{loan}</div>
        </div>
        <div className="bc-metric">
          <div className="bc-metric-label">Cuotas</div>
          <div className="bc-metric-value">{installments}</div>
        </div>
        <div className="bc-metric">
          <div className="bc-metric-label">Atraso</div>
          <div className="bc-metric-value bc-delay">{delayDays}</div>
        </div>
      </div>
    </div>
  );
}
