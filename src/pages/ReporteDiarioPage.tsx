import React, { useEffect, useState } from 'react';
import '../styles/theme.css';
import AppHeader from '../components/AppHeader';
import MainBalanceCard from '../components/MainBalanceCard';
import SummaryCard from '../components/SummaryCard';
import api from '../api/client';

const ReporteDiarioPage: React.FC = () => {
  const [cobradoHoy, setCobradoHoy] = useState<string>('$0');
  const [showPagosModal, setShowPagosModal] = useState(false);
  const [pagosHoy, setPagosHoy] = useState<{ cliente: string; monto: number }[]>([]);
  const [prestadoHoy, setPrestadoHoy] = useState<string>('$0');
  const [showPrestamosModal, setShowPrestamosModal] = useState(false);
  const [prestamosHoy, setPrestamosHoy] = useState<any[]>([]);
  const [cajaReal, setCajaReal] = useState<string>('$4,124');
  const [hoyExtra, setHoyExtra] = useState<string>('$312');
  const [clientesConAbono, setClientesConAbono] = useState<string>('0 de 3 (0%)');
  const [totalPorCobrar, setTotalPorCobrar] = useState<string>('$11');
  const [gastosDelDia, setGastosDelDia] = useState<string>('$25');

  useEffect(() => {
    api.get<{ total: number }>('/pagos/suma-hoy')
      .then(res => {
        setCobradoHoy(`$${res.data.total ?? 0}`);
      })
      .catch(() => setCobradoHoy('$0'));
    api.get<{ total: number }>('/prestamos/suma-hoy')
      .then(res => {
        setPrestadoHoy(`$${res.data.total ?? 0}`);
      })
      .catch(() => setPrestadoHoy('$0'));
  }, []);

  const handleCobradoHoyClick = async () => {
    try {
      const res = await api.get<{ cliente: string; monto: number }[]>('/pagos/hoy-detalle');
      setPagosHoy(res.data);
      setShowPagosModal(true);
    } catch {
      setPagosHoy([]);
      setShowPagosModal(true);
    }
  };

  const handlePrestadoHoyClick = async () => {
    try {
      const res = await api.get<any[]>('/prestamos/hoy-detalle');
      setPrestamosHoy(res.data);
      setShowPrestamosModal(true);
    } catch {
      setPrestamosHoy([]);
      setShowPrestamosModal(true);
    }
  };

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <AppHeader title="Reporte Diario" date="25 de Enero de 2026" avatar={<span role="img" aria-label="avatar">👤</span>} />
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '16px 0' }}>
        <MainBalanceCard label="Caja Real" amount={cajaReal} today={hoyExtra} />
        <div style={{ marginTop: 18, background: 'var(--color-card)', borderRadius: 18, boxShadow: '0 2px 16px #0001', padding: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 17, color: 'var(--color-text-main)', marginBottom: 10 }}>Resumen del día</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <SummaryCard title="Cobrado hoy" value={cobradoHoy} accentColor="#22C55E" icon={<span>✔️</span>} onClick={handleCobradoHoyClick} />
            <SummaryCard title="Prestado hoy" value={prestadoHoy} accentColor="#3B82F6" icon={<span>📘</span>} onClick={handlePrestadoHoyClick} />
            <SummaryCard title="Clientes con abono" value={clientesConAbono} accentColor="#E5E7EB" icon={<span>👥</span>} />
            <SummaryCard title="Gastos del día" value={gastosDelDia} accentColor="#EF4444" icon={<span>🔴</span>} />
            <SummaryCard title="Clientes nuevos" value={""} accentColor="#6366F1" icon={<span>🆕</span>} onClick={() => alert('Ver clientes nuevos')} />
          </div>
          <div style={{ marginTop: 18 }}>
            <SummaryCard title="Total por cobrar" value={totalPorCobrar} accentColor="#4CAF7A" icon={<span>💰</span>} />
          </div>
        </div>
      </div>


      {/* Modal de pagos del día */}
      {showPagosModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}
          onClick={() => setShowPagosModal(false)}
        >
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px #0004',
            padding: 32,
            minWidth: 320,
            maxWidth: 400,
            width: '90%',
            position: 'relative',
            cursor: 'auto'
          }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22, color: '#22C55E' }}>Pagos registrados hoy</h3>
            {pagosHoy.length === 0 ? (
              <div style={{ color: '#888', fontSize: 16 }}>No hay pagos registrados hoy.</div>
            ) : (
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {pagosHoy.map((p, i) => (
                  <li key={i} style={{ marginBottom: 10, fontSize: 17, color: '#222', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{p.cliente}</span>
                    <span style={{ fontWeight: 600 }}>${p.monto}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              style={{
                marginTop: 18,
                background: '#22C55E',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 32px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 12px #22C55E22',
                transition: 'background 0.2s, box-shadow 0.2s'
              }}
              onClick={() => setShowPagosModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de préstamos del día */}
      {showPrestamosModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}
          onClick={() => setShowPrestamosModal(false)}
        >
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px #0004',
            padding: 32,
            minWidth: 320,
            maxWidth: 400,
            width: '90%',
            position: 'relative',
            cursor: 'auto'
          }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22, color: '#3B82F6' }}>Préstamos registrados hoy</h3>
            {prestamosHoy.length === 0 ? (
              <div style={{ color: '#888', fontSize: 16 }}>No hay préstamos registrados hoy.</div>
            ) : (
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {prestamosHoy.map((p, i) => (
                  <li key={i} style={{ marginBottom: 10, fontSize: 17, color: '#222', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{p.cliente || p.nombre || 'Cliente'}</span>
                    <span style={{ fontWeight: 600 }}>${p.monto ?? p.valor ?? 0}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              style={{
                marginTop: 18,
                background: '#3B82F6',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '10px 32px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 12px #3B82F622',
                transition: 'background 0.2s, box-shadow 0.2s'
              }}
              onClick={() => setShowPrestamosModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Barra de navegación inferior (opcional) */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--color-card)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 60, boxShadow: '0 -2px 12px #0001' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <span style={{ fontSize: 22 }}>🏠</span>
          <div style={{ fontSize: 13 }}>Inicio</div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--color-primary)' }}>
          <span style={{ fontSize: 22 }}>📊</span>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Reporte</div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          <span style={{ fontSize: 22 }}>💬</span>
          <div style={{ fontSize: 13 }}>Mensajes</div>
        </div>
      </nav>
    </div>
  );
};

export default ReporteDiarioPage;
