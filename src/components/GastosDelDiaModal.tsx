import React from 'react';

interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
}

interface GastosDelDiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  gastos: Gasto[];
}

const GastosDelDiaModal: React.FC<GastosDelDiaModalProps> = ({ isOpen, onClose, gastos }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ color: '#222', maxHeight: '80vh', overflowY: 'auto' }}>
        <button onClick={onClose} className="close-btn" aria-label="Cerrar">×</button>
        <h2>Gastos del día</h2>
        <ul>
          {gastos.length === 0 ? (
            <li>No hay gastos registrados hoy.</li>
          ) : (
            gastos.map(gasto => (
              <li key={gasto.id} style={{marginBottom: '1em'}}>
                <div><strong>Descripción:</strong> {gasto.descripcion}</div>
                <div><strong>Monto:</strong> ${gasto.monto}</div>
                <div><strong>Fecha:</strong> {new Date(gasto.fecha).toLocaleString('es-EC', {
                  timeZone: 'America/Guayaquil',
                  year: '2-digit',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}</div>
              </li>
            ))
          )}
        </ul>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          min-width: 320px;
          max-width: 90vw;
          box-shadow: 0 2px 16px rgba(0,0,0,0.2);
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 12px;
          right: 16px;
          background: transparent;
          color: #EF4444;
          border: none;
          font-size: 2rem;
          font-weight: bold;
          cursor: pointer;
          line-height: 1;
        }
      `}</style>
    </div>
  );
};

export default GastosDelDiaModal;
