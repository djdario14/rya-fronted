import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarMenuProps {
  open: boolean;
  onClose: () => void;
  onEnrutarClientes?: () => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ open, onClose, onEnrutarClientes }) => {
  const navigate = useNavigate();
  // Puedes ajustar las rutas según la estructura real
  const handleEnrutarClientes = () => {
    if (typeof onEnrutarClientes === 'function') {
      onEnrutarClientes();
    } else {
      onClose();
    }
  };
  const handleRegistrarGasto = () => {
    onClose();
    navigate('/registrar-gasto');
  };
  const handleCambiarTema = () => {
    onClose();
    // Aquí podrías alternar el tema si tienes soporte para ello
  };
  const handleSalir = () => {
    onClose();
    // Aquí podrías limpiar sesión o navegar a login
    // navigate('/login');
  };
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: open ? 280 : 0,
        height: '100vh',
        background: '#fff',
        color: '#222',
        boxShadow: open ? '2px 0 16px #0002' : 'none',
        zIndex: 2000,
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        padding: open ? '32px 0 0 0' : '0',
        borderRight: open ? '1.5px solid #e0e0e0' : 'none',
      }}
    >
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#888',
          fontSize: 28,
          alignSelf: 'flex-end',
          margin: '0 18px 12px 0',
          cursor: 'pointer',
        }}
        title="Cerrar menú"
        aria-label="Cerrar menú"
      >
        ×
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '0 32px' }}>
        <button onClick={handleEnrutarClientes} style={{ background: '#f3f0ff', border: '1.5px solid #e0e0e0', color: '#7c3aed', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 0', borderRadius: 10, boxShadow: '0 1px 4px #7c3aed11' }}>
          <span role="img" aria-label="mapa" style={{ fontSize: 22 }}>🗺️</span>
          Enrutar Clientes
        </button>
        <button onClick={handleRegistrarGasto} style={{ background: '#fff7ed', border: '1.5px solid #e0e0e0', color: '#ed8936', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 0', borderRadius: 10, boxShadow: '0 1px 4px #ed893611' }}>
          <span role="img" aria-label="gasto" style={{ fontSize: 22 }}>💸</span>
          Registrar Gasto
        </button>
        <button onClick={handleCambiarTema} style={{ background: '#fefcbf', border: '1.5px solid #e0e0e0', color: '#b7791f', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 0', borderRadius: 10, boxShadow: '0 1px 4px #ecc94b11' }}>
          <span role="img" aria-label="tema" style={{ fontSize: 22 }}>🌞</span>
          Cambiar tema
        </button>
        <button onClick={handleSalir} style={{ background: '#fff5f5', border: '1.5px solid #e0e0e0', color: '#e53e3e', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 0', borderRadius: 10, boxShadow: '0 1px 4px #e53e3e11' }}>
          <span role="img" aria-label="salir" style={{ fontSize: 22 }}>🚪</span>
          Salir
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
