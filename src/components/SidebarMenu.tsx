// Cambio mínimo para forzar redeploy
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarMenuProps {
  open: boolean;
  onClose: () => void;
  onEnrutarClientes?: () => void;
}

// Estilo base para los botones del menú
const menuBtnStyle: React.CSSProperties = {
  background: '#fff',
  border: 'none',
  color: '#29487d',
  fontWeight: 600,
  fontSize: 17,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  padding: '12px 0 12px 8px',
  borderRadius: 10,
  boxShadow: '0 1px 4px #29487d11',
  marginBottom: 2,
  transition: 'background 0.2s',
};

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 24px' }}>
        <button onClick={() => { onClose(); navigate('/'); }} style={menuBtnStyle}>
          <span style={{ fontSize: 22 }}>🏠</span> Inicio
        </button>
        <button onClick={() => { onClose(); navigate('/reportes'); }} style={menuBtnStyle}>
          <span style={{ fontSize: 22 }}>📊</span> Reporte diario
        </button>
        <button onClick={() => { onClose(); navigate('/registrar-gasto'); }} style={menuBtnStyle}>
          <span style={{ fontSize: 22 }}>💸</span> Registrar gasto
        </button>
        <button onClick={() => { onClose(); navigate('/gps'); }} style={menuBtnStyle}>
          <span style={{ fontSize: 22 }}>🗺️</span> Mi Ruta
        </button>
        <button onClick={handleEnrutarClientes} style={menuBtnStyle}>
          <span style={{ fontSize: 22 }}>🧭</span> Enrutar clientes
        </button>
        <button onClick={() => { onClose(); navigate('/configuracion'); }} style={menuBtnStyle}>
          <span style={{ fontSize: 22 }}>⚙️</span> Configuración
        </button>
        <div style={{ flex: 1 }} />
        <button onClick={handleSalir} style={{ ...menuBtnStyle, background: '#f5f6fa', color: '#29487d', marginTop: 18 }}>
          <span style={{ fontSize: 22 }}>🔒</span> Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
