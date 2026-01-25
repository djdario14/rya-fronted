import "./cliente-detalle.css";

export default function ClienteDetallePage() {
  return (
    <div className="cliente-page">
      {/* Header */}
      <header className="cliente-header">
        <button className="back-btn">←</button>

        <div className="cliente-header-info">
          <div className="avatar">👤</div>

          <div className="cliente-text">
            <h2>Mariuxi Martínez</h2>
            <p>Cédula: 0954681322</p>
            <p>Tel: 0994823848</p>
          </div>
        </div>

        <button className="map-btn">📍 Ver mapa</button>
      </header>

      {/* Card principal */}
      <section className="saldo-card">
        <span className="label">Saldo Pendiente</span>
        <h1>$360.00</h1>

        <div className="stats">
          <div>
            <span>Préstamo</span>
            <strong>$300</strong>
          </div>
          <div>
            <span>Cuotas</span>
            <strong>6 / 12</strong>
          </div>
          <div>
            <span>Atraso</span>
            <strong>45 días</strong>
          </div>
        </div>
      </section>

      {/* Acciones */}
      <section className="acciones">
        <button className="btn primary">＋ ABONAR</button>
        <button className="btn secondary">📅 AGENDAR VISITA</button>
        <button className="btn outline">💬 ENVIAR MENSAJE</button>
        <button className="btn outline">📝 Nuevo Crédito</button>
      </section>

      {/* Dirección */}
      <section className="saldo-card" style={{marginTop: 20}}>
        <span className="label">Dirección</span>
        <div style={{fontSize: 15, marginTop: 6}}>Calle 14 y Av. la Garzota, Guayaquil</div>
      </section>
    </div>
  );
}
