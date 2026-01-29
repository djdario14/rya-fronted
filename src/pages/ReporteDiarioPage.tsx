import React, { useEffect, useState } from 'react';
import NuevoClientesModal from '../components/NuevoClientesModal';
import GastosDelDiaModal from '../components/GastosDelDiaModal';
import { Cliente } from '../types/cliente';
import { Gasto } from '../types/gasto';
import { useTimezoneOffset } from '../context/TimezoneContext';
import '../styles/theme.css';
import AppHeader from '../components/AppHeader';
import MainBalanceCard from '../components/MainBalanceCard';
import SummaryCard from '../components/SummaryCard';
import api from '../api/client';

const ReporteDiarioPage: React.FC = () => {
    const [clientesNuevos, setClientesNuevos] = useState<number>(0);
    const [clientesNuevosList, setClientesNuevosList] = useState<Cliente[]>([]);
    const [showClientesNuevosModal, setShowClientesNuevosModal] = useState(false);
  const [cobradoHoy, setCobradoHoy] = useState<string>('$0');
  const [showPagosModal, setShowPagosModal] = useState(false);
  const [pagosHoy, setPagosHoy] = useState<{ cliente: string; monto: number }[]>([]);
  const [prestadoHoy, setPrestadoHoy] = useState<string>('$0');
  const [showPrestamosModal, setShowPrestamosModal] = useState(false);
  const [prestamosHoy, setPrestamosHoy] = useState<any[]>([]);
  const [cajaReal, setCajaReal] = useState<string>('$0');
  // Estados numéricos para la lógica de caja
  const [cobradoHoyNum, setCobradoHoyNum] = useState(0);
  const [prestadoHoyNum, setPrestadoHoyNum] = useState(0);
  const [gastosDelDiaNum, setGastosDelDiaNum] = useState(0);
  const [hoyExtra, setHoyExtra] = useState<string>('$312');
  const [clientesConAbono, setClientesConAbono] = useState<string>('0 de 0 (0%)');
  const [totalPorCobrar, setTotalPorCobrar] = useState<string>('$11');
  const [gastosDelDia, setGastosDelDia] = useState<string>('$0');
  const [gastosDelDiaList, setGastosDelDiaList] = useState<Gasto[]>([]);
  const [showGastosDelDiaModal, setShowGastosDelDiaModal] = useState(false);

  const offset = useTimezoneOffset();

    useEffect(() => {
        // Obtener clientes nuevos del día
        api.get<Cliente[]>(`/clientes/nuevos-hoy`).then(res => {
          setClientesNuevos(res.data.length);
          setClientesNuevosList(res.data);
        }).catch(() => {
          setClientesNuevos(0);
          setClientesNuevosList([]);
        });
    api.get<{ total: number }>('/pagos/suma-hoy')
      .then(res => {
        const total = res.data.total ?? 0;
        setCobradoHoy(`$${total}`);
        setCobradoHoyNum(total);
      })
      .catch(() => {
        setCobradoHoy('$0');
        setCobradoHoyNum(0);
      });

    // Obtener clientes con abono hoy y total de clientes
    Promise.all([
      api.get<{ cliente: string; monto: number }[]>('/pagos/hoy-detalle'),
      api.get<Cliente[]>('/clientes/con-saldo')
    ]).then(([pagosRes, clientesRes]) => {
      const clientesUnicos = new Set(pagosRes.data.map(p => p.cliente));
      const totalClientes = clientesRes.data.length;
      setClientesConAbono(`${clientesUnicos.size} de ${totalClientes}`);
    }).catch(() => setClientesConAbono('0 de 0 (0%)'));
    api.get<{ total: number }>('/prestamos/suma-hoy')
      .then(res => {
        const total = res.data.total ?? 0;
        setPrestadoHoy(`$${total}`);
        setPrestadoHoyNum(total);
      })
      .catch(() => {
        setPrestadoHoy('$0');
        setPrestadoHoyNum(0);
      });
    // Obtener gastos del día según zona horaria global
    api.get<Gasto[]>(`/gastos/del-dia?offset=${offset}`)
      .then(res => {
        const total = res.data.reduce((acc, gasto) => acc + (gasto.monto || 0), 0);
        setGastosDelDia(`$${total}`);
        setGastosDelDiaNum(total);
        setGastosDelDiaList(res.data);
      })
      .catch(() => {
        setGastosDelDia('$0');
        setGastosDelDiaNum(0);
        setGastosDelDiaList([]);
      });
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

  // Calcular caja real
  useEffect(() => {
    const caja = cobradoHoyNum - prestadoHoyNum - gastosDelDiaNum;
    setCajaReal(`$${caja}`);
  }, [cobradoHoyNum, prestadoHoyNum, gastosDelDiaNum]);

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
            <SummaryCard title="Clientes nuevos" value={clientesNuevos.toString()} accentColor="#6366F1" icon={<span>🆕</span>} onClick={() => setShowClientesNuevosModal(true)} />

                  {/* Modal de clientes nuevos de hoy */}
                  <NuevoClientesModal
                    isOpen={showClientesNuevosModal}
                    onClose={() => setShowClientesNuevosModal(false)}
                    clientes={clientesNuevosList}
                  />
            <SummaryCard
              title="Gastos del día"
              value={gastosDelDia}
              accentColor="#EF4444"
              icon={<span>🔴</span>}
              onClick={() => setShowGastosDelDiaModal(true)}
            />

                  {/* Modal de gastos del día */}
                  <GastosDelDiaModal
                    isOpen={showGastosDelDiaModal}
                    onClose={() => setShowGastosDelDiaModal(false)}
                    gastos={gastosDelDiaList}
                  />
            <SummaryCard title="Clientes con abono" value={clientesConAbono} accentColor="#7C3AED" icon={<span>👥</span>} />
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

      {/* Barra de navegación inferior eliminada por solicitud del usuario */}
    </div>
  );
};

export default ReporteDiarioPage;
