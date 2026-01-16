import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ClienteDetalle {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  saldo: number;
  prestamo: number;
  cuotasPagadas: number;
  cuotasTotal: number;
  atraso: number;
  lat?: number;
  lng?: number;
}

const DetalleClientePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    async function fetchCliente() {
      setLoading(true);
      try {
        // Obtener datos básicos del cliente
        const res = await fetch(`https://rya-backend-production.up.railway.app/clientes/${id}`);
        const data = await res.json();
        // Obtener saldo y detalles reales
        const resSaldo = await fetch(`https://rya-backend-production.up.railway.app/clientes/${id}/saldo`);
        const saldoData = await resSaldo.json();
        setCliente({
          id: data.id,
          nombre: data.nombre,
          cedula: data.cedula,
          telefono: data.telefono,
          direccion: data.direccion,
          saldo: saldoData.saldo ?? 0,
          prestamo: saldoData.prestamo ?? 0,
          cuotasPagadas: saldoData.cuotasPagadas ?? 0,
          cuotasTotal: saldoData.cuotasTotal ?? 30,
          atraso: saldoData.atraso ?? 0,
          lat: data.direccion?.split(',')[0],
          lng: data.direccion?.split(',')[1],
        });
        // Obtener pagos registrados
        const resPagos = await fetch(`https://rya-backend-production.up.railway.app/pagos/cliente/${id}`);
        const pagosData = await resPagos.json();
        setPagos(pagosData);
      } catch {
        setCliente(null);
        setPagos([]);
      }
      setLoading(false);
    }
    fetchCliente();
  }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>;
  if (!cliente) return <div style={{ padding: 40, textAlign: 'center', color: '#e74c3c' }}>Cliente no encontrado</div>;

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #0002', width: 700, maxWidth: '100%', padding: 36, border: '1px solid #f0f0f0', position: 'relative' }}>
        {/* Botón Volver fuera del header */}
        <button
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            background: '#29487d',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 22px 8px 16px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #0001',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            zIndex: 2,
            transition: 'background 0.2s',
          }}
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
            <div style={{ fontSize: 28, fontWeight: 700 }}>{cliente.nombre}</div>
            <div style={{ fontSize: 17, marginTop: 4 }}>Cédula: <span style={{ fontWeight: 600 }}>{cliente.cedula}</span></div>
            <div style={{ fontSize: 17 }}>Tel: <span style={{ fontWeight: 600 }}>{cliente.telefono}</span></div>
          </div>
          <button style={{ background: '#fff', color: '#29487d', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginLeft: 18 }}
            onClick={() => window.open(`https://maps.google.com/?q=${cliente.lat},${cliente.lng}`, '_blank')}
          >VER MAPA</button>
        </div>
        {/* Saldo y acciones */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 28, marginBottom: 18 }}>
              <div style={{ fontSize: 19, color: '#888', marginBottom: 10 }}>Saldo</div>
              <div style={{ fontSize: 38, fontWeight: 700, color: '#219653', marginBottom: 18 }}>${cliente.saldo.toFixed(2)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#29487d', fontWeight: 600 }}>
                <div>Préstamo<br /><span style={{ color: '#222', fontWeight: 700, fontSize: 22 }}>${cliente.prestamo}</span></div>
                <div>Cuotas<br /><span style={{ color: '#222', fontWeight: 700, fontSize: 22 }}>{cliente.cuotasPagadas} / {cliente.cuotasTotal}</span></div>
                <div>Atraso<br /><span style={{ color: '#222', fontWeight: 700, fontSize: 22 }}>${cliente.atraso}</span></div>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 22, minHeight: 70 }}>
              <div style={{ fontSize: 20, color: '#29487d', fontWeight: 700, letterSpacing: 0.5, marginBottom: 10 }}>Pagos registrados</div>
              {pagos.length === 0 ? (
                <div style={{ color: '#888', fontSize: 16 }}>No hay pagos registrados</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {pagos.map((pago: any) => (
                    <li key={pago.id} style={{ marginBottom: 8, fontSize: 16, color: '#29487d', background: '#f2f6fa', borderRadius: 7, padding: '7px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {pago.motivo_no_pago ? (
                        <span style={{ color: '#e74c3c', fontWeight: 600 }}>Motivo: {pago.motivo_no_pago}</span>
                      ) : (
                        <span>Monto: <b>${pago.monto}</b> | Fecha: {pago.fecha}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 180 }}>
            <button style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 19, cursor: 'pointer', marginBottom: 8 }}>Historial Crediticio</button>
            <button style={{ background: '#29487d', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 8 }}>AGENDAR VISITA</button>
            <button
              style={{
                background: '#fff',
                color: '#29487d',
                border: '1px solid #29487d',
                borderRadius: 10,
                padding: '16px 0',
                fontWeight: 700,
                fontSize: 17,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10
              }}
              onClick={() => {
                if (cliente?.telefono) {
                  // Limpiar el número (quitar espacios, guiones, paréntesis)
                  const numero = cliente.telefono.replace(/[^\d+]/g, '');
                  window.open(`https://wa.me/${numero}`, '_blank');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.22-1.63A12.13 12.13 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.69.97.99-3.59-.23-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" fill="#25D366"/></svg>
              ENVIAR MENSAJE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleClientePage;
