// Motivos de no pago
const motivosNoPago = [
  'No tiene',
  'No está',
  'Dejó de trabajar',
  'Mañana paga',
  'Clavo',
];

import React, { useState, useEffect } from 'react';
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

  // Llamar a fetchClientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // --- RETURN PRINCIPAL REESTRUCTURADO ---
  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      {/* Sidebar y barra superior */}
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
          // Aquí podrías guardar el orden en backend o localStorage si lo deseas
          // Por ahora solo reordena la lista localmente
          setClientes(prev => orden.map(o => prev.find(c => c.id === o.id) || { id: o.id, nombre: o.nombre }));
          setShowOrdenarModal(false);
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          <button
            style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#444', marginRight: 8 }}
            title="Menú"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú lateral"
          >
            <span style={{ fontWeight: 700 }}>&#9776;</span>
          </button>
          <input
            type="text"
            placeholder="Buscar cliente"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: 10,
              border: '1px solid #e0e0e0',
              fontSize: 18,
              background: '#fafbfc',
              outline: 'none',
              marginRight: 16
            }}
          />
          <span style={{ fontSize: 22, color: '#f1b900', marginRight: 18 }} title="Notificaciones">🔔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', borderRadius: 20, padding: '6px 16px', boxShadow: '0 1px 4px #0001', fontWeight: 600, fontSize: 16 }}>
            <span style={{ fontSize: 22, color: '#6c63ff' }}>👤</span>
            Usuario
            <span style={{ background: '#e74c3c', color: '#fff', borderRadius: '50%', fontSize: 13, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>1</span>
          </div>
        </div>
        <button style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 36px', fontWeight: 600, fontSize: 19, cursor: 'pointer', boxShadow: '0 2px 12px #21965322', transition: 'background 0.2s, box-shadow 0.2s', marginLeft: 24 }}
          onMouseOver={e => { e.currentTarget.style.background = '#176c3a'; e.currentTarget.style.boxShadow = '0 4px 16px #176c3a33'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#219653'; e.currentTarget.style.boxShadow = '0 2px 12px #21965322'; }}
          onClick={() => setShowModal(true)}
        >
          + Agregar Cliente
        </button>
      </div>

      {/* Título y tabs */}
      <h2 style={{ margin: '0 0 12px 0', fontSize: 34, fontWeight: 700, letterSpacing: '-1px' }}>Clientes</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
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
        >
          Todos
        </button>
      </div>

      {/* Modal para agregar cliente */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 36, minWidth: 400, width: 420, position: 'relative' }}>
            <h3 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700, fontSize: 24 }}>Agregar Cliente</h3>
            <form onSubmit={async e => {
              e.preventDefault();
              setSaving(true);
              setError('');
              // Unir código de país seleccionado y número antes de guardar
              const telefonoCompleto = `${countryCode}${form.telefono}`;
              try {
                const res = await fetch('https://rya-backend-production.up.railway.app/clientes/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    nombre: form.nombre,
                    cedula: form.cedula,
                    direccion: form.direccion,
                    negocio: form.negocio,
                    telefono: telefonoCompleto
                  })
                });
                if (res.status === 409) {
                  setError('La cédula ya está registrada');
                } else if (!res.ok) {
                  setError('No se pudo guardar el cliente');
                } else {
                  // Cliente agregado con éxito
                  const nuevo = await res.json();
                  setShowModal(false);
                  setForm({
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
                  setCountryCode('+593');
                  setNuevoCliente(nuevo);
                  setShowSuccessModal(true);
                  fetchClientes();
                }
              } catch (err) {
                setError('No se pudo guardar el cliente');
              }
              setSaving(false);
            }}>
              <input type="text" placeholder="Nombre" required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, marginBottom: 12 }} />
              <input type="text" placeholder="Cédula" required value={form.cedula} onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, marginBottom: 12 }} />
              <input type="text" placeholder="Dirección (GPS)" required value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, marginBottom: 12 }} />
              <input type="text" placeholder="Negocio" required value={form.negocio} onChange={e => setForm(f => ({ ...f, negocio: e.target.value }))} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, marginBottom: 12 }} />
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)} style={{ padding: '10px 8px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16, minWidth: 90 }}>
                  {countryCodes.map(c => (
                    <option key={c.code} value={c.code}>{c.code} {c.name}</option>
                  ))}
                </select>
                <input type="tel" placeholder="Teléfono" required value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16 }} />
              </div>
              {error && <div style={{ color: '#e74c3c', marginTop: 12 }}>{error}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: '#e9ecef', color: '#444', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px #21965322', opacity: saving ? 0.7 : 1 }}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} title="Cerrar">×</button>
          </div>
        </div>
      )}

      {/* Modals de éxito y crédito */}
      {showSuccessModal && (
        <SuccessModal
          message="¡Cliente registrado exitosamente!"
          onClose={() => {
            setShowSuccessModal(false);
            setShowCreditoModal(true);
          }}
        />
      )}
      {showCreditoModal && (
        <CreditoModal 
          clienteNombre={nuevoCliente?.nombre ?? ''}
          onClose={() => setShowCreditoModal(false)}
          onSubmit={async (data) => {
            if (!nuevoCliente?.id) return;
            // Registrar préstamo en backend
            try {
              const res = await fetch('https://rya-backend-production.up.railway.app/prestamos/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  cliente_id: nuevoCliente.id,
                  monto: data.valor,
                  fecha: data.fecha,
                  estado: 'activo'
                })
              });
              if (!res.ok) throw new Error('Error al registrar crédito');
              setShowCreditoModal(false);
              setShowPrestamoSuccess(true);
              fetchClientes();
            } catch {
              alert('No se pudo registrar el crédito');
            }
          }}
        />
      )}

      {showPrestamoSuccess && (
        <SuccessModal
          message="¡Crédito registrado exitosamente!"
          onClose={() => setShowPrestamoSuccess(false)}
        />
      )}

      {/* Lista de clientes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18, padding: 40 }}>Cargando clientes...</div>
        ) : clientes.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: 18, padding: 40 }}>No hay clientes para mostrar.</div>
        ) : clientes
            .filter(cliente => cliente.nombre.toLowerCase().includes(search.toLowerCase()))
            .map((cliente, idx) => (
              <div key={idx} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: '24px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, transition: 'box-shadow 0.2s, transform 0.2s', animation: 'fadeIn 0.7s', border: '1px solid #f0f0f0', cursor: cliente.id !== -1 ? 'pointer' : 'default' }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px #21965322'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px) scale(1.01)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px #0002'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
                onClick={() => cliente.id !== -1 && navigate(`/clientes/${cliente.id}`)}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 23, marginBottom: 6, letterSpacing: '-0.5px' }}>{cliente.nombre}</div>
                  <div style={{ color: '#444', fontSize: 17 }}>
                    Saldo: <span style={{ color: '#219653', fontWeight: 700, fontSize: 18 }}>${cliente.saldo ?? 0}</span>
                    <span style={{ margin: '0 12px' }}>|</span>
                    Atraso: <span style={{ color: '#888', fontWeight: 500 }}>{cliente.atraso ?? '--'} días</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  {(cliente.saldo ?? 0) > 0 ? (
                    <button
                      style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px #21965322', transition: 'background 0.2s, box-shadow 0.2s' }}
                      onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#176c3a'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px #176c3a33'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = '#219653'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px #21965322'; }}
                      onClick={ev => { ev.stopPropagation(); setPagoCliente(cliente); setMonto(cliente.cuota ? String(cliente.cuota) : ''); setShowPagoModal(true); setNoPago(false); setMotivo(motivosNoPago[0]); }}
                    >
                      Abonar
                    </button>
                  ) : (
                    <button
                      style={{ background: '#29487d', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px #29487d22', transition: 'background 0.2s, box-shadow 0.2s' }}
                      onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#18325a'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px #18325a33'; }}
                      onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = '#29487d'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px #29487d22'; }}
                      onClick={ev => { ev.stopPropagation(); setNuevoCliente(cliente); setShowCreditoModal(true); }}
                    >
                      Nuevo crédito
                    </button>
                  )}
                  <button style={{ background: '#e9ecef', color: '#444', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 17, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#d1e7dd'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = '#e9ecef'; }}
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
        {/* Modal para registrar abono (fuera del map) */}
        {showPagoModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 36, minWidth: 400, width: 420, position: 'relative' }}>
              <h3 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700, fontSize: 24, textAlign: 'center' }}>Registrar Abono para {pagoCliente?.nombre}</h3>
              <form onSubmit={async e => {
                e.preventDefault();
                if (noPago) {
                  // Aquí podrías guardar el motivo de no pago en backend si lo deseas
                  setShowPagoModal(false);
                  setShowPagoSuccess(true);
                  return;
                }
                // Buscar préstamo activo del cliente
                let prestamoId = null;
                try {
                  const res = await fetch(`https://rya-backend-production.up.railway.app/prestamos/?cliente_id=${pagoCliente?.id}&estado=activo`);
                  const prestamos = await res.json();
                  if (Array.isArray(prestamos) && prestamos.length > 0) {
                    prestamoId = prestamos[0].id;
                  }
                } catch (err) {}
                if (!prestamoId) {
                  alert('No se encontró préstamo activo para este cliente');
                  return;
                }
                // Registrar abono en backend
                try {
                  const res = await fetch('https://rya-backend-production.up.railway.app/pagos/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      prestamo_id: prestamoId,
                      monto: Number(monto),
                      fecha: new Date().toISOString().slice(0, 10)
                    })
                  });
                  if (!res.ok) throw new Error('Error al registrar abono');
                  setShowPagoModal(false);
                  setShowPagoSuccess(true);
                  // Actualizar solo el cliente abonado en la lista
                  try {
                    const resSaldo = await fetch(`https://rya-backend-production.up.railway.app/clientes/${pagoCliente?.id}/saldo`);
                    const saldoData = await resSaldo.json();
                    setClientes(clientes => clientes.map(c => {
                      if (c.id === pagoCliente?.id) {
                        return { ...c, saldo: saldoData.saldo, atraso: saldoData.atraso };
                      }
                      return c;
                    }));
                  } catch (err) {}
                  fetchClientes();
                } catch (err) {}
              }}>
                {!noPago ? (
                  <>
                    <input type="number" placeholder="Monto del abono" required value={monto} onChange={e => setMonto(e.target.value)} style={{ padding: '12px 16px', borderRadius: 8, border: '1.5px solid #219653', fontSize: 18, marginBottom: 18, width: '100%' }} />
                    <div style={{ marginBottom: 18, padding: '10px 0', background: '#f7f8fa', borderRadius: 8 }}>
                      <label htmlFor="noPago" style={{ fontSize: 16, color: '#29487d', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox" id="noPago" checked={noPago} onChange={e => setNoPago(e.target.checked)} style={{ marginRight: 8, accentColor: '#219653', width: 18, height: 18 }} />
                        No registrar abono
                      </label>
                    </div>
                  </>
                ) : (
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 16, color: '#29487d', fontWeight: 600, marginBottom: 6, display: 'block' }}>Motivo de no abono:</label>
                    <select value={motivo} onChange={e => setMotivo(e.target.value)} style={{ padding: '12px 16px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 17, width: '100%' }}>
                      {motivosNoPago.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
                  <button type="button" onClick={() => setShowPagoModal(false)} style={{ background: '#e9ecef', color: '#444', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancelar</button>
                  <button type="submit" style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #21965322' }}>{noPago ? 'Guardar motivo' : 'Guardar abono'}</button>
                </div>
              </form>
              <button onClick={() => setShowPagoModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }} title="Cerrar">×</button>
            </div>
          </div>
        )}
    {/* cierre de la lista de clientes y modales */}
  </div>
</div>
  );
};

export default ClientesPage;
