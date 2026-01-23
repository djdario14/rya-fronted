
import React, { useEffect, useState } from 'react';
import api from '../api/client';
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
  const [pagos, setPagos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCliente() {
      setLoading(true);
      try {
        const res = await api.get(`/clientes/${id}`);
        const data = res.data as ClienteDetalle;
        const resSaldo = await api.get(`/clientes/${id}/saldo`);
        const saldoData = resSaldo.data as any;
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
          lat: data.direccion?.split(',')[0] ? Number(data.direccion?.split(',')[0]) : undefined,
          lng: data.direccion?.split(',')[1] ? Number(data.direccion?.split(',')[1]) : undefined,
        });
      } catch (error) {
        // Manejo de error si es necesario
      } finally {
        setLoading(false);
      }
    }
    fetchCliente();
  }, [id]);

  if (loading || !cliente) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <style>{`
        @media (max-width: 700px) {
          .detalle-movil {
            display: block !important;
          }
          .detalle-desktop {
            display: none !important;
          }
        }
        @media (min-width: 701px) {
          .detalle-movil {
            display: none !important;
          }
          .detalle-desktop {
            display: block !important;
          }
        }
      `}</style>
      {/* Vista móvil */}
      <div className="detalle-movil" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#2e7d5a',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            padding: '7px 22px',
            marginBottom: 18,
            width: 120,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20 }}>←</span> Volver
        </button>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #29487d18', padding: 20, marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#29487d', marginBottom: 2 }}>{cliente.nombre}</div>
          <div style={{ color: '#222', fontSize: 16 }}>
            <b>Saldo:</b> <span style={{ color: '#217a5b', fontWeight: 700 }}>${cliente.saldo}</span> &nbsp;|&nbsp; <b>Atraso:</b> <span style={{ color: cliente.atraso > 0 ? '#c62828' : '#217a5b', fontWeight: 700 }}>{cliente.atraso} días</span>
          </div>
          <button style={{
            background: 'linear-gradient(90deg, #217a5b 60%, #29487d 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 17,
            padding: '12px 0',
            marginTop: 10,
            boxShadow: '0 2px 8px #29487d22',
            width: '100%',
            letterSpacing: 1,
          }}>Abonar</button>
        </div>
      </div>
      {/* Vista desktop (layout anterior) */}
      <div className="detalle-desktop">
        {/* ...existing code... */}
        <div
          style={{
            maxWidth: 900,
            margin: '40px auto',
            background: '#f7f8fa',
            borderRadius: 28,
            boxShadow: '0 8px 40px #29487d18',
            padding: 0,
            position: 'relative',
          }}
        >
          {/* ...existing code... */}
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: '#2e7d5a',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 18,
              padding: '8px 24px',
              boxShadow: '0 2px 12px #29487d22',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>←</span> Volver
          </button>
          {/* ...existing code... */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 28,
              padding: '60px 12px 24px 12px',
            }}
          >
            {/* ...existing code... */}
            <div className="detalle-flex" style={{ display: 'flex', flexDirection: 'row', gap: 28, width: '100%' }}>
              {/* ...existing code... */}
              <div className="detalle-main" style={{ flex: 2, minWidth: 340 }}>
                {/* ...existing code... */}
                <div style={{ background: '#217a5b', borderRadius: 18, color: '#fff', padding: '24px 18px 16px 18px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px #217a5b22' }}>
                  {/* ...existing code... */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <span style={{ fontSize: 32, color: '#217a5b' }}>👤</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 22 }}>{cliente.nombre}</div>
                      <div style={{ fontSize: 14, marginTop: 2, opacity: 0.95 }}>Cédula: {cliente.cedula}</div>
                      <div style={{ fontSize: 14, opacity: 0.95 }}>Tel: {cliente.telefono}</div>
                      <div style={{ fontSize: 14, opacity: 0.95 }}>Dirección: {cliente.direccion}</div>
                    </div>
                  </div>
                  <button style={{ background: 'transparent', color: '#fff', border: '1.5px solid #fff', borderRadius: 8, fontWeight: 600, fontSize: 14, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>📍</span> VER MAPA
                  </button>
                </div>
                {/* ...existing code... */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  {/* ...existing code... */}
                  <div className="card" style={{ background: '#fff', borderRadius: 14, flex: 1, minWidth: 140, padding: 18, boxShadow: '0 2px 8px #29487d11', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ color: '#217a5b', fontWeight: 700, fontSize: 22, marginBottom: 2 }}>${cliente.saldo.toFixed(2)}</div>
                    <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Saldo</div>
                    <div style={{ color: '#222', fontSize: 14 }}>Préstamo <b>${cliente.prestamo}</b></div>
                  </div>
                  <div className="card" style={{ background: '#fff', borderRadius: 14, flex: 1, minWidth: 140, padding: 18, boxShadow: '0 2px 8px #29487d11', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ color: '#888', fontSize: 13 }}>Préstamo registrado:</div>
                    <div style={{ color: '#222', fontWeight: 600, fontSize: 16, marginTop: 2 }}>${cliente.prestamo}</div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 8 }}>Cuotas</div>
                    <div style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>{cliente.cuotasPagadas} / {cliente.cuotasTotal}</div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 8 }}>Atraso</div>
                    <div style={{ color: cliente.atraso > 0 ? '#c62828' : '#217a5b', fontWeight: 700, fontSize: 15 }}>{cliente.atraso} días</div>
                  </div>
                </div>
                {/* ...existing code... */}
                <div className="card-pagos" style={{ background: '#fff', borderRadius: 14, padding: 18, boxShadow: '0 2px 8px #29487d11', marginBottom: 16 }}>
                  <div style={{ color: '#217a5b', fontWeight: 700, fontSize: 15, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>💸</span> Pagos registrados
                  </div>
                  <div style={{ color: '#aaa', fontSize: 14, marginLeft: 22 }}>No hay pagos registrados</div>
                </div>
              </div>
              {/* ...existing code... */}
              <div className="detalle-side" style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button style={{ background: '#fff', color: '#217a5b', border: '1.5px solid #217a5b', borderRadius: 12, fontWeight: 600, fontSize: 16, padding: '13px 0', marginBottom: 2, cursor: 'pointer', boxShadow: '0 2px 8px #29487d11', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <span style={{ fontSize: 18 }}>📑</span> Historial Crediticio
                </button>
                <button style={{ background: '#e8f5e9', color: '#217a5b', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 16, padding: '13px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <span style={{ fontSize: 18 }}>📅</span> Agendar Visita
                </button>
                <button style={{ background: '#e3f2fd', color: '#217a5b', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 16, padding: '13px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <span style={{ fontSize: 18 }}>💬</span> Enviar Mensaje
                </button>
                <button style={{ background: '#fff', color: '#888', border: '1.5px solid #ccc', borderRadius: 12, fontWeight: 600, fontSize: 16, padding: '13px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <span style={{ fontSize: 18 }}>✏️</span> EDITAR CLIENTE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetalleClientePage;
