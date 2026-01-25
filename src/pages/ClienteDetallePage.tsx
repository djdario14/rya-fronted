import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import ClientHeaderCard from '../components/ClientHeaderCard';
import BalanceCard from '../components/BalanceCard';
import PrimaryActionButton from '../components/PrimaryActionButton';
import '../styles/theme.css';

export default function ClienteDetallePage() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<any>(null);
  type SaldoResponse = {
    saldo: number;
    prestamo: number;
    cuotasTotal: number;
    cuotasPagadas: number;
    atraso: number;
    fecha?: string;
  };
  const [saldo, setSaldo] = useState<SaldoResponse | null>(null);
    const [fechaCredito, setFechaCredito] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
        api.get(`/clientes/${id}`).then(res => setCliente(res.data));
        api.get(`/clientes/${id}/saldo`).then(res => {
          const data = res.data as SaldoResponse;
          setSaldo(data);
          // Solo asigna si existe la propiedad fecha
          if ('fecha' in data && data.fecha) {
            setFechaCredito(data.fecha);
          } else {
            setFechaCredito(null);
          }
        });
    }
  }, [id]);

  if (!cliente || !saldo) return <div style={{ padding: 32 }}>Cargando...</div>;

  // Ubicación GPS (extraída de dirección si es formato "lat,lng" o muestra dirección textual)
  let gps = null;
  if (cliente.direccion && cliente.direccion.includes(',')) {
    const [lat, lng] = cliente.direccion.split(',');
    gps = { lat: lat.trim(), lng: lng.trim() };
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 32 }}>
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
        />
        <BalanceCard
          balance={`$${saldo.saldo}`}
          loan={`$${saldo.prestamo}`}
          installments={`${saldo.cuotasPagadas} / ${saldo.cuotasTotal}`}
          delayDays={`${saldo.atraso} días`}
        />
        {/* Fecha de creación del crédito debajo del saldo */}
        <div style={{marginTop: -12, marginBottom: 8, textAlign: 'right', color: '#888', fontSize: 13}}>
          {fechaCredito ? `Creado el ${new Date(fechaCredito).toLocaleDateString()}` : ''}
        </div>
        <PrimaryActionButton label={<><span style={{display:'inline-flex',alignItems:'center',gap:6}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle'}}><rect x="3" y="4" width="18" height="16" rx="2" stroke="#fff" strokeWidth="2"/><path d="M8 2v4M16 2v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="14" r="3" fill="#fff"/></svg> Historial crediticio</span></>} color="#22C55E" onPress={() => alert('Historial crediticio')} />
        <PrimaryActionButton label={<><span style={{display:'inline-flex',alignItems:'center',gap:6}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle'}}><rect x="3" y="4" width="18" height="16" rx="2" stroke="#fff" strokeWidth="2"/><path d="M8 2v4M16 2v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><rect x="7" y="10" width="10" height="2" rx="1" fill="#fff"/></svg> Agendar visita</span></>} color="#2563EB" onPress={() => alert('Agendar visita')} />
        <button style={{ width: '100%', height: 52, borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#111827', background: '#fff', border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12, boxShadow: '0 2px 12px #0001', cursor: 'pointer' }}
          onClick={() => window.open(`https://wa.me/${cliente.telefono.replace(/[^\d]/g, '')}`, '_blank')}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: 24, height: 24 }} /> Enviar mensaje
        </button>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22C55E', fontWeight: 600, fontSize: 15 }}>
            <span style={{ fontSize: 20 }}>�</span> Pagos registrados
          </div>
          <div style={{ color: '#888', fontSize: 14, marginTop: 6 }}>No hay pagos registrados</div>
        </div>
      </div>
    </div>
  );
}
