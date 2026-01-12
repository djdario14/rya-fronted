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
      } catch {
        setCliente(null);
      }
      setLoading(false);
    }
    fetchCliente();
  }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>;
  if (!cliente) return <div style={{ padding: 40, textAlign: 'center', color: '#e74c3c' }}>Cliente no encontrado</div>;

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #0002', width: 700, maxWidth: '100%', padding: 36, border: '1px solid #f0f0f0' }}>
        {/* Header azul + Botón Volver */}
        <div style={{ background: '#29487d', borderRadius: 14, padding: 28, color: '#fff', display: 'flex', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
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
          <button
            style={{ position: 'absolute', left: 24, top: 24, background: '#fff', color: '#29487d', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}
            onClick={() => navigate(-1)}
          >← Volver</button>
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
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 70 }}>
              <div style={{ fontSize: 20, color: '#29487d', fontWeight: 700, letterSpacing: 0.5 }}>Pagos registrados</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 180 }}>
            <button style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 19, cursor: 'pointer', marginBottom: 8 }}>+ ABONAR</button>
            <button style={{ background: '#29487d', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 8 }}>AGENDAR VISITA</button>
            <button style={{ background: '#fff', color: '#29487d', border: '1px solid #29487d', borderRadius: 10, padding: '16px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>ENVIAR MENSAJE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleClientePage;
