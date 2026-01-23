// Motivos de no pago
const motivosNoPago = [
  'No tiene',
  'No está',
  'Dejó de trabajar',
  'Mañana paga',
  'Clavo',
];

import React, { useState, useEffect } from 'react';
import api from '../api/client';
import SidebarMenu from '../components/SidebarMenu';
import OrdenarClientesModal from '../components/OrdenarClientesModal';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import CreditoModal from '../components/CreditoModal';



// Lista básica de códigos de país
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
  // ...puedes agregar más
];

// El backend devuelve solo nombres, pero puedes adaptar el modelo según la respuesta real
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
    // ...existing hooks and functions...
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
  const [countryCode, setCountryCode] = useState('+593'); // Por defecto Ecuador
  // Estados para los modals nuevos
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCreditoModal, setShowCreditoModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState<any>(null);
  const [showPrestamoSuccess, setShowPrestamoSuccess] = useState(false);
  const [showPagoSuccess, setShowPagoSuccess] = useState(false);

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
  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clientes/');
      setClientes(res.data as Cliente[]);
    } catch (err) {
      setError('No se pudo cargar la lista de clientes');
    }
    setLoading(false);
  };

  // Main return for ClientesPage
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
          localStorage.setItem('orden_clientes', JSON.stringify(orden.map(o => o.id)));
          setClientes(prev => orden.map(o => prev.find(c => c.id === o.id) || { id: o.id, nombre: o.nombre }));
          setShowOrdenarModal(false);
        }}
      />
      <header className="mobile-header">
        <button className="menu-btn" title="Menú" aria-label="Abrir menú lateral" onClick={() => setSidebarOpen(true)}>
          <span>&#9776;</span>
        </button>
        <input
          type="text"
          placeholder="Buscar cliente"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <span className="notif-icon" title="Notificaciones">🔔</span>
        <div className="user-badge">
          <span className="user-icon">👤</span>
          Usuario
          <span className="user-alert">1</span>
        </div>
        <button className="btn-primary" onClick={() => setShowNuevoModal(true)}>
          NUEVO
        </button>
      </header>
      <main className="mobile-content">
        <h2 className="clientes-title">Clientes</h2>
        <div className="tabs-row">
          <button
            className={tab === 'pendientes' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setTab('pendientes')}
          >
            Pendientes
          </button>
          <button
            className={tab === 'todos' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setTab('todos')}
          >
            Todos
          </button>
        </div>
        {/* Modals, client list, and other content go here (as previously structured) */}
      </main>
      {/* Place modals and other overlays here as needed */}
    </div>
  );
}
