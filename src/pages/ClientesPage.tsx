import React, { useState } from 'react';
import { useEffect } from 'react';

const mockClientes = [
  { nombre: 'Orrala', saldo: 155, atraso: 0 },
  { nombre: 'Juan', saldo: 120, atraso: 0 },
  { nombre: 'Alberto', saldo: 240, atraso: 0 },
  { nombre: 'Alberto', saldo: 240, atraso: 0 },
];

const ClientesPage: React.FC = () => {
  const [tab, setTab] = useState<'pendientes' | 'todos'>('pendientes');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Cargar fuente Inter de Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.fontFamily = 'Inter, sans-serif';
    return () => {
      document.body.style.fontFamily = '';
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #0002', width: 900, maxWidth: '100%', padding: 36, transition: 'box-shadow 0.3s', border: '1px solid #f0f0f0' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          <button style={{ background: 'none', border: 'none', fontSize: 28, marginRight: 18, cursor: 'pointer', color: '#888', transition: 'color 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.color = '#219653')}
            onMouseOut={e => (e.currentTarget.style.color = '#888')}
          >
            <span role="img" aria-label="menu">☰</span>
          </button>
          <input
            type="text"
            placeholder="Buscar cliente"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '12px 24px', borderRadius: 10, border: '1px solid #e0e0e0', fontSize: 18, background: '#f7f8fa', boxShadow: '0 2px 8px #0001', outline: 'none', fontFamily: 'inherit', marginRight: 10 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 28 }}>
            <span style={{ fontSize: 24, marginRight: 18, color: '#bbb', transition: 'color 0.2s', cursor: 'pointer' }}
              onMouseOver={e => (e.currentTarget.style.color = '#219653')}
              onMouseOut={e => (e.currentTarget.style.color = '#bbb')}
            >🔔</span>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 20, padding: '6px 16px', border: '1px solid #eee', boxShadow: '0 2px 8px #0001', fontFamily: 'inherit' }}>
              <span style={{ fontSize: 24, marginRight: 8 }}>👤</span>
              <span style={{ fontWeight: 600, color: '#444', marginRight: 8 }}>Usuario</span>
              <span style={{ background: '#e74c3c', color: '#fff', borderRadius: '50%', fontSize: 13, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>1</span>
            </div>
          </div>
        </div>

        {/* Título y botón agregar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: '-1px' }}>Clientes</h2>
          <button style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 36px', fontWeight: 600, fontSize: 19, cursor: 'pointer', boxShadow: '0 2px 12px #21965322', transition: 'background 0.2s, box-shadow 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = '#176c3a'; e.currentTarget.style.boxShadow = '0 4px 16px #176c3a33'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#219653'; e.currentTarget.style.boxShadow = '0 2px 12px #21965322'; }}
          >
            + Agregar Cliente
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <button
            onClick={() => setTab('pendientes')}
            style={{
              background: tab === 'pendientes' ? '#219653' : '#e9ecef',
              color: tab === 'pendientes' ? '#fff' : '#888',
              fontWeight: 700,
              fontSize: 17,
              border: 'none',
              borderRadius: 8,
              padding: '10px 32px',
              boxShadow: tab === 'pendientes' ? '0 2px 8px #21965322' : 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { if (tab !== 'pendientes') e.currentTarget.style.background = '#d1e7dd'; }}
            onMouseOut={e => { if (tab !== 'pendientes') e.currentTarget.style.background = '#e9ecef'; }}
          >
            Pendientes
          </button>
          <button
            onClick={() => setTab('todos')}
            style={{
              background: tab === 'todos' ? '#219653' : '#e9ecef',
              color: tab === 'todos' ? '#fff' : '#888',
              fontWeight: 700,
              fontSize: 17,
              border: 'none',
              borderRadius: 8,
              padding: '10px 32px',
              boxShadow: tab === 'todos' ? '0 2px 8px #21965322' : 'none',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { if (tab !== 'todos') e.currentTarget.style.background = '#d1e7dd'; }}
            onMouseOut={e => { if (tab !== 'todos') e.currentTarget.style.background = '#e9ecef'; }}
          >
            Todos
          </button>
        </div>

        {/* Lista de clientes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {mockClientes.map((cliente, idx) => (
            <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: '24px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, transition: 'box-shadow 0.2s, transform 0.2s', animation: 'fadeIn 0.7s', border: '1px solid #f0f0f0' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 32px #21965322'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = '0 4px 24px #0002'; e.currentTarget.style.transform = 'none'; }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 23, marginBottom: 6, letterSpacing: '-0.5px' }}>{cliente.nombre}</div>
                <div style={{ color: '#444', fontSize: 17 }}>
                  Saldo: <span style={{ color: '#219653', fontWeight: 700, fontSize: 18 }}>${cliente.saldo}</span>
                  <span style={{ margin: '0 12px' }}>|</span>
                  Atraso: <span style={{ color: '#888', fontWeight: 500 }}>{cliente.atraso} días</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <button style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px #21965322', transition: 'background 0.2s, box-shadow 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#176c3a'; e.currentTarget.style.boxShadow = '0 4px 16px #176c3a33'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#219653'; e.currentTarget.style.boxShadow = '0 2px 8px #21965322'; }}
                >
                  Abonar
                </button>
                <button style={{ background: '#e9ecef', color: '#444', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 17, cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#d1e7dd'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#e9ecef'; }}
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Animación fadeIn */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ClientesPage;
