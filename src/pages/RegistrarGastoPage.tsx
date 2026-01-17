
import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Gasto, GastoCreate } from '../../../packages/types/gasto';

// Estilos base reutilizables
const getCardStyle = (dark: boolean): React.CSSProperties => ({
  background: dark ? '#23272f' : '#fff',
  borderRadius: 16,
  boxShadow: dark ? '0 4px 24px #0008' : '0 4px 24px #0002',
  padding: 36,
  maxWidth: 440,
  margin: '40px auto',
  fontFamily: 'Inter, sans-serif',
  color: dark ? '#f3f3f3' : 'inherit',
});
const getInputStyle = (dark: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: dark ? '1.5px solid #444' : '1.5px solid #e0e0e0',
  fontSize: 17,
  background: dark ? '#181a20' : '#fafbfc',
  color: dark ? '#f3f3f3' : 'inherit',
  outline: 'none',
  marginBottom: 8,
  transition: 'border 0.2s',
});
const getLabelStyle = (dark: boolean): React.CSSProperties => ({
  display: 'block',
  fontWeight: 600,
  marginBottom: 6,
  color: dark ? '#b3c6ff' : '#29487d',
  fontSize: 16,
});
const getButtonStyle = (dark: boolean): React.CSSProperties => ({
  background: dark ? '#29487d' : '#219653',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '13px 36px',
  fontWeight: 700,
  fontSize: 19,
  cursor: 'pointer',
  boxShadow: dark ? '0 2px 12px #29487d22' : '0 2px 12px #21965322',
  transition: 'background 0.2s, box-shadow 0.2s',
  marginTop: 8,
});
const getSectionTitleStyle = (dark: boolean): React.CSSProperties => ({
  margin: 0,
  marginBottom: 24,
  fontWeight: 700,
  fontSize: 32,
  color: dark ? '#b3c6ff' : '#219653',
  letterSpacing: '-1px',
  textAlign: 'left',
});
const getSuccessStyle = (dark: boolean): React.CSSProperties => ({
  color: dark ? '#b3c6ff' : '#219653',
  marginBottom: 12,
  fontWeight: 600,
});
const getErrorStyle = (dark: boolean): React.CSSProperties => ({
  color: dark ? '#ffb3b3' : '#e74c3c',
  marginBottom: 12,
  fontWeight: 600,
});
const getGastosCardStyle = (dark: boolean): React.CSSProperties => ({
  ...getCardStyle(dark),
  maxWidth: 440,
  margin: '32px auto 0 auto',
  padding: 28,
});
  const [darkMode, setDarkMode] = useState(false);

const RegistrarGastoPage: React.FC = () => {

  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!monto || isNaN(Number(monto))) {
      setError('Ingrese un monto válido');
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
        fecha,
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
    <div style={{ minHeight: '100vh', background: darkMode ? '#181a20' : '#f7f8fa', padding: '32px 0', transition: 'background 0.2s' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', textAlign: 'right' }}>
        <button
          style={{
            ...getButtonStyle(darkMode),
            background: darkMode ? '#222' : '#eee',
            color: darkMode ? '#b3c6ff' : '#29487d',
            fontSize: 15,
            padding: '8px 18px',
            margin: '0 0 18px 0',
            boxShadow: 'none',
            border: darkMode ? '1px solid #444' : '1px solid #e0e0e0',
          }}
          onClick={() => setDarkMode(m => !m)}
        >
          Cambiar a tema {darkMode ? 'claro' : 'oscuro'}
        </button>
      </div>
      <div style={getCardStyle(darkMode)}>
        <h2 style={getSectionTitleStyle(darkMode)}>Registrar Gasto</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={getLabelStyle(darkMode)}>Monto</label>
            <input type="number" value={monto} onChange={e => setMonto(e.target.value)} style={getInputStyle(darkMode)} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={getLabelStyle(darkMode)}>Descripción</label>
            <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={getInputStyle(darkMode)} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={getLabelStyle(darkMode)}>Fecha</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={getInputStyle(darkMode)} />
          </div>
          {error && <div style={getErrorStyle(darkMode)}>{error}</div>}
          {success && <div style={getSuccessStyle(darkMode)}>¡Gasto registrado!</div>}
          <button type="submit" style={getButtonStyle(darkMode)}
            onMouseOver={e => { e.currentTarget.style.background = darkMode ? '#29487d' : '#176c3a'; e.currentTarget.style.boxShadow = darkMode ? '0 4px 16px #29487d33' : '0 4px 16px #176c3a33'; }}
            onMouseOut={e => { e.currentTarget.style.background = darkMode ? '#29487d' : '#219653'; e.currentTarget.style.boxShadow = darkMode ? '0 2px 12px #29487d22' : '0 2px 12px #21965322'; }}
          >
            Guardar Gasto
          </button>
        </form>
      </div>
      <div style={getGastosCardStyle(darkMode)}>
          <h3 style={{ ...getSectionTitleStyle(darkMode), fontSize: 24, marginBottom: 8 }}>Gastos de la semana</h3>
          <div style={{ color: darkMode ? '#b3c6ff' : '#888', fontSize: 15, marginBottom: 10 }}>
            Solo se muestran los gastos registrados en la semana actual.
          </div>
        {loading ? (
          <div style={{ color: darkMode ? '#b3c6ff' : '#888', fontSize: 16 }}>Cargando gastos...</div>
        ) : gastos.length === 0 ? (
          <div style={{ color: darkMode ? '#b3c6ff' : '#888', fontSize: 16 }}>No hay gastos registrados esta semana.</div>
        ) : (
          gastos.map(g => (
            <div key={g.id} style={{ marginBottom: 14, padding: 12, background: darkMode ? '#23272f' : '#f7f8fa', borderRadius: 8, boxShadow: darkMode ? '0 1px 4px #0008' : '0 1px 4px #0001' }}>
              <div style={{ fontWeight: 700, color: darkMode ? '#b3c6ff' : '#219653', fontSize: 18 }}>${g.monto.toFixed(2)}</div>
              <div style={{ color: darkMode ? '#b3c6ff' : '#29487d', fontWeight: 600 }}>{g.descripcion}</div>
              <div style={{ color: darkMode ? '#b3c6ff' : '#888', fontSize: 15 }}>{new Date(g.fecha).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistrarGastoPage;
