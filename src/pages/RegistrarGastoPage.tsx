import React, { useState } from 'react';

const RegistrarGastoPage: React.FC = () => {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    // Aquí podrías hacer un fetch al backend para guardar el gasto
    setSuccess(true);
    setMonto('');
    setDescripcion('');
  };

  return (
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
  );
};

export default RegistrarGastoPage;
