import React from "react";
import "./ClientHeaderCard.css";

export default function ClientHeaderCard({ name, id, phone, onMapTap }: {
  name: string;
  id: string;
  phone: string;
  onMapTap?: () => void;
}) {
  return (
    <div className="client-header-card">
      <div className="client-header-row">
        <div className="client-avatar"><span role="img" aria-label="avatar">👤</span></div>
        <div className="client-header-info">
          <div className="client-name">{name}</div>
          <div className="client-meta">Cédula: {id}</div>
          <div className="client-meta">Tel: {phone}</div>
        </div>
        <button className="map-btn" onClick={onMapTap}>📍 Ver mapa</button>
      </div>
    </div>
  );
}
