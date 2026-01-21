
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
    <div style={{ maxWidth: 800, margin: '40px auto', background: '#f7f8fa', borderRadius: 28, boxShadow: '0 8px 40px #29487d18', padding: 0, position: 'relative' }}>
      {/* Botón Volver flotante */}
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 24, left: 24, background: '#2e7d5a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 18, padding: '8px 28px', boxShadow: '0 2px 12px #29487d22', zIndex: 2 }}>
        ← Volver
      </button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: '60px 32px 32px 32px' }}>
        {/* Panel principal */}
        <div style={{ flex: 2, minWidth: 320 }}>
          <div style={{ background: '#217a5b', borderRadius: 16, color: '#fff', padding: '24px 24px 18px 24px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <span style={{ fontSize: 32, color: '#217a5b' }}>👤</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 24 }}>{cliente.nombre}</div>
                <div style={{ fontSize: 15, marginTop: 2 }}>Cédula: {cliente.cedula}</div>
                <div style={{ fontSize: 15 }}>Tel: {cliente.telefono}</div>
                <div style={{ fontSize: 15 }}>Dirección: {cliente.direccion}</div>
              </div>
            </div>
            <button style={{ background: 'transparent', color: '#fff', border: '1.5px solid #fff', borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '7px 18px', cursor: 'pointer' }}>
              VER MAPA
            </button>
          </div>
          <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
            <div style={{ background: '#fff', borderRadius: 12, flex: 1, padding: 18, boxShadow: '0 2px 8px #29487d11' }}>
              <div style={{ color: '#217a5b', fontWeight: 700, fontSize: 22, marginBottom: 2 }}>${cliente.saldo.toFixed(2)}</div>
              <div style={{ color: '#888', fontSize: 13 }}>Saldo</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, flex: 1, padding: 18, boxShadow: '0 2px 8px #29487d11' }}>
              <div style={{ color: '#888', fontSize: 13 }}>Préstamo registrado:</div>
              <div style={{ color: '#222', fontWeight: 600, fontSize: 16, marginTop: 2 }}>${cliente.prestamo}</div>
              <div style={{ color: '#888', fontSize: 13 }}>Cuotas</div>
              <div style={{ color: '#222', fontWeight: 600, fontSize: 16 }}>{cliente.cuotasPagadas} / {cliente.cuotasTotal}</div>
              <div style={{ color: '#888', fontSize: 13 }}>Atraso</div>
              <div style={{ color: '#c62828', fontWeight: 600, fontSize: 16 }}>{cliente.atraso} días</div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #29487d11', marginBottom: 18 }}>
            <div style={{ color: '#888', fontWeight: 600, marginBottom: 6 }}>Pagos registrados</div>
            <div style={{ color: '#aaa', fontSize: 15 }}>No hay pagos registrados</div>
          </div>
        </div>
        {/* Panel lateral de acciones */}
        <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button style={{ background: '#fff', color: '#217a5b', border: '1.5px solid #217a5b', borderRadius: 10, fontWeight: 600, fontSize: 16, padding: '12px 0', marginBottom: 2, cursor: 'pointer', boxShadow: '0 2px 8px #29487d11' }}>Historial Crediticio</button>
          <button style={{ background: '#e8f5e9', color: '#217a5b', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 16, padding: '12px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11' }}>Agendar Visita</button>
          <button style={{ background: '#e3f2fd', color: '#217a5b', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 16, padding: '12px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11' }}>Enviar Mensaje</button>
          <button style={{ background: '#fff', color: '#888', border: '1.5px solid #ccc', borderRadius: 10, fontWeight: 600, fontSize: 16, padding: '12px 0', cursor: 'pointer', boxShadow: '0 2px 8px #29487d11' }}>EDITAR CLIENTE</button>
        </div>
      </div>
    </div>
  );
};

export default DetalleClientePage;
