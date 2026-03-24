
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Gasto, GastoCreate } from '../../../packages/types/gasto';

// Estilos base reutilizables
const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 24px #0002',
  padding: '24px',
  maxWidth: '98vw',
  margin: '24px auto',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
};

// Media query para pantallas pequeñas (opcional, si quieres más responsividad)
// Puedes agregar esto con una librería de CSS-in-JS o en un CSS externo:
// @media (max-width: 480px) { .card { padding: 12px !important; } }
const inputStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: '1.5px solid #e0e0e0',
  fontSize: 17,
  background: '#fafbfc',
  outline: 'none',
  marginBottom: 8,
  transition: 'border 0.2s',
  boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  marginBottom: 6,
  color: '#29487d',
  fontSize: 16,
};
const buttonStyle: React.CSSProperties = {
  background: '#219653',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '13px 36px',
  fontWeight: 700,
  fontSize: 19,
  cursor: 'pointer',
  boxShadow: '0 2px 12px #21965322',
  transition: 'background 0.2s, box-shadow 0.2s',
  marginTop: 8,
};
const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: 24,
  fontWeight: 700,
  fontSize: 32,
  color: '#219653',
  letterSpacing: '-1px',
  textAlign: 'left',
};
const successStyle: React.CSSProperties = {
  color: '#219653',
  marginBottom: 12,
  fontWeight: 600,
};
const errorStyle: React.CSSProperties = {
  color: '#e74c3c',
  marginBottom: 12,
  fontWeight: 600,
};
const gastosCardStyle: React.CSSProperties = {
  ...cardStyle,
  maxWidth: '98vw',
  margin: '20px auto 0 auto',
  padding: '5vw',
};

const RegistrarGastoPage: React.FC = () => {
  const navigate = useNavigate();
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  // Eliminar campo de fecha editable, siempre se usará la fecha actual
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGastosSemana = async () => {
    setLoading(true);
    try {
      const res = await api.get<Gasto[]>('/gastos/semana');
      setGastos(res.data);
    } catch (err) {
      setError('Error al cargar los gastos de la semana');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastosSemana();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!monto || isNaN(Number(monto)) || Number(monto) <= 0) {
      setError('Ingrese un monto válido (mayor a 0)');
      return;
    }
    if (!descripcion) {
      setError('Ingrese una descripción');
      return;
    }
    try {
      const payload: GastoCreate = {
        monto: Number(monto),
        descripcion,
        fecha: new Date().toISOString().slice(0, 10),
      };
      await api.post('/gastos/', payload);
      setSuccess(true);
      setMonto('');
      setDescripcion('');
      // Esperar a que el backend procese antes de refrescar la lista
      setTimeout(() => {
        fetchGastosSemana();
      }, 200);
    } catch (err) {
      setError('Error al registrar el gasto');
    }
  };
  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', padding: '4vw 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 600, display: 'flex', alignItems: 'flex-start' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#2e7d5a',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            padding: '7px 22px',
            marginBottom: 18,
            marginLeft: 0,
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #2e7d5a22',
          }}
        >
          <span style={{ fontSize: 20 }}>←</span> Volver
        </button>
      </div>
      <div style={{ ...cardStyle, width: '100%', maxWidth: 600 }}>
        <h2 style={sectionTitleStyle}>Registrar Gasto</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Monto</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Descripción</label>
            <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={inputStyle} />
          </div>
          {/* El campo de fecha ha sido eliminado, la fecha se asigna automáticamente */}
          {error && <div style={errorStyle}>{error}</div>}
          {success && <div style={successStyle}>¡Gasto registrado!</div>}
          <button type="submit" style={buttonStyle}
            onMouseOver={e => { e.currentTarget.style.background = '#176c3a'; e.currentTarget.style.boxShadow = '0 4px 16px #176c3a33'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#219653'; e.currentTarget.style.boxShadow = '0 2px 12px #21965322'; }}
          >
            Guardar Gasto
          </button>
        </form>
      </div>
      <div style={{ ...gastosCardStyle, width: '100%', maxWidth: 600 }}>
        <h3 style={{ ...sectionTitleStyle, fontSize: 24, marginBottom: 18 }}>Gastos de la semana</h3>
        {loading ? (
          <div style={{ color: '#888', fontSize: 16 }}>Cargando gastos...</div>
        ) : gastos.length === 0 ? (
          <div style={{ color: '#888', fontSize: 16 }}>No hay gastos registrados esta semana.</div>
        ) : (
          gastos.map(g => (
            <div key={g.id} style={{ marginBottom: 14, padding: 12, background: '#f7f8fa', borderRadius: 8, boxShadow: '0 1px 4px #0001' }}>
              <div style={{ fontWeight: 700, color: '#219653', fontSize: 18 }}>${g.monto.toFixed(2)}</div>
              <div style={{ color: '#29487d', fontWeight: 600 }}>{g.descripcion}</div>
              <div style={{ color: '#888', fontSize: 15 }}>{new Date(g.fecha).toLocaleString('es-EC', {
                timeZone: 'America/Guayaquil',
                year: '2-digit',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistrarGastoPage;
