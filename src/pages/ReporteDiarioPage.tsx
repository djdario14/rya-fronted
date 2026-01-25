
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

}

export default ReporteDiarioPage;
