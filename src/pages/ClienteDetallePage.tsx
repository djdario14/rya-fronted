import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import ClientHeaderCard from '../components/ClientHeaderCard';
import BalanceCard from '../components/BalanceCard';
import PrimaryActionButton from '../components/PrimaryActionButton';
import AgendarVisitaModal from '../components/AgendarVisitaModal';
import EditClienteModal from '../components/EditClienteModal';

type Cliente = {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  negocio: string;
  // Agrega otros campos si es necesario
};
import '../styles/theme.css';

export default function ClienteDetallePage() {
  const { id } = useParams<{ id: string }>();
  const [showAgendarVisita, setShowAgendarVisita] = useState(false);
  type Recordatorio = {
    id: number;
    cliente_id: number;
    fecha: string;
    nota: string;
    creado_en: string;
    leido: number;
  };
  const [recordatorios, setRecordatoriosState] = useState<Recordatorio[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  // Detectar recordatorios vencidos y no leídos
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Actualiza cada minuto
    return () => clearInterval(timer);
  }, []);
  const pendientes = recordatorios.filter(r => r.leido === 0 && new Date(r.fecha) <= now);

  // Cargar recordatorios del backend al montar (por cliente)
  useEffect(() => {
    if (id) {
      api.get(`/recordatorios/cliente/${id}`)
        .then(res => setRecordatoriosState(res.data as Recordatorio[]))
        .catch(() => setRecordatoriosState([]));
    }
  }, [id]);

  // Setter para recordatorios (sin localStorage)
  const setRecordatorios = (fn: (prev: any[]) => any[]) => {
    setRecordatoriosState(prev => fn(prev as Recordatorio[]));
  };
  type Pago = {
    id: number;
    monto: number;
    fecha: string;
    motivo_no_pago?: string | null;
  };
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  type SaldoResponse = {
    saldo: number;
    prestamo: number;
    interes: number;
    total_credito: number;
    valor_cuota: number;
    cuotasTotal: number;
    cuotasPagadas: number;
    atraso: number;
    creado_en?: string;
  };
  const [saldo, setSaldo] = useState<SaldoResponse | null>(null);
  const [fechaCredito, setFechaCredito] = useState<string | null>(null);
  const [showEditCliente, setShowEditCliente] = useState(false);
  // Para refrescar datos tras registrar crédito
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (id) {
      api.get(`/clientes/${id}`).then(res => setCliente(res.data as Cliente));
      api.get(`/clientes/${id}/saldo`).then(res => {
        const data = res.data as SaldoResponse;
        setSaldo(data);
        if ('creado_en' in data && data.creado_en) {
          setFechaCredito(data.creado_en);
        } else {
          setFechaCredito(null);
        }
      });
      api.get(`/clientes/${id}/pagos`).then(res => setPagos(res.data as Pago[]));
    }
  }, [id, refreshKey]);

  if (!cliente || !saldo) return <div style={{ padding: 32 }}>Cargando...</div>;

  // Ubicación GPS (extraída de dirección si es formato "lat,lng" o muestra dirección textual)
  let gps = null;
  if (cliente.direccion && cliente.direccion.includes(',')) {
    const [lat, lng] = cliente.direccion.split(',');
    gps = { lat: lat.trim(), lng: lng.trim() };
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 32 }}>
      {showNotif && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0007', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px #0002', textAlign: 'center' }}>
            <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Recordatorio de visita</h3>
            {pendientes.length > 0 ? (
              pendientes.map((r, i) => (
                <div key={i} style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>
                    {(() => {
                      // Asegurar que la fecha se interpreta como UTC
                      const fechaUtc = typeof r.fecha === 'string' && r.fecha.endsWith('Z')
                        ? new Date(r.fecha)
                        : new Date(r.fecha + 'Z');
                      return fechaUtc.toLocaleString('es-EC', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        timeZone: 'America/Guayaquil',
                      });
                    })()}
                  </div>
                  <div style={{ color: '#2563EB', margin: '8px 0', fontWeight: 500 }}>{r.nota}</div>
                  <button onClick={async () => {
                    try {
                      await api.put(`/recordatorios/${r.id}`, { ...r, leido: 1 });
                      // Refrescar lista desde backend
                      if (id) {
                        const res = await api.get(`/recordatorios/cliente/${id}`);
                        setRecordatoriosState(res.data as Recordatorio[]);
                      }
                    } catch {}
                    setShowNotif(false);
                  }} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>OK</button>
                </div>
              ))
            ) : (
              <div style={{ color: '#888', fontSize: 16, margin: '24px 0' }}>No hay recordatorios pendientes</div>
            )}
            <button onClick={() => setShowNotif(false)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>Cerrar</button>
          </div>
        </div>
      )}
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '16px 0' }}>
        <ClientHeaderCard
          name={cliente.nombre}
          id={cliente.cedula}
          phone={cliente.telefono}
          onMapTap={() => {
            if (gps) {
              window.open(`https://www.google.com/maps/search/?api=1&query=${gps.lat},${gps.lng}`, '_blank');
            } else {
              alert(cliente.direccion);
            }
          }}
          onEdit={() => setShowEditCliente(true)}
        />
        {/* Calcular cuotas pagadas según fórmula: (total_credito - saldo) / valor_cuota */}
        {(() => {
          const cuotasPagadas = saldo.valor_cuota > 0 ? Math.round((saldo.total_credito - saldo.saldo) / saldo.valor_cuota) : 0;
          return (
            <BalanceCard
              balance={`$${saldo.saldo}`}
              loan={`$${saldo.prestamo}`}
              installments={`${cuotasPagadas} / ${saldo.cuotasTotal}`}
              delayDays={`${saldo.atraso} días`}
              date={fechaCredito ? fechaCredito.split('-').reverse().join('/') : ''}
            />
          );
        })()}
        {/* Botón 'Registrar nuevo crédito' eliminado */}
        <PrimaryActionButton label={<><span style={{display:'inline-flex',alignItems:'center',gap:6}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle'}}><rect x="3" y="4" width="18" height="16" rx="2" stroke="#fff" strokeWidth="2"/><path d="M8 2v4M16 2v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" fill="#fff"/></svg> Historial crediticio</span></>} color="#22C55E" onPress={() => alert('Historial crediticio')} />
        <PrimaryActionButton label={<><span style={{display:'inline-flex',alignItems:'center',gap:6}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle'}}><rect x="3" y="4" width="18" height="16" rx="2" stroke="#fff" strokeWidth="2"/><path d="M8 2v4M16 2v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><rect x="7" y="10" width="10" height="2" rx="1" fill="#fff"/></svg> Agendar visita</span></>} color="#2563EB" onPress={() => setShowAgendarVisita(true)} />
              <AgendarVisitaModal
                open={showAgendarVisita}
                onClose={() => setShowAgendarVisita(false)}
                onSave={async (fecha, nota) => {
                  if (!cliente) return;
                  try {
                              // Convertir la fecha local a UTC antes de enviar
                              const fechaUtc = new Date(fecha).toISOString();
                              const payload = {
                                cliente_id: cliente.id,
                                fecha: fechaUtc,
                                nota,
                                creado_en: new Date().toISOString(),
                                leido: 0
                              };
                    console.log('Payload recordatorio:', payload);
                    await api.post('/recordatorios/', payload);
                    // Refrescar lista desde backend para asegurar hora correcta
                    if (cliente?.id) {
                      const res = await api.get(`/recordatorios/cliente/${cliente.id}`);
                      setRecordatoriosState(res.data as Recordatorio[]);
                    }
                  } catch (err: any) {
                    let mensaje = 'Error al guardar el recordatorio';
                    if (err && err.response && err.response.data) {
                      const data = err.response.data;
                      if (typeof data === 'string') mensaje = data;
                      else if (typeof data === 'object' && data.detail) mensaje = data.detail;
                      else if (typeof data === 'object') mensaje = JSON.stringify(data);
                    } else if (err && err.message) {
                      mensaje = err.message;
                    }
                    alert(mensaje);
                    console.error('Error al guardar recordatorio:', err);
                  }
                  setShowAgendarVisita(false);
                }}
                clienteNombre={cliente.nombre}
              />

        <button style={{ width: '100%', height: 52, borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#111827', background: '#fff', border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12, boxShadow: '0 2px 12px #0001', cursor: 'pointer' }}
          onClick={() => window.open(`https://wa.me/${cliente.telefono.replace(/[^\d]/g, '')}`, '_blank')}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: 24, height: 24 }} /> Enviar mensaje
        </button>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22C55E', fontWeight: 600, fontSize: 15 }}>
            <span style={{ fontSize: 20 }}>✔️</span> Pagos registrados
          </div>
          {pagos.length === 0 ? (
            <div style={{ color: '#888', fontSize: 14, marginTop: 6 }}>No hay pagos registrados</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 8 }}>
              {pagos.map((p) => (
                <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 15 }}>
                  <span>{new Date(p.fecha).toLocaleString('es-EC', {
                    timeZone: 'America/Guayaquil',
                    year: '2-digit',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}</span>
                  <span style={{ fontWeight: 600, color: '#22C55E' }}>${p.monto}</span>
                  {p.motivo_no_pago && <span style={{ color: '#e53935', fontSize: 13, marginLeft: 8 }}>({p.motivo_no_pago})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {showEditCliente && (
        <EditClienteModal
          cliente={cliente}
          onClose={() => setShowEditCliente(false)}
          onSave={async (data: Partial<Cliente>) => {
            await api.put(`/clientes/${cliente.id}`, data);
            setShowEditCliente(false);
            // Recargar datos del cliente
            const res = await api.get(`/clientes/${cliente.id}`);
            setCliente(res.data as Cliente);
          }}
        />
      )}
    </div>
  );
}
