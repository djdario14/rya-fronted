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
  const [saldo, setSaldo] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.get(`/clientes/${id}`).then(res => setCliente(res.data));
      api.get(`/clientes/${id}/saldo`).then(res => setSaldo(res.data));
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
        <PrimaryActionButton label="Historial crediticio" color="#22C55E" icon={<img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/svg/1f4c4.svg" alt="Historial" style={{ width: 22, height: 22 }} />} onPress={() => alert('Historial crediticio')} />
        <PrimaryActionButton label="Agendar Visita" color="#2563EB" icon={<img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/svg/1f4c5.svg" alt="Calendario" style={{ width: 22, height: 22 }} />} onPress={() => alert('Agendar visita')} />
        <button style={{ width: '100%', height: 52, borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#111827', background: '#fff', border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12, boxShadow: '0 2px 12px #0001', cursor: 'pointer' }}
          onClick={() => window.open(`https://wa.me/${cliente.telefono.replace(/[^\d]/g, '')}`, '_blank')}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: 24, height: 24 }} /> Enviar mensaje
        </button>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22C55E', fontWeight: 600, fontSize: 15 }}>
            <span style={{ fontSize: 20 }}>📍</span> Dirección
          </div>
          <div style={{ color: '#111827', fontSize: 15, marginTop: 6 }}>{cliente.direccion}</div>
        </div>
      </div>
    </div>
  );
}
