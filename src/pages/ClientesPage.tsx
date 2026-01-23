


import React, { useState, useEffect } from 'react';
import api from '../api/client';
import SidebarMenu from '../components/SidebarMenu';
import OrdenarClientesModal from '../components/OrdenarClientesModal';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import CreditoModal from '../components/CreditoModal';

const motivosNoPago = [
  'No tiene',
  'No está',
  'Dejó de trabajar',
  'Mañana paga',
  'Clavo',
];

const countryCodes = [
  { code: '+1', name: 'Estados Unidos', iso: 'US' },
  { code: '+52', name: 'México', iso: 'MX' },
  { code: '+593', name: 'Ecuador', iso: 'EC' },
  { code: '+57', name: 'Colombia', iso: 'CO' },
  { code: '+54', name: 'Argentina', iso: 'AR' },
  { code: '+34', name: 'España', iso: 'ES' },
  { code: '+51', name: 'Perú', iso: 'PE' },
  { code: '+56', name: 'Chile', iso: 'CL' },
  { code: '+55', name: 'Brasil', iso: 'BR' },
  { code: '+591', name: 'Bolivia', iso: 'BO' },
  { code: '+502', name: 'Guatemala', iso: 'GT' },
];

type Cliente = {
  id: number;
  nombre: string;
  saldo?: number;
  atraso?: number;
  cuota?: number;
  cedula?: string;
  direccion?: string;
  negocio?: string;
  telefono?: string;
  prestamo?: number;
  cuotasPagadas?: number;
  cuotasTotal?: number;
};

const ClientesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOrdenarModal, setShowOrdenarModal] = useState(false);
  const navigate = useNavigate();
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [pagoCliente, setPagoCliente] = useState<Cliente | null>(null);
  const [monto, setMonto] = useState('');
  const [noPago, setNoPago] = useState(false);
  const [motivo, setMotivo] = useState(motivosNoPago[0]);
  const [tab, setTab] = useState<'pendientes' | 'todos'>('pendientes');
  const [search, setSearch] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [showPrestamoSelector, setShowPrestamoSelector] = useState(false);
  const [prestamoCliente, setPrestamoCliente] = useState<Cliente | null>(null);
  const [form, setForm] = useState<Cliente>({
    id: -1,
    nombre: '',
    cedula: '',
    direccion: '',
    negocio: '',
    telefono: '',
    saldo: 0,
    prestamo: 0,
    cuotasPagadas: 0,
    cuotasTotal: 0,
    atraso: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('+593');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCreditoModal, setShowCreditoModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState<any>(null);
  const [showPrestamoSuccess, setShowPrestamoSuccess] = useState(false);
  const [showPagoSuccess, setShowPagoSuccess] = useState(false);

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Detectar país por IP y setear código de país
  useEffect(() => {
    const fetchCountryCode = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const found = countryCodes.find(c => c.iso === data.country_code);
        if (found) setCountryCode(found.code);
      } catch {}
    };
    fetchCountryCode();
  }, []);

  // Cuando se abre el modal, pedir ubicación GPS y autocompletar dirección
  useEffect(() => {
    if (showModal) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
            setForm(f => ({ ...f, direccion: coords }));
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    }
    // eslint-disable-next-line
  }, [showModal]);

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

  // Función para refrescar clientes
  async function fetchClientes() {
    setLoading(true);
    try {
      const res = await api.get('/clientes/');
      setClientes(res.data as Cliente[]);
    } catch (err) {
      setError('No se pudo cargar la lista de clientes');
    }
    setLoading(false);
  }

  return (
    <div className="mobile-page">
      <SidebarMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onEnrutarClientes={() => {
          setSidebarOpen(false);
          setShowOrdenarModal(true);
        }}
      />
      <OrdenarClientesModal
        open={showOrdenarModal}
        clientes={clientes.map(c => ({ id: c.id, nombre: c.nombre }))}
        onClose={() => setShowOrdenarModal(false)}
        onSave={orden => {
          localStorage.setItem('orden_clientes', JSON.stringify(orden.map((o: any) => o.id)));
          setClientes(prev => orden.map((o: any) => prev.find((c: any) => c.id === o.id) || { id: o.id, nombre: o.nombre }));
          setShowOrdenarModal(false);
        }}
      />
      <header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 0 10px 0', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="menu-btn" title="Menú" aria-label="Abrir menú lateral" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', fontSize: 26, color: '#4e7fa6', marginRight: 2, cursor: 'pointer' }}>
              <span>&#9776;</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="notif-icon" title="Notificaciones" style={{ fontSize: 22, color: '#FFD600', marginRight: 2 }}>🔔</span>
            <div style={{ background: '#f6f8fa', border: '1px solid #e0e0e0', borderRadius: 12, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 15 }}>
              <span className="user-icon" style={{ fontSize: 18, marginRight: 2 }}>👤</span>
              Usuario
              <span className="user-alert" style={{ background: '#e53935', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13, padding: '1px 7px', marginLeft: 4 }}>1</span>
            </div>
          </div>
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
            style={{
              background: 'linear-gradient(90deg, #4e7fa6 0%, #5fa37a 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 16,
              padding: '10px 22px',
              marginLeft: 2,
              boxShadow: '0 2px 8px #0001',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            onClick={() => setShowNuevoModal(true)}
          >
            NUEVO <span style={{ fontSize: 18, marginLeft: 2 }}>+</span>
          </button>
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
            {clientes.length > 0 && (
              <span style={{
                background: '#FFD600',
                color: '#222',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
                padding: '2px 8px',
                marginLeft: 8,
                verticalAlign: 'middle',
                boxShadow: '0 1px 4px #0001'
              }}>{clientes.length}</span>
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
        {/* Lista de clientes */}
        <div className="clientes-list" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {loading ? (
            <div className="clientes-loading">Cargando clientes...</div>
          ) : clientes.length === 0 ? (
            <div className="clientes-vacio">No hay clientes para mostrar.</div>
          ) : (
            clientes.map(cliente => (
              <ClienteCardRealtime
                key={cliente.id}
                cliente={cliente}
                onAbonar={() => {
                  setPagoCliente(cliente);
                  setShowPagoModal(true);
                }}
                onDetalle={() => navigate(`/clientes/${cliente.id}`)}
              />
            ))
          )}
        </div>
      </main>
      {/* Place modals and other overlays here as needed */}
    </div>
  );
}

// --- Componente ClienteCardRealtime ---
function ClienteCardRealtime({ cliente, onAbonar, onDetalle }: { cliente: Cliente, onAbonar: () => void, onDetalle: () => void }) {
  const [saldo, setSaldo] = React.useState(cliente.saldo ?? 0);
  const [atraso, setAtraso] = React.useState(cliente.atraso);

  React.useEffect(() => {
    let mounted = true;
    async function fetchSaldo() {
      try {
        const res = await api.get<{ saldo?: number; atraso?: number }>(`/clientes/${cliente.id}/saldo`);
        if (mounted && res.data) {
          setSaldo(res.data.saldo ?? 0);
          if (typeof res.data.atraso !== 'undefined') setAtraso(res.data.atraso);
        }
      } catch {}
    }
    fetchSaldo();
    const interval = setInterval(fetchSaldo, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, [cliente.id]);

  return (
    <div
      className="cliente-card"
      style={{
        cursor: 'pointer',
        position: 'relative',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 12px #0001',
        padding: '18px 16px 18px 18px',
        display: 'flex',
        alignItems: 'center',
        minHeight: 60
      }}
      onClick={e => {
        if ((e.target as HTMLElement).closest('.btn-abonar')) return;
        onDetalle();
      }}
    >
      <div style={{ flex: 1 }}>
        <div className="cliente-nombre" style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{cliente.nombre}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, color: '#2d7b5f', fontSize: 18, background: '#e6f4ef', borderRadius: 8, padding: '2px 10px' }}>
            ${saldo.toFixed(2)}
          </span>
          <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>Saldo</span>
          {typeof atraso === 'number' && (
            <span style={{ marginLeft: 8, color: '#b77b00', fontWeight: 600, fontSize: 15, background: '#fff7e6', borderRadius: 8, padding: '2px 10px' }}>
              {atraso} días atraso
            </span>
          )}
        </div>
      </div>
      <button
        className="btn-abonar"
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
          onAbonar();
        }}
      >
        Abonar
      </button>
    </div>
  );
}

export default ClientesPage;
