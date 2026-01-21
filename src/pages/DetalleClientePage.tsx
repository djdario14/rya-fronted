
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
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 22, boxShadow: '0 4px 32px #29487d22', padding: 0, position: 'relative' }}>
      {/* Botón Volver flotante */}
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 18, left: 18, background: '#29487d', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 17, padding: '7px 22px', boxShadow: '0 2px 8px #29487d22', zIndex: 2 }}>
        ← Volver
      </button>
      <div style={{ padding: '60px 32px 32px 32px' }}>
        <h2 style={{ color: '#29487d', marginBottom: 16 }}>{cliente.nombre}</h2>
        <div><b>Cédula:</b> {cliente.cedula}</div>
        <div><b>Teléfono:</b> {cliente.telefono}</div>
        <div><b>Dirección:</b> {cliente.direccion}</div>
        <div><b>Saldo:</b> ${cliente.saldo}</div>
        <div><b>Préstamo:</b> ${cliente.prestamo}</div>
        <div><b>Cuotas pagadas:</b> {cliente.cuotasPagadas} / {cliente.cuotasTotal}</div>
        <div><b>Atraso:</b> {cliente.atraso} días</div>
      </div>
    </div>
  );
};

export default DetalleClientePage;
