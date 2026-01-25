
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/clienteDetalle.css";

// Recibe datos por location.state o por props (ajustar según tu router)
export default function ClienteDetallePage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Puedes recibir el cliente por location.state o simular uno aquí:
  const cliente = location.state?.cliente || {
    nombre: "orrala",
    cedula: "24512265",
    telefono: "213551147",
    saldo: 155.0,
    prestamo: 150,
    cuotasPagadas: 5,
    cuotasTotal: 30,
    atraso: 0,
  };

  return (
    <div className="client-page">
      <header className="client-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div className="client-info">
          <div className="avatar">👤</div>
          <div>
            <h2>{cliente.nombre}</h2>
            <p>Cédula: <b>{cliente.cedula}</b></p>
            <p>Tel: <b>{cliente.telefono}</b></p>
          </div>
        </div>
        <button className="map-btn">📍 Ver mapa</button>
      </header>
      <section className="balance-card">
        <p className="label">Saldo</p>
        <h1 className="amount">${cliente.saldo?.toFixed(2)}</h1>
        <div className="balance-stats">
          <div>
            <span>Préstamo</span>
            <strong>${cliente.prestamo}</strong>
          </div>
          <div>
            <span>Cuotas</span>
            <strong>{cliente.cuotasPagadas} / {cliente.cuotasTotal}</strong>
          </div>
          <div>
            <span>Atraso</span>
            <strong>${cliente.atraso}</strong>
          </div>
        </div>
      </section>
      <button className="btn-primary">＋ ABONAR</button>
      <button className="btn-secondary">📅 AGENDAR VISITA</button>
      <button className="btn-outline">💬 ENVIAR MENSAJE</button>
    </div>
  );
}
