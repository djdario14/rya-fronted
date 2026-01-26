import React, { useState, useEffect } from 'react';
import api from '../api/client';
import SidebarMenu from '../components/SidebarMenu';
import OrdenarClientesModal from '../components/OrdenarClientesModal';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import CreditoModal from '../components/CreditoModal';
import RyaMenuIcon from '../components/RyaMenuIcon';

// --- Modal para registrar pago ---
type PrestamoActivo = {
  id: number;
  cliente_id: number;
  monto: number;
  fecha: string;
  estado: string;
  interes: number;
  total: number;
  cuotas: number;
  valor_cuota: number;
  forma_pago: string;
};

function PagoModal({ open, cliente, onClose, onSuccess }: { open: boolean, cliente: Cliente | null, onClose: () => void, onSuccess: () => void }) {
  const [monto, setMonto] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [noPago, setNoPago] = React.useState(false);
  const [motivo, setMotivo] = React.useState('');
  // Motivos de no pago (sin cambios, solo para forzar commit)
  const motivos = [
    'No tiene',
    'Dejo de trabajar',
    'Semanal',
    'Paga mañana',
    'Clavo',
  ];
  const [prestamoId, setPrestamoId] = React.useState<number | null>(null);
  const [saldoPendiente, setSaldoPendiente] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (open && cliente) {
      api.get<PrestamoActivo | {}>(`/prestamos/activo/${cliente.id}`)
        .then(res => {
          const data = res.data as PrestamoActivo;
          if (data && typeof data.valor_cuota !== 'undefined') {
            setMonto(data.valor_cuota.toString());
            setPrestamoId(data.id);
            // Calcular saldo pendiente
            if (typeof data.total === 'number' && typeof data.monto === 'number') {
              // Si el backend ya calcula saldo, puedes usarlo aquí. Si no, usa total - pagos
              api.get<{ saldo: number }>(`/clientes/${cliente.id}/saldo`).then(r => setSaldoPendiente(r.data.saldo)).catch(() => setSaldoPendiente(null));
            } else {
              setSaldoPendiente(null);
            }
          } else {
            setMonto('');
            setPrestamoId(null);
            setSaldoPendiente(null);
          }
        })
        .catch(() => { setMonto(''); setPrestamoId(null); setSaldoPendiente(null); });
      setNoPago(false);
      setMotivo('');
    }
  }, [open, cliente]);
  if (!open || !cliente) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 28, minWidth: 320, width: 340, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top:10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        <h3 style={{ marginTop: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Registrar pago</h3>
        <div style={{ marginBottom: 10, fontWeight: 600 }}>{cliente.nombre}</div>
        <form onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          setError('');
          try {
            if (!prestamoId) throw new Error('No se encontró préstamo activo');
            if (noPago) {
              await api.post(`/pagos/`, { prestamo_id: prestamoId, monto: 0, motivo_no_pago: motivo, fecha: new Date().toISOString().slice(0, 10) });
            } else {
              await api.post(`/pagos/`, { prestamo_id: prestamoId, monto: parseFloat(monto), fecha: new Date().toISOString().slice(0, 10) });
            }
            setMonto('');
            onSuccess();
            onClose();
          } catch (err: any) {
            // Mostrar el error técnico real para depuración
            let mensaje = 'No se pudo registrar el pago';
            if (err && err.response && err.response.data) {
              const data = err.response.data;
              if (typeof data === 'string') {
                mensaje = data;
              } else if (typeof data === 'object') {
                mensaje = JSON.stringify(data);
              }
            } else if (err && err.message) {
              mensaje = err.message;
            }
            setError(mensaje);
          }
          setLoading(false);
        }}>
          <div style={{ marginBottom: 14 }}>
            <label>Monto</label>
            <input
              type="number"
              min={0}
              step="0.01"
              required={!noPago}
              disabled={noPago}
              value={monto}
              max={saldoPendiente !== null ? saldoPendiente : undefined}
              onChange={e => {
                const val = e.target.value;
                if (saldoPendiente !== null && parseFloat(val) > saldoPendiente) {
                  setMonto(saldoPendiente.toString());
                } else {
                  setMonto(val);
                }
              }}
              onFocus={e => setMonto('')}
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc', background: noPago ? '#f5f5f5' : undefined }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>
              <input type="checkbox" checked={noPago} onChange={e => setNoPago(e.target.checked)} style={{ marginRight: 8 }} />
              No pagó
            </label>
          </div>
          {noPago && (
            <div style={{ marginBottom: 14 }}>
              <label>Motivo</label>
              <select value={motivo} onChange={e => setMotivo(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}>
                <option value="">Selecciona un motivo</option>
                {motivos.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
          {error && <div style={{ color: '#e53935', marginBottom: 10 }}>{error}</div>}
          <button type="submit" disabled={loading || (noPago && !motivo)} style={{ width: '100%', background: 'linear-gradient(90deg, #4e7fa6 0%, #5fa37a 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 0', cursor: 'pointer', marginBottom: 8 }}>
            {loading ? 'Guardando...' : (noPago ? 'Registrar motivo' : 'Registrar pago')}
          </button>
          <button type="button" disabled={loading || !prestamoId || saldoPendiente === null || saldoPendiente <= 0} style={{ width: '100%', background: 'linear-gradient(90deg, #1976d2 0%, #43a047 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 0', cursor: saldoPendiente && saldoPendiente > 0 ? 'pointer' : 'not-allowed', marginTop: 2, boxShadow: '0 2px 8px #1976d233' }}
            onClick={async () => {
              if (!prestamoId || saldoPendiente === null || saldoPendiente <= 0) return;
              const ok = window.confirm(`¿Seguro que deseas cancelar la deuda total de $${saldoPendiente.toFixed(2)}?`);
              if (!ok) return;
              setLoading(true);
              setError('');
              try {
                await api.post(`/pagos/`, { prestamo_id: prestamoId, monto: saldoPendiente, fecha: new Date().toISOString().slice(0, 10) });
                setMonto('');
                onSuccess();
                onClose();
              } catch (err) {
                setError('No se pudo cancelar la deuda');
              }
              setLoading(false);
            }}>
            Cancelar deuda total {saldoPendiente !== null && saldoPendiente > 0 ? `($${saldoPendiente.toFixed(2)})` : ''}
          </button>
        </form>
      </div>
    </div>
  );
}

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
  valor_cuota?: number;
  cedula?: string;
  direccion?: string;
  negocio?: string;
  telefono?: string;
  prestamo?: number;
  cuotasPagadas?: number;
  cuotasTotal?: number;
  estado?: string; // <-- Agregado para evitar error TS
  ultimo_pago?: string; // Fecha YYYY-MM-DD del último pago
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
  // Nuevo: clientes con último pago
  const [clientesUltimoPago, setClientesUltimoPago] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [showNuevoSelector, setShowNuevoSelector] = useState(false);
  const [showPrestamoSelector, setShowPrestamoSelector] = useState(false);
  const [clienteParaPrestamo, setClienteParaPrestamo] = useState<Cliente | null>(null);
  // --- Formulario de préstamo ---
  const formaPagoOpciones = [
    { label: 'Diario', value: 'diario', cuotas: 30 },
    { label: 'Semanal', value: 'semanal', cuotas: 4 },
    { label: 'Quincenal', value: 'quincenal', cuotas: 2 },
    { label: 'Mensual', value: 'mensual', cuotas: 1 },
  ];

  function PrestamoFormModal({ cliente, onClose }: { cliente: Cliente, onClose: () => void }) {
    const [valor, setValor] = React.useState<number | null>(0);
    const [interes, setInteres] = React.useState(20);
    const [formaPago, setFormaPago] = React.useState(formaPagoOpciones[0].value);
    const [numCuotas, setNumCuotas] = React.useState(formaPagoOpciones[0].cuotas);
    const [fecha, setFecha] = React.useState(() => {
      const d = new Date();
      // Formato YYYY-MM-DD local
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    React.useEffect(() => {
      const found = formaPagoOpciones.find(f => f.value === formaPago);
      if (found) setNumCuotas(found.cuotas);
    }, [formaPago]);

    const totalPagar = valor ? valor + (valor * interes / 100) : 0;
    const valorCuota = valor && numCuotas > 0 ? totalPagar / numCuotas : 0;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError('');
      try {
        if (valor === null || isNaN(valor)) throw new Error('El valor del préstamo es obligatorio');
        // Usar la fecha seleccionada (solo YYYY-MM-DD)
        await api.post('/prestamos/', {
          cliente_id: cliente.id,
          monto: valor,
          fecha,
          estado: 'activo',
          interes,
          total: totalPagar,
          cuotas: numCuotas,
          valor_cuota: valorCuota,
          forma_pago: formaPagoOpciones.find(f => f.value === formaPago)?.label || '',
        });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      } catch (err: any) {
        setError('No se pudo registrar el préstamo');
      }
      setSaving(false);
    };

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 2200,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 28, minWidth: 320, width: 340, position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
          <h3 style={{ marginTop: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Crear préstamo para {cliente.nombre}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label>Valor del préstamo</label>
              <input
                type="number"
                min={0}
                required
                value={valor === null ? '' : valor}
                onChange={e => {
                  const v = e.target.value;
                  if (v === '') setValor(null);
                  else setValor(Number(v));
                }}
                onFocus={e => {
                  if (valor === 0) setValor(null);
                }}
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Intereses (%)</label>
              <input type="number" min={0} required value={interes} onChange={e => setInteres(Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Forma de Pago</label>
              <select value={formaPago} onChange={e => setFormaPago(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}>
                {formaPagoOpciones.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label} ({opt.cuotas} cuotas)</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Número de cuotas</label>
              <input type="number" min={1} required value={numCuotas} readOnly style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc', background: '#f6f8fa' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Valor de cuota</label>
              <input type="number" value={valorCuota.toFixed(2)} readOnly style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc', background: '#f6f8fa', fontWeight: 700 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Fecha</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: 18, fontWeight: 700, fontSize: 16, color: '#2d7b5f' }}>
              Total a pagar: ${totalPagar.toFixed(2)}
            </div>
            {error && <div style={{ color: '#e53935', marginBottom: 10 }}>{error}</div>}
            {success && <div style={{ color: '#2d7b5f', marginBottom: 10, fontWeight: 700 }}>¡Préstamo registrado!</div>}
            <button type="submit" disabled={saving} style={{ width: '100%', background: 'linear-gradient(90deg, #4e7fa6 0%, #5fa37a 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 0', cursor: 'pointer' }}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </div>
    );
  }
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
  const [gpsLoading, setGpsLoading] = useState(false);



  // Cargar todos los clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Detectar país por IP y setear código de país
  // useEffect(() => {
  //   const fetchCountryCode = async () => {
  //     try {
  //       const res = await fetch('https://ipapi.co/json/');
  //       const data = await res.json();
  //       const found = countryCodes.find(c => c.iso === data.country_code);
  //       if (found) setCountryCode(found.code);
  //     } catch {}
  //   };
  //   fetchCountryCode();
  // }, []);

  // Ya no se autocompleta al abrir el modal, solo con el botón

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
      const res = await api.get('/clientes/con-saldo');
      setClientes(res.data as Cliente[]);
    } catch (err) {
      setError('No se pudo cargar la lista de clientes');
    }
    setLoading(false);
  }

  // Handler para obtener ubicación GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        setForm(f => ({ ...f, direccion: coords }));
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="mobile-page">
      {/* Modales globales */}
      {showNuevoSelector && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 2100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 28, minWidth: 280, width: 300, position: 'relative' }}>
            <button onClick={() => setShowNuevoSelector(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            <h3 style={{ marginTop: 0, marginBottom: 18, fontWeight: 700, fontSize: 20 }}>¿Qué deseas registrar?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button onClick={() => { setShowNuevoSelector(false); setShowNuevoModal(true); }} style={{ padding: '12px 0', borderRadius: 8, border: '1px solid #4e7fa6', background: '#f6f8fa', color: '#4e7fa6', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cliente</button>
              <button onClick={() => { setShowNuevoSelector(false); setShowPrestamoSelector(true); }} style={{ padding: '12px 0', borderRadius: 8, border: '1px solid #5fa37a', background: '#f6f8fa', color: '#5fa37a', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Préstamo</button>
            </div>
          </div>
        </div>
      )}
      {showNuevoModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 28, minWidth: 320, width: 340, position: 'relative' }}>
            <button onClick={() => setShowNuevoModal(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            <h3 style={{ marginTop: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Registrar nuevo cliente</h3>
            <form onSubmit={async e => {
              e.preventDefault();
              setSaving(true);
              setError('');
              try {
                const res = await api.post('/clientes/', form);
                setNuevoCliente(res.data); // Guarda el cliente recién creado
                setShowNuevoModal(false);
                setShowSuccessModal(true);
                setForm({ id: -1, nombre: '', cedula: '', direccion: '', negocio: '', telefono: '', saldo: 0, prestamo: 0, cuotasPagadas: 0, cuotasTotal: 0, atraso: 0 });
                fetchClientes();
              } catch (err: any) {
                setError('No se pudo registrar el cliente');
              }
              setSaving(false);
            }}>
              <div style={{ marginBottom: 12 }}>
                <label>Nombre</label>
                <input type="text" required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Cédula</label>
                <input type="text" value={form.cedula} onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: 12, position: 'relative' }}>
                <label>Ubicación</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={form.direccion}
                    onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
                    style={{ width: '100%', padding: '8px 38px 8px 8px', borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box' }}
                    placeholder="lat,lng"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!navigator.geolocation) return;
                      setGpsLoading(true);
                      navigator.geolocation.getCurrentPosition(
                        pos => {
                          const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
                          setForm(f => ({ ...f, direccion: coords }));
                          setGpsLoading(false);
                        },
                        () => setGpsLoading(false),
                        { enableHighAccuracy: true, timeout: 10000 }
                      );
                    }}
                    disabled={gpsLoading}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 0,
                      bottom: 0,
                      margin: 'auto',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 24,
                      width: 24,
                      opacity: gpsLoading ? 0.5 : 1,
                      zIndex: 2
                    }}
                    title="Autocompletar ubicación con GPS"
                  >
                    {/* Ícono de ubicación tipo pin/mapa */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="#2d7b5f"/>
                      <circle cx="12" cy="9" r="2.5" fill="#e6f4ef"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Negocio</label>
                <input type="text" value={form.negocio} onChange={e => setForm(f => ({ ...f, negocio: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
              </div>
              {/* Campo Teléfono con código de país funcional */}
              <div>
                <label>Teléfono</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <select
                    value={countryCode}
                    onChange={e => {
                      const newCode = e.target.value;
                      // Al cambiar el código, mantener solo el número sin el código anterior
                      const numero = form.telefono?.replace(countryCode, '') || '';
                      setCountryCode(newCode);
                      setForm(f => ({ ...f, telefono: newCode + numero }));
                    }}
                    style={{
                      width: 80,
                      padding: '8px 4px',
                      borderRadius: 8,
                      border: '1px solid #ccc',
                      fontWeight: 700,
                      color: '#4e7fa6',
                      background: '#f6f8fa',
                      fontSize: 15
                    }}
                    title="Seleccionar código de país"
                  >
                    {countryCodes.map(c => (
                      <option key={c.code} value={c.code}>{c.code} {c.iso}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={form.telefono?.replace(countryCode, '') || ''}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '');
                      setForm(f => ({ ...f, telefono: countryCode + value }));
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid #ccc',
                      minWidth: 0
                    }}
                    placeholder="Número"
                    maxLength={15}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
              </div>
              {error && <div style={{ color: '#e53935', marginBottom: 10 }}>{error}</div>}
              <button type="submit" disabled={saving} style={{ width: '100%', background: 'linear-gradient(90deg, #4e7fa6 0%, #5fa37a 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 0', cursor: 'pointer', marginTop: 14 }}>
                {saving ? 'Guardando...' : 'Registrar'}
              </button>
            </form>
          </div>
        </div>
      )}
      {showSuccessModal && nuevoCliente && (
        <SuccessModal
          message="¡Cliente añadido exitosamente!"
          onClose={() => {
            setShowSuccessModal(false);
            setClienteParaPrestamo(nuevoCliente); // Abre el formulario de préstamo
            setNuevoCliente(null);
          }}
        />
      )}
      {showPrestamoSelector && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 2100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 28, minWidth: 280, width: 320, position: 'relative', maxHeight: 420, overflowY: 'auto' }}>
            <button onClick={() => setShowPrestamoSelector(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            <h3 style={{ marginTop: 0, marginBottom: 18, fontWeight: 700, fontSize: 20 }}>Selecciona un cliente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {clientes.filter(c => Math.abs(c.saldo ?? 0) < 0.01).length === 0 ? (
                <div style={{ color: '#888', textAlign: 'center' }}>No hay clientes elegibles para préstamo</div>
              ) : (
                clientes.filter(c => Math.abs(c.saldo ?? 0) < 0.01).map(c => (
                  <button key={c.id} onClick={() => { setShowPrestamoSelector(false); setClienteParaPrestamo(c); }} style={{ padding: '10px 0', borderRadius: 8, border: '1px solid #4e7fa6', background: '#f6f8fa', color: '#4e7fa6', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>{c.nombre}</button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {clienteParaPrestamo && (
        <PrestamoFormModal cliente={clienteParaPrestamo} onClose={() => setClienteParaPrestamo(null)} />
      )}
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
            <button className="menu-btn" title="Menú" aria-label="Abrir menú lateral" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', fontSize: 26, color: '#4e7fa6', marginRight: 2, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', height: 52 }}>
              <RyaMenuIcon size={40} />
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 8 }}>
              <span style={{ fontWeight: 700, color: '#29487d', fontSize: 20, lineHeight: 1 }}>RYA COBRANZA</span>
              <span style={{ color: '#7eb6d9', fontSize: 15, lineHeight: 1, marginTop: 2 }}>Gestión de créditos</span>
            </div>
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
            onClick={() => setShowNuevoSelector(true)}
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
            clientes
              .filter(cliente => {
                // Filtro por búsqueda
                const q = search.trim().toLowerCase();
                if (!q) return true;
                return (
                  cliente.nombre?.toLowerCase().includes(q) ||
                  cliente.cedula?.toLowerCase().includes(q) ||
                  cliente.negocio?.toLowerCase().includes(q) ||
                  cliente.telefono?.toLowerCase().includes(q)
                );
              })
              .filter(cliente => {
                // Filtro por tab
                if (tab === 'pendientes') {
                  // Mostrar solo clientes que NO han pagado hoy y tienen saldo > 0 o préstamo activo
                  // Suponemos que cliente tiene campos: saldo, estado, y un campo 'ultimo_pago' (fecha string) opcional
                  const hoy = new Date().toISOString().slice(0, 10);
                  // Si el cliente tiene saldo > 0 o estado 'activo', y no ha pagado hoy
                  // Si existe cliente.ultimo_pago, comparar con hoy
                  // Si no existe, consideramos que no ha pagado hoy
                  const saldoPositivo = (cliente.saldo ?? 0) > 0;
                  const prestamoActivo = cliente.estado === 'activo';
                  const pagoHoy = cliente.ultimo_pago === hoy;
                  return (saldoPositivo || prestamoActivo) && !pagoHoy;
                }
                // Si es 'todos', mostrar todos
                return true;
              })
              .map(cliente => (
                <ClienteCardRealtime
                  key={cliente.id}
                  cliente={cliente}
                  onAbonar={() => {
                    setPagoCliente(cliente);
                    setShowPagoModal(true);
                  }}
                  onDetalle={() => navigate(`/clientes/${cliente.id}`)}
                  onNuevoCredito={() => {
                    setNuevoCliente(cliente);
                    setShowCreditoModal(true);
                  }}
                />
              ))
          )}
        </div>
        {/* Se eliminó la lista de clientes con 'Sin saldo' */}
      </main>
      {/* Modal para registrar pago */}
      <PagoModal
        open={showPagoModal}
        cliente={pagoCliente}
        onClose={() => setShowPagoModal(false)}
        onSuccess={fetchClientes}
      />
      {/* Modal para registrar nuevo crédito */}
      {showCreditoModal && nuevoCliente && (
        <CreditoModal
          clienteNombre={nuevoCliente.nombre}
          onClose={() => setShowCreditoModal(false)}
          onSubmit={async (data) => {
            // Aquí deberías llamar a tu API para registrar el nuevo préstamo
            // y luego refrescar la lista de clientes
            setShowCreditoModal(false);
            setNuevoCliente(null);
            fetchClientes();
          }}
        />
      )}
    </div>
  );
}

// --- Componente ClienteCardRealtime ---
function ClienteCardRealtime({ cliente, onAbonar, onDetalle, onNuevoCredito }: { cliente: Cliente, onAbonar: () => void, onDetalle: () => void, onNuevoCredito: () => void }) {
  const [saldo, setSaldo] = React.useState<number | null>(null);
  const [atraso, setAtraso] = React.useState<number | undefined>(cliente.atraso);
  const [estado, setEstado] = React.useState<string | undefined>(cliente.estado);

  React.useEffect(() => {
    let mounted = true;
    async function fetchSaldo() {
      try {
        const res = await api.get<{ saldo?: number; atraso?: number; estado?: string }>(`/clientes/${cliente.id}/saldo`);
        if (mounted && res.data) {
          setSaldo(res.data.saldo ?? 0);
          if (typeof res.data.atraso !== 'undefined') setAtraso(res.data.atraso);
          if (typeof res.data.estado !== 'undefined') setEstado(res.data.estado);
        }
      } catch (err) {
        console.error('Error al obtener saldo:', err);
        setSaldo(null);
      }
    }
    fetchSaldo();
    return () => { mounted = false; };
  }, [cliente.id]);

  // Mostrar botón solo si saldo === 0 y tiene un préstamo anterior pagado (ultimo_pago no null, no undefined, no vacío)
  const mostrarNuevoCredito = (saldo === 0 && cliente.ultimo_pago && cliente.ultimo_pago !== '');
  const mostrarAbonar = (saldo !== null && saldo > 0 && estado === 'activo');

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
        if ((e.target as HTMLElement).closest('.btn-abonar') || (e.target as HTMLElement).closest('.btn-nuevo-credito')) return;
        onDetalle();
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, color: '#2d7b5f', fontSize: 20, background: '#e6f4ef', borderRadius: 8, padding: '2px 12px' }}>
            {saldo === null ? 'Cargando...' : `$${saldo.toFixed(2)}`}
          </span>
          <span style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>Saldo</span>
        </div>
        <div className="cliente-nombre" style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{cliente.nombre}</div>
        {typeof atraso === 'number' && (
          <div style={{ marginTop: 2 }}>
            <span style={{ color: '#b77b00', fontWeight: 600, fontSize: 15, background: '#fff7e6', borderRadius: 8, padding: '2px 10px' }}>
              {atraso} días atraso
            </span>
          </div>
        )}
      </div>
      {mostrarNuevoCredito && (
        <button
          className="btn-nuevo-credito"
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
            onNuevoCredito();
          }}
        >
          Nuevo crédito
        </button>
      )}
      {mostrarAbonar && (
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
      )}
    </div>
  );
}

export default ClientesPage;
