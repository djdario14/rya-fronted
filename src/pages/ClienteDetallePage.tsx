

import React from "react";
import "../styles/cliente-detalle.css";

export default function ClienteDetallePage() {
  return (
    <div className="cliente-page">
      {/* Header */}
      <header className="cliente-header">
        <button className="back-btn">←</button>

        <div className="cliente-header-info">
          <div className="avatar">👤</div>

          <div className="cliente-text">
            <h2>Orrala</h2>
            <p>Cédula: 24512265</p>
            <p>Tel: 213551147</p>
          </div>
        </div>

        <button className="map-btn">📍 Ver mapa</button>
      </header>

      {/* Card principal */}
      <section className="saldo-card">
        <span className="label">Saldo</span>
        <h1>$155.00</h1>

        <div className="stats">
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

      {/* Acciones */}
      <section className="acciones">
        <button className="btn primary">＋ ABONAR</button>
        <button className="btn secondary">📅 AGENDAR VISITA</button>
        <button className="btn outline">💬 ENVIAR MENSAJE</button>
      </section>
    </div>
  );
}
