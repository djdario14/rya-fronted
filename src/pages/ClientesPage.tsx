import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useNavigate } from 'react-router-dom';
import { Cliente } from '../types/cliente';
import RyaMenuIcon from '../components/RyaMenuIcon';
import api from '../api/client';
import SidebarMenu from '../components/SidebarMenu';
import OrdenarClientesModal from '../components/OrdenarClientesModal';
import SuccessModal from '../components/SuccessModal';
import CreditoModal from '../components/CreditoModal';
import NotificationsIcon from '@mui/icons-material/Notifications';
const ClientesPage: React.FC = () => {
  // --- Estados principales ---
  const [clientes, setClientes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'pendientes' | 'todos'>('pendientes');
  const [loading, setLoading] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [pagoCliente, setPagoCliente] = useState<any | null>(null);
  const [showCreditoModal, setShowCreditoModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState<any | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOrdenarModal, setShowOrdenarModal] = useState(false);
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // --- Cargar clientes ---
  useEffect(() => {
    setLoading(true);
    api.get('/clientes/con-saldo')
      .then(res => {
        setClientes((res.data ?? []) as any[]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // --- Cargar recordatorios (simulado) ---
  useEffect(() => {
    // Aquí deberías llamar a tu API de recordatorios
    setPendientes([]); // Simulación
  }, []);

  // --- Filtrado de clientes ---
  const filteredClientes = useMemo(() =>
    clientes
      .filter((cliente: any) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          cliente.nombre?.toLowerCase().includes(q) ||
          cliente.cedula?.toLowerCase().includes(q) ||
          cliente.negocio?.toLowerCase().includes(q) ||
          cliente.telefono?.toLowerCase().includes(q)
        );
      })
      .filter((cliente: any) => {
        if (tab === 'pendientes') {
          const hoy = new Date().toISOString().slice(0, 10);
          const saldoPositivo = (cliente.saldo ?? 0) > 0;
          const prestamoActivo = cliente.estado === 'activo';
          const pagoHoy = cliente.ultimo_pago === hoy;
          return (saldoPositivo || prestamoActivo) && !pagoHoy;
        }
        return true;
      })
  , [clientes, search, tab]);

  // --- Handlers ---
  const handleAbonar = useCallback((cliente: any) => {
    setPagoCliente(cliente);
    setShowPagoModal(true);
  }, []);

  const handleDetalle = useCallback((cliente: any) => {
    navigate(`/clientes/${cliente.id}`);
  }, [navigate]);

  const handleNuevoCredito = useCallback((cliente: any) => {
    setNuevoCliente(cliente);
    setShowCreditoModal(true);
  }, []);

  // --- Render principal ---
  return (
    <div className="mobile-page">
      <SidebarMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} onEnrutarClientes={() => setShowOrdenarModal(true)} />
      <OrdenarClientesModal open={showOrdenarModal} clientes={clientes.map((c: any) => ({ id: c.id, nombre: c.nombre }))} onClose={() => setShowOrdenarModal(false)} onSave={() => setShowOrdenarModal(false)} />
      <header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 0 10px 0', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="menu-btn" title="Menú" aria-label="Abrir menú lateral" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', fontSize: 26, color: '#4e7fa6', marginRight: 2, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 52 }}>
              <RyaMenuIcon size={40} />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 8 }}>
              <span style={{ fontWeight: 700, color: '#29487d', fontSize: 20, lineHeight: 1 }}>RYA COBRANZA</span>
              <span style={{ color: '#7eb6d9', fontSize: 15, lineHeight: 1, marginTop: 2 }}>Gestión de créditos</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setShowNotif(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <NotificationsIcon style={{ fontSize: 32, color: '#FFC107', filter: 'drop-shadow(0 2px 6px #FFB30055)', transition: 'all 0.2s', padding: 0 }} />
              {pendientes.length > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, background: '#e53935', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13, padding: '1px 7px' }}>{pendientes.length}</span>
              )}
            </button>
            <div style={{ background: '#f6f8fa', border: '1px solid #e0e0e0', borderRadius: 12, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 15 }}>
              <span className="user-icon" style={{ fontSize: 18, marginRight: 2 }}>👤</span>
              <span className="hide-on-mobile">Usuario</span>
              <span className="user-alert" style={{ background: '#e53935', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13, padding: '1px 7px', marginLeft: 4 }}>1</span>
            </div>
          </div>
          {showNotif && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0007', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px #0002', textAlign: 'center', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={() => setShowNotif(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
                <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Recordatorio de visita</h3>
                {pendientes.length > 0 ? (
                  pendientes.map((r, i) => (
                    <div key={i} style={{ marginBottom: 18 }}>
                      <div style={{ fontWeight: 600, fontSize: 17 }}>{new Date(r.fecha).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</div>
                      <div style={{ color: '#2563EB', margin: '8px 0', fontWeight: 500 }}>{r.nota}</div>
                      <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>Cliente: <b>{r.cliente_nombre}</b></div>
                      <button style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>OK</button>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#888', fontSize: 16, margin: '24px 0' }}>No hay recordatorios pendientes</div>
                )}
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '0 12px' }}>
          <input
            type="text"
            placeholder="Buscar cliente"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 14px', fontSize: 16, background: '#f6f8fa', outline: 'none', fontWeight: 500 }}
          />
        </div>
      </header>
      <main className="mobile-content">
        <h2 className="clientes-title">Clientes</h2>
        <div className="tabs-row" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button
            className={tab === 'pendientes' ? 'tab-btn active' : 'tab-btn'}
            style={{ position: 'relative', fontWeight: 600, fontSize: 16, padding: '8px 20px', borderRadius: 8 }}
            onClick={() => setTab('pendientes')}
          >
            Pendientes
            {filteredClientes.length > 0 && tab === 'pendientes' && (
              <span style={{ background: '#388e3c', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13, padding: '1px 7px', marginLeft: 6 }}>{filteredClientes.length}</span>
            )}
          </button>
          <button
            className={tab === 'todos' ? 'tab-btn active' : 'tab-btn'}
            style={{ fontWeight: 600, fontSize: 16, padding: '8px 20px', borderRadius: 8 }}
            onClick={() => setTab('todos')}
          >
            Todos
          </button>
        </div>
        <div className="clientes-list" style={{ height: '60vh', minHeight: 320 }}>
          {loading ? (
            <div className="clientes-loading">Cargando clientes...</div>
          ) : clientes.length === 0 ? (
            <div className="clientes-vacio">No hay clientes para mostrar.</div>
          ) : (
            <Virtuoso
              style={{ height: 400 }}
              totalCount={filteredClientes.length}
              itemContent={index => {
                const cliente = filteredClientes[index];
                // Calcular saldo: saldo = Valor del préstamo + intereses - cuotas pagadas
                // Usar el saldo que viene del backend, igual que en el detalle
                const saldoCalculado = Number(cliente.saldo ?? 0);
                return (
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      boxShadow: '0 2px 12px #0001',
                      padding: '18px 16px 18px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 60,
                      marginBottom: 12,
                      cursor: 'pointer'
                    }}
                    key={cliente.id}
                    onClick={e => {
                      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
                      handleDetalle(cliente);
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: '#2d7b5f', fontSize: 20, background: '#e6f4ef', borderRadius: 8, padding: '2px 12px' }}>
                          ${saldoCalculado.toFixed(2)}
                        </span>
                        <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>Saldo</span>
                      </div>
                      <div className="cliente-nombre" style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{cliente.nombre}</div>
                      {typeof cliente.atraso === 'number' && cliente.atraso > 0 && (
                        <div style={{ marginTop: 2 }}>
                          <span style={{ color: '#b77b00', fontWeight: 600, fontSize: 15, background: '#fff7e6', borderRadius: 8, padding: '2px 10px' }}>
                            {cliente.atraso} días atraso
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      style={{
                        background: 'linear-gradient(90deg, #4e7fa6 0%, #5fa37a 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 16,
                        padding: '8px 22px',
                        marginLeft: 12,
                        boxShadow: '0 2px 8px #0001',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        handleAbonar(cliente);
                      }}
                    >
                      Abonar
                    </button>
                    {saldoCalculado === 0 && (
                      <button
                        style={{
                          background: 'linear-gradient(90deg, #43a047 0%, #1976d2 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 16,
                          padding: '8px 22px',
                          marginLeft: 12,
                          boxShadow: '0 2px 8px #0001',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          handleNuevoCredito(cliente);
                        }}
                      >
                        Nuevo Crédito
                      </button>
                    )}
                  </div>
                );
              }}
              overscan={10}
            />
          )}
        </div>
      </main>
      {/* Modales funcionales */}
      {showSuccess && (
        <SuccessModal message="¡Cliente añadido exitosamente!" onClose={() => setShowSuccess(false)} />
      )}
      {showCreditoModal && (
        <CreditoModal clienteNombre={nuevoCliente?.nombre || ''} onClose={() => setShowCreditoModal(false)} onSubmit={() => {}} />
      )}
      {/* Aquí puedes agregar el modal de pago real */}
    </div>
  );
};

export default ClientesPage;