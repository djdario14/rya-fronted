
import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Gasto, GastoCreate } from '../../../packages/types/gasto';

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

  useEffect(() => {
    fetchGastosSemana();
  }, []);

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
      fetchGastosSemana();
    } catch (err) {
      setError('Error al registrar el gasto');
    }
  };

  return (
    <div>
      <div style={{ maxWidth: 420, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0002', padding: 36 }}>
        <h2 style={{ margin: 0, marginBottom: 24, fontWeight: 700, fontSize: 28, color: '#219653' }}>Registrar Gasto</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Monto</label>
            <input type="number" value={monto} onChange={e => setMonto(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 17 }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Descripción</label>
            <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 17 }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Fecha</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 17 }} />
          </div>
          {error && <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ color: '#219653', marginBottom: 12 }}>¡Gasto registrado!</div>}
          <button type="submit" style={{ background: '#219653', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 600, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 12px #21965322', transition: 'background 0.2s, box-shadow 0.2s' }}>
            Guardar Gasto
          </button>
        </form>
      </div>
      <div style={{ maxWidth: 420, margin: '32px auto 0', background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #0001', padding: 24 }}>
        <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22, color: '#219653' }}>Gastos de la semana</h3>
        {loading ? (
          <div>Cargando...</div>
        ) : gastos.length === 0 ? (
          <div style={{ color: '#888' }}>No hay gastos registrados esta semana.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {gastos.map(gasto => (
              <li key={gasto.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <div style={{ fontWeight: 600, color: '#219653' }}>${gasto.monto.toFixed(2)}</div>
                <div style={{ color: '#333' }}>{gasto.descripcion}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{new Date(gasto.fecha).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RegistrarGastoPage;
