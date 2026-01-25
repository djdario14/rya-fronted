
import React, { useEffect, useState } from 'react';
import '../styles/mobile-layout.css';
import api from '../api/client';
import PagosHoyModal from '../components/PagosHoyModal';


const MetricCard = ({ title, value, type, onClick }: { title: string; value: string; type?: string; onClick?: () => void }) => (
  <div className={`metric-card${type ? ' ' + type : ''}`} onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
    <span>{title}</span>
    <strong>{value}</strong>
  </div>
);


const ReporteDiarioPage: React.FC = () => {
  const [cobradoHoy, setCobradoHoy] = useState<string>('$0');
  const [showPagosModal, setShowPagosModal] = useState(false);
  const [pagosHoy, setPagosHoy] = useState<{ cliente: string; monto: number }[]>([]);
  const [prestadoHoy, setPrestadoHoy] = useState<string>('$0');

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

  const metrics = [
    { title: 'Cobrado hoy', value: cobradoHoy, type: 'success', onClick: handleCobradoHoyClick },
    { title: 'Prestado hoy', value: prestadoHoy, type: 'info' },
    { title: 'Clientes con abono', value: '0 de 3 (0%)', type: '' },
    { title: 'Total por cobrar', value: '$11', type: '' },
    { title: 'Gastos del día', value: '$25', type: 'danger' },
  ];

  // Obtener la fecha actual del sistema y formatearla en español
  const fechaActual = new Date();
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fechaFormateada = `${fechaActual.getDate()} de ${meses[fechaActual.getMonth()]} de ${fechaActual.getFullYear()}`;

  return (
    <div className="report-page">
      <header className="report-header">
        <button className="icon-btn" aria-label="Menú">☰</button>
        <h1 className="report-title">Reporte Diario</h1>
        <div className="avatar" />
      </header>
      <div className="report-date">
        <span role="img" aria-label="calendario">📅</span> {fechaFormateada}
      </div>
      <section className="cash-card">
        <span>Caja Real</span>
        <strong>$4,124</strong>
      </section>
      <section className="metrics">
        {metrics.map((m) => (
          <MetricCard key={m.title} title={m.title} value={m.value} type={m.type} onClick={m.onClick} />
        ))}
      </section>
      <PagosHoyModal open={showPagosModal} pagos={pagosHoy} onClose={() => setShowPagosModal(false)} />
    </div>
  );
}

export default ReporteDiarioPage;
