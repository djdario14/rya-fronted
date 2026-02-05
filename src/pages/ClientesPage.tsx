import React, { useState, useEffect, useMemo, useCallback } from 'react';
import RoomIcon from '@mui/icons-material/Room';
import { Virtuoso } from 'react-virtuoso';
import { useNavigate } from 'react-router-dom';
import { Cliente } from '../types/cliente';
import RyaMenuIcon from '../components/RyaMenuIcon';
import api from '../api/client';
import SidebarMenu from '../components/SidebarMenu';
import OrdenarClientesModal from '../components/OrdenarClientesModal';
import SuccessModal from '../components/SuccessModal';
import CreditoModal from '../components/CreditoModal';

// Modal simple para registrar cliente (puedes reemplazarlo por tu propio componente)
const RegistrarClienteModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const [nombre, setNombre] = React.useState('');
  const [cedula, setCedula] = React.useState('');
  const [negocio, setNegocio] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [codigoPais, setCodigoPais] = React.useState('');
  const [ubicacion, setUbicacion] = React.useState('');
  const [tocado, setTocado] = React.useState(false);
  const [errorUbicacion, setErrorUbicacion] = React.useState(false);
  const [errorNombre, setErrorNombre] = React.useState(false);
  const [errorTelefono, setErrorTelefono] = React.useState(false);
  const [errorCedula, setErrorCedula] = React.useState(false);
  const [errorNegocio, setErrorNegocio] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Detectar país por IP y establecer código de país por defecto
  React.useEffect(() => {
    if (!codigoPais) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          // Mapeo simple país-código
          const map: Record<string, string> = {
            'MX': '+52',
            'CO': '+57',
            'US': '+1',
            'AR': '+54',
            'ES': '+34',
          };
          setCodigoPais(map[data.country_code] || '+52');
        })
        .catch(() => setCodigoPais('+52'));
    }
  }, [codigoPais]);

  // Handler para autocompletar ubicación con GPS
  const handleObtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUbicacion(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setErrorUbicacion(false);
        },
        () => {
          setErrorUbicacion(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0007', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 260, maxWidth: 320, boxShadow: '0 4px 24px #0002', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        <h3 style={{ margin: 0, marginBottom: 24, fontWeight: 700, fontSize: 22 }}>Registrar Cliente</h3>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => { setNombre(e.target.value); setErrorNombre(false); }}
          style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: errorNombre && tocado && !nombre ? '2px solid #e53935' : '1px solid #ccc', background: errorNombre && tocado && !nombre ? '#fff6f6' : undefined }}
        />
        <input
          placeholder="Cédula"
          value={cedula}
          onChange={e => { setCedula(e.target.value); setErrorCedula(false); }}
          style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: errorCedula && tocado && !cedula ? '2px solid #e53935' : '1px solid #ccc', background: errorCedula && tocado && !cedula ? '#fff6f6' : undefined }}
        />
        <div style={{ display: 'flex', marginBottom: 12, gap: 6 }}>
          <select value={codigoPais} onChange={e => setCodigoPais(e.target.value)} style={{ border: '1px solid #ccc', borderRadius: 6, padding: 8, width: 90 }}>
            <option value="+52">🇲🇽 México +52</option>
            <option value="+54">🇦🇷 Argentina +54</option>
            <option value="+591">🇧🇴 Bolivia +591</option>
            <option value="+55">🇧🇷 Brasil +55</option>
            <option value="+56">🇨🇱 Chile +56</option>
            <option value="+57">🇨🇴 Colombia +57</option>
            <option value="+506">🇨🇷 Costa Rica +506</option>
            <option value="+53">🇨🇺 Cuba +53</option>
            <option value="+593">🇪🇨 Ecuador +593</option>
            <option value="+503">🇸🇻 El Salvador +503</option>
            <option value="+502">🇬🇹 Guatemala +502</option>
            <option value="+504">🇭🇳 Honduras +504</option>
            <option value="+52">🇲🇽 México +52</option>
            <option value="+505">🇳🇮 Nicaragua +505</option>
            <option value="+507">🇵🇦 Panamá +507</option>
            <option value="+595">🇵🇾 Paraguay +595</option>
            <option value="+51">🇵🇪 Perú +51</option>
            <option value="+1">🇵🇷 Puerto Rico +1</option>
            <option value="+1">🇩🇴 República Dominicana +1</option>
            <option value="+598">🇺🇾 Uruguay +598</option>
            <option value="+58">🇻🇪 Venezuela +58</option>
            <option value="+34">🇪🇸 España +34</option>
            <option value="+1">🇺🇸 USA +1</option>
          </select>
          <input
            placeholder="Teléfono"
            value={telefono}
            onChange={e => setTelefono(e.target.value.replace(/[^0-9]/g, ''))}
            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            maxLength={12}
          />
        </div>
        <input
          placeholder="Negocio"
          value={negocio}
          onChange={e => { setNegocio(e.target.value); setErrorNegocio(false); }}
          style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: errorNegocio && tocado && !negocio ? '2px solid #e53935' : '1px solid #ccc', background: errorNegocio && tocado && !negocio ? '#fff6f6' : undefined }}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 6 }}>
          <input
            placeholder="Ubicación GPS (latitud, longitud)"
            value={ubicacion}
            onChange={e => { setUbicacion(e.target.value); setTocado(true); if (e.target.value) setErrorUbicacion(false); }}
            onBlur={() => { setTocado(true); if (!ubicacion) setErrorUbicacion(true); }}
            style={{ flex: 1, padding: 8, borderRadius: 6, border: errorUbicacion && tocado && !ubicacion ? '2px solid #e53935' : '1px solid #ccc', background: errorUbicacion && tocado && !ubicacion ? '#fff6f6' : undefined }}
          />
          <button
            type="button"
            title="Obtener ubicación actual"
            onClick={handleObtenerUbicacion}
            style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 18, padding: '8px 10px', cursor: 'pointer', minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RoomIcon style={{ fontSize: 22, color: '#fff' }} />
          </button>
        </div>
        {errorUbicacion && tocado && !ubicacion && (
          <div style={{ color: '#e53935', fontSize: 13, marginBottom: 8, textAlign: 'left' }}>La ubicación es obligatoria.</div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onClose} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, padding: '10px 24px', cursor: 'pointer' }}>Cancelar</button>
          <button
            style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 24px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            disabled={loading}
            onClick={async e => {
              setTocado(true);
              let error = false;
              if (!nombre) { setErrorNombre(true); error = true; }
              if (!cedula) { setErrorCedula(true); error = true; }
              if (!negocio) { setErrorNegocio(true); error = true; }
              if (!telefono) { setErrorTelefono(true); error = true; }
              if (!ubicacion) { setErrorUbicacion(true); error = true; }
              if (error) return;
              setLoading(true);
              try {
                const res = await fetch('/api/clientes', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    nombre,
                    cedula,
                    negocio,
                    telefono: `${codigoPais} ${telefono}`,
                    ubicacion
                  })
                });
                if (res.ok) {
                  setNombre(''); setCedula(''); setNegocio(''); setTelefono(''); setUbicacion('');
                  setTocado(false);
                  if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('cliente-registrado'));
                  }
                  onClose();
                  if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('cliente-registrado-exito'));
                  }
                } else {
                  alert('Error al registrar cliente');
                }
              } catch {
                alert('Error de red al registrar cliente');
              }
              setLoading(false);
            }}
          >{loading ? 'Registrando...' : 'Registrar'}</button>
        </div>
      </div>
    </div>
  );
};
import NotificationsIcon from '@mui/icons-material/Notifications';
const ClientesPage: React.FC = () => {
  // Mostrar modal de éxito y recargar clientes al registrar cliente
  useEffect(() => {
    const handler = () => {
      setShowSuccess(true);
      // Recargar clientes
      setLoading(true);
      api.get('/clientes/con-saldo')
        .then(res => {
          setClientes((res.data ?? []) as any[]);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    };
    window.addEventListener('cliente-registrado-exito', handler);
    return () => window.removeEventListener('cliente-registrado-exito', handler);
  }, []);
      const [showPrestamoModal, setShowPrestamoModal] = useState(false);
      const [clientePrestamo, setClientePrestamo] = useState<any | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
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
  const [showRegistrarCliente, setShowRegistrarCliente] = useState(false);
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
          <button
            title="Agregar cliente"
            aria-label="Agregar cliente"
            style={{
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              fontSize: 28,
              fontWeight: 700,
              boxShadow: '0 2px 8px #0002',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            onClick={() => setShowAddModal(true)}
          >
            +
          </button>
        </div>
      </header>
      <main className="mobile-content">
        <h2 className="clientes-title" style={{ marginBottom: 8 }}>Clientes</h2>
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
      {/* Modal para elegir acción al dar click en + */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0007', zIndex: 4000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 260, maxWidth: 320, boxShadow: '0 4px 24px #0002', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            <h3 style={{ margin: 0, marginBottom: 24, fontWeight: 700, fontSize: 22 }}>¿Qué deseas agregar?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <button
                style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, padding: '12px 0', cursor: 'pointer' }}
                onClick={() => { setShowAddModal(false); setShowRegistrarCliente(true); }}
              >
                Cliente
              </button>
              <button
                style={{ background: '#43a047', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, padding: '12px 0', cursor: 'pointer' }}
                onClick={() => { setShowAddModal(false); setShowPrestamoModal(true); }}
              >
                Préstamo
              </button>
                  {/* Modal para seleccionar cliente con saldo 0 para préstamo */}
                  {showPrestamoModal && (
                    <div style={{
                      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0007', zIndex: 4100,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 280, maxWidth: 350, boxShadow: '0 4px 24px #0002', textAlign: 'center', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
                        <button onClick={() => setShowPrestamoModal(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
                        <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 20 }}>Selecciona un cliente</h3>
                        {clientes.filter((c: any) => Number(c.saldo ?? 0) === 0).length === 0 ? (
                          <div style={{ color: '#888', fontSize: 16, margin: '24px 0' }}>No hay clientes con saldo 0</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {clientes.filter((c: any) => Number(c.saldo ?? 0) === 0).map((c: any) => (
                              <button
                                key={c.id}
                                style={{ background: '#f6f8fa', border: '1px solid #e0e0e0', borderRadius: 8, fontWeight: 600, fontSize: 16, padding: '10px 0', cursor: 'pointer', color: '#1976d2' }}
                                onClick={() => { setShowPrestamoModal(false); setClientePrestamo(c); setShowCreditoModal(true); }}
                              >
                                {c.nombre}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
            </div>
          </div>
        </div>
      )}
      {showRegistrarCliente && (
        <RegistrarClienteModal open={showRegistrarCliente} onClose={() => setShowRegistrarCliente(false)} />
      )}
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