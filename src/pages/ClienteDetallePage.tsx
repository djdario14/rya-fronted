

import React from "react";
import "../styles/clienteDetalle.css";

export default function ClienteDetallePage() {
  return (
    <div className="client-page">
      <header className="client-header">
        <button className="back-btn">←</button>

        <div className="client-info">
          <div className="avatar">👤</div>

          <div>
            <h2>orrala</h2>
            <p>Cédula: 24512265</p>
            <p>Tel: 213551147</p>
          </div>
        </div>

        <button className="map-btn">📍 Ver mapa</button>
      </header>

      <section className="balance-card">
        <p className="label">Saldo</p>
        <h1 className="amount">$155.00</h1>

        <div className="balance-stats">
          <div>
            <span>Préstamo</span>
            <strong>$150</strong>
          </div>
          <div>
            <span>Cuotas</span>
            <strong>5 / 30</strong>
          </div>
          <div>
            <span>Atraso</span>
            <strong>$0</strong>
          </div>
        </div>
      </section>

      <button className="btn-primary">＋ ABONAR</button>
      <button className="btn-secondary">📅 AGENDAR VISITA</button>
      <button className="btn-outline">💬 ENVIAR MENSAJE</button>

    </div>
  );
}
