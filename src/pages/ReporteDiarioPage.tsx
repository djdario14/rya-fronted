
import React, { useEffect, useState } from 'react';
import '../styles/mobile-layout.css';
import api from '../api/client';

const MetricCard = ({ title, value, type }: { title: string; value: string; type?: string }) => (
  <div className={`metric-card${type ? ' ' + type : ''}`}>
    <span>{title}</span>
    <strong>{value}</strong>
  </div>
);


const ReporteDiarioPage: React.FC = () => {
  const [cobradoHoy, setCobradoHoy] = useState<string>('$0');
  // Puedes agregar más estados para otras métricas si lo necesitas

  useEffect(() => {
    api.get<{ total: number }>('/pagos/suma-hoy')
      .then(res => {
        setCobradoHoy(`$${res.data.total ?? 0}`);
      })
      .catch(() => setCobradoHoy('$0'));
  }, []);

  const metrics = [
    { title: 'Cobrado hoy', value: cobradoHoy, type: 'success' },
    { title: 'Prestado hoy', value: '$0', type: 'info' },
    { title: 'Clientes con abono', value: '0 de 3 (0%)', type: '' },
    { title: 'Total por cobrar', value: '$11', type: '' },
    { title: 'Gastos del día', value: '$25', type: 'danger' },
  ];

  return (
    <div className="report-page">
      <header className="report-header">
        <button className="icon-btn" aria-label="Menú">☰</button>
        <h1 className="report-title">Reporte Diario</h1>
        <div className="avatar" />
      </header>
      <div className="report-date">
        <span role="img" aria-label="calendario">📅</span> 23 de Abril de 2024
      </div>
      <section className="cash-card">
        <span>Caja Real</span>
        <strong>$4,124</strong>
      </section>
      <section className="metrics">
        {metrics.map((m) => (
          <MetricCard key={m.title} title={m.title} value={m.value} type={m.type} />
        ))}
      </section>
    </div>
  );
}

export default ReporteDiarioPage;
