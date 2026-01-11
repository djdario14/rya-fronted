import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Cliente } from '../../../packages/types/cliente';

const ClientesPage: React.FC = () => {
  const [tab, setTab] = useState<'pendientes' | 'todos'>('pendientes');
  const [search, setSearch] = useState('');
  const { data: clientes, loading, error } = useFetch<Cliente[]>('/clientes/');

  return (
    <div style={{ background: '#f5f6fa', minHeight: '100vh', padding: 24 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <button style={{ background: 'none', border: 'none', fontSize: 24, marginRight: 16, cursor: 'pointer' }}>
          <span role="img" aria-label="menu">☰</span>
        </button>
        <input
          type="text"
          placeholder="Buscar cliente"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16, background: '#fff' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 24 }}>
          <span style={{ fontSize: 22, marginRight: 16, color: '#888' }}>🔔</span>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f5f6fa', borderRadius: 20, padding: '4px 12px', border: '1px solid #eee' }}>
            <span style={{ fontSize: 22, marginRight: 6 }}>👤</span>
            <span style={{ fontWeight: 500, color: '#444' }}>Usuario</span>
            <span style={{ background: '#e74c3c', color: '#fff', borderRadius: '50%', fontSize: 12, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 6 }}>1</span>
          </div>
        </div>
      </div>

      {/* Título y botón agregar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Clientes</h2>
        <button style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #21965322' }}>
          + Agregar Cliente
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          onClick={() => setTab('pendientes')}
          style={{
            background: tab === 'pendientes' ? '#fff' : 'transparent',
            border: 'none',
            borderBottom: tab === 'pendientes' ? '3px solid #219653' : '3px solid transparent',
            color: tab === 'pendientes' ? '#222' : '#888',
            fontWeight: 600,
            fontSize: 16,
            padding: '8px 24px',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          Pendientes
        </button>
        <button
          onClick={() => setTab('todos')}
          style={{
            background: tab === 'todos' ? '#fff' : 'transparent',
            border: 'none',
            borderBottom: tab === 'todos' ? '3px solid #219653' : '3px solid transparent',
            color: tab === 'todos' ? '#222' : '#888',
            fontWeight: 600,
            fontSize: 16,
            padding: '8px 24px',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s',
          }}
        >
          Todos
        </button>
      </div>

      {/* Lista de clientes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {loading && <div>Cargando clientes...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        {clientes && clientes.map((cliente, idx) => (
          <div key={cliente.id || idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{cliente.nombre}</div>
              <div style={{ color: '#444', fontSize: 15 }}>
                Saldo: <span style={{ color: '#219653', fontWeight: 600 }}>${'saldo' in cliente ? cliente.saldo : '---'}</span>
                <span style={{ margin: '0 10px' }}>|</span>
                Atraso: <span style={{ color: '#888' }}>{'atraso' in cliente ? cliente.atraso : 0} días</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #21965322' }}>
                Abonar
              </button>
              <button style={{ background: '#f2f2f2', color: '#444', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientesPage;
