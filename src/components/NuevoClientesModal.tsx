import React from 'react';

interface Cliente {
  id: number;
  nombre: string;
  creado_en: string;
  // Agrega otros campos relevantes si es necesario
}

interface NuevoClientesModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientes: Cliente[];
}

const NuevoClientesModal: React.FC<NuevoClientesModalProps> = ({ isOpen, onClose, clientes }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Clientes nuevos de hoy</h2>
        <button onClick={onClose} className="close-btn">Cerrar</button>
        <ul>
          {clientes.length === 0 ? (
            <li>No hay clientes nuevos hoy.</li>
          ) : (
            clientes.map(cliente => (
              <li key={cliente.id}>
                <strong>{cliente.nombre}</strong> (ID: {cliente.id})<br />
                Registrado: {new Date(cliente.creado_en).toLocaleString()}
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
        }
        .close-btn {
          float: right;
          background: #6366F1;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default NuevoClientesModal;
