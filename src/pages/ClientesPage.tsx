// Motivos de no pago
const motivosNoPago = [
  'No tiene',
  'No está',
  'Dejó de trabajar',
  'Mañana paga',
  'Clavo',
];

import React, { useState, useEffect } from 'react';
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
};

const ClientesPage: React.FC = () => {
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
  const [form, setForm] = useState({
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
      const res = await fetch('https://rya-backend-production.up.railway.app/clientes/');
      const data = await res.json();
      if (Array.isArray(data)) {
        const clientesConSaldo = await Promise.all(
          data.map(async (cliente: any) => {
            if (typeof cliente === 'string') {
              return { id: -1, nombre: cliente, saldo: undefined, atraso: undefined };
            }
            let valorPrestamo = 0, intereses = 0, pagos = 0, saldo = 0, atraso = 0, cuota = undefined;
            try {
              const resSaldo = await fetch(`https://rya-backend-production.up.railway.app/clientes/${cliente.id}/saldo`);
              const saldoData = await resSaldo.json();
              valorPrestamo = saldoData.prestamo ?? 0;
              intereses = saldoData.prestamo ? saldoData.prestamo * 0.2 : 0;
              pagos = saldoData.cuotasPagadas && saldoData.cuotasTotal ? ((valorPrestamo + intereses) / saldoData.cuotasTotal) * saldoData.cuotasPagadas : 0;
              saldo = valorPrestamo + intereses - pagos;
              atraso = saldoData.atraso ?? 0;
              cuota = saldoData.cuotasTotal ? Math.round((valorPrestamo + intereses) / saldoData.cuotasTotal) : undefined;
            } catch {}
            return { id: cliente.id, nombre: cliente.nombre, saldo, atraso, cuota };
          })
        );
        setClientes(clientesConSaldo);
      } else {
        setClientes([]);
      }
    } catch {
      setClientes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const navigate = useNavigate();

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #0002', width: 700, maxWidth: '100%', padding: 36, border: '1px solid #f0f0f0', position: 'relative' }}>
        {/* Botón Volver */}
        <button style={{ position: 'absolute', top: 18, left: 18, background: '#29487d', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px 8px 16px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001', zIndex: 2, transition: 'background 0.2s' }}
          onClick={() => navigate(-1)}
          onMouseOver={e => (e.currentTarget.style.background = '#18325a')}
          onMouseOut={e => (e.currentTarget.style.background = '#29487d')}
        >
          <span style={{ fontSize: 19, marginRight: 2 }}>←</span> Volver
        </button>
        {/* Header azul */}
        <div style={{ background: '#29487d', borderRadius: 14, padding: 28, color: '#fff', display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#fff', color: '#29487d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, fontWeight: 700, marginRight: 32 }}>
            <span role="img" aria-label="user">👤</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{form.nombre || 'Nombre'}</div>
            <div style={{ fontSize: 17, marginTop: 4 }}>Cédula: <span style={{ fontWeight: 600 }}>{form.cedula || '--'}</span></div>
            <div style={{ fontSize: 17 }}>Tel: <span style={{ fontWeight: 600 }}>{form.telefono ? `${countryCode}${form.telefono}` : '--'}</span></div>
          </div>
          <button style={{ background: '#fff', color: '#29487d', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginLeft: 18 }}>
            VER MAPA
          </button>
        </div>
        {/* Saldo y acciones */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 28, marginBottom: 18 }}>
              <div style={{ fontSize: 19, color: '#888', marginBottom: 10 }}>Saldo</div>
              <div style={{ fontSize: 38, fontWeight: 700, color: '#219653', marginBottom: 18 }}>
                ${form.saldo !== undefined ? form.saldo.toFixed(2) : '0.00'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#29487d', fontWeight: 600 }}>
                <div>Préstamo<br /><span style={{ color: '#222', fontWeight: 700, fontSize: 22 }}>${form.prestamo !== undefined ? form.prestamo : '--'}</span></div>
                <div>Cuotas<br /><span style={{ color: '#222', fontWeight: 700, fontSize: 22 }}>{form.cuotasPagadas !== undefined ? form.cuotasPagadas : '--'} / {form.cuotasTotal !== undefined ? form.cuotasTotal : '--'}</span></div>
                <div>Atraso<br /><span style={{ color: '#222', fontWeight: 700, fontSize: 22 }}>${form.atraso !== undefined ? form.atraso : '--'}</span></div>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 70 }}>
              <div style={{ fontSize: 20, color: '#29487d', fontWeight: 700, letterSpacing: 0.5 }}>Pagos registrados</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 180 }}>
            <button style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 19, cursor: 'pointer', marginBottom: 8 }}>Historial Crediticio</button>
            <button style={{ background: '#29487d', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 8 }}>AGENDAR VISITA</button>
            <button style={{ background: '#fff', color: '#29487d', border: '1px solid #29487d', borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>ENVIAR MENSAJE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientesPage;
