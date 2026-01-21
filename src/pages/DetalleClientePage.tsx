
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
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#f7f8fa', borderRadius: 28, boxShadow: '0 8px 40px #29487d18', padding: 0, position: 'relative' }}>
      {/* Botón Volver flotante */}
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 24, left: 24, background: '#2e7d5a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 18, padding: '8px 28px', boxShadow: '0 2px 12px #29487d22', zIndex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>←</span> Volver
      </button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, padding: '60px 32px 32px 32px' }}>
        {/* Panel principal */}
        <div style={{ flex: 2, minWidth: 340 }}>
          <div style={{ background: '#217a5b', borderRadius: 18, color: '#fff', padding: '28px 28px 20px 28px', marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px #217a5b22' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <span style={{ fontSize: 36, color: '#217a5b' }}>👤</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 26 }}>{cliente.nombre}</div>
                <div style={{ fontSize: 15, marginTop: 2, opacity: 0.95 }}>Cédula: {cliente.cedula}</div>
                <div style={{ fontSize: 15, opacity: 0.95 }}>Tel: {cliente.telefono}</div>
                <div style={{ fontSize: 15, opacity: 0.95 }}>Dirección: {cliente.direccion}</div>
                {/* <div style={{ fontSize: 15, opacity: 0.95 }}>Negocio: <span style={{ fontWeight: 600 }}>Casa</span></div> */}
              </div>
            </div>
            <button style={{ background: 'transparent', color: '#fff', border: '1.5px solid #fff', borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '7px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18 }}>📍</span> VER MAPA
            </button>
          </div>
          <div style={{ display: 'flex', gap: 18, marginBottom: 22 }}>
            <div style={{ background: '#fff', borderRadius: 14, flex: 1, padding: 22, boxShadow: '0 2px 8px #29487d11', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ color: '#217a5b', fontWeight: 700, fontSize: 26, marginBottom: 2 }}>${cliente.saldo.toFixed(2)}</div>
              <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Saldo</div>
              <div style={{ color: '#222', fontSize: 15 }}>Préstamo <b>${cliente.prestamo}</b></div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, flex: 1, padding: 22, boxShadow: '0 2px 8px #29487d11', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ color: '#888', fontSize: 14 }}>Préstamo registrado:</div>
              <div style={{ color: '#222', fontWeight: 600, fontSize: 18, marginTop: 2 }}>${cliente.prestamo}</div>
              <div style={{ color: '#888', fontSize: 14, marginTop: 8 }}>Cuotas</div>
              <div style={{ color: '#222', fontWeight: 600, fontSize: 16 }}>{cliente.cuotasPagadas} / {cliente.cuotasTotal}</div>
              <div style={{ color: '#888', fontSize: 14, marginTop: 8 }}>Atraso</div>
              <div style={{ color: cliente.atraso > 0 ? '#c62828' : '#217a5b', fontWeight: 700, fontSize: 17 }}>{cliente.atraso} días</div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, padding: 22, boxShadow: '0 2px 8px #29487d11', marginBottom: 22 }}>
            <div style={{ color: '#217a5b', fontWeight: 700, fontSize: 17, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>💸</span> Pagos registrados
            </div>
            <div style={{ color: '#aaa', fontSize: 15, marginLeft: 26 }}>No hay pagos registrados</div>
          </div>
        </div>
        {/* Panel lateral de acciones */}
        <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button style={{ background: '#fff', color: '#217a5b', border: '1.5px solid #217a5b', borderRadius: 12, fontWeight: 600, fontSize: 17, padding: '14px 0', marginBottom: 2, cursor: 'pointer', boxShadow: '0 2px 8px #29487d11', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>📑</span> Historial Crediticio
          </button>
          <button style={{ background: '#e8f5e9', color: '#217a5b', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 17, padding: '14px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>📅</span> Agendar Visita
          </button>
          <button style={{ background: '#e3f2fd', color: '#217a5b', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 17, padding: '14px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>💬</span> Enviar Mensaje
          </button>
          <button style={{ background: '#fff', color: '#888', border: '1.5px solid #ccc', borderRadius: 12, fontWeight: 600, fontSize: 17, padding: '14px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>✏️</span> EDITAR CLIENTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleClientePage;
