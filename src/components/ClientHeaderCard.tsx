import React from "react";
import "./ClientHeaderCard.css";

export default function ClientHeaderCard({ name, id, phone, onMapTap, onEdit }: {
  name: string;
  id: string;
  phone: string;
  onMapTap?: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="client-header-card">
      <div className="client-header-row">
        <div className="client-avatar"><span role="img" aria-label="avatar">👤</span></div>
        <div className="client-header-info">
          <div className="client-name" style={{display:'flex',alignItems:'center',gap:8}}>
            {name}
            <button
              className="edit-btn"
              title="Editar cliente"
              style={{background:'none',border:'none',padding:0,margin:0,cursor:'pointer',fontSize:'22px',lineHeight:1}}
              onClick={e => { e.stopPropagation(); onEdit && onEdit(); }}
            >
                <span role="img" aria-label="Editar" style={{fontSize:'0.85em'}}>✏️</span>
            </button>
          </div>
          <div className="client-meta">Cédula: {id}</div>
          <div className="client-meta">Tel: {phone}</div>
        </div>
        <button className="map-btn" onClick={onMapTap}>📍 Ver mapa</button>
      </div>
    </div>
  );
}
