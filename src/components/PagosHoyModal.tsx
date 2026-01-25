import React from 'react';

interface PagosHoyModalProps {
  open: boolean;
  pagos: { cliente: string; monto: number }[];
  onClose: () => void;
}

const PagosHoyModal: React.FC<PagosHoyModalProps> = ({ open, pagos, onClose }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,30,50,0.85)', zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a2236 80%, #29487d 100%)',
        borderRadius: 22,
        boxShadow: '0 8px 32px #0006',
        padding: 32,
        minWidth: 320,
        width: '95%',
        maxWidth: 420,
        position: 'relative',
        color: '#fff',
        border: '1.5px solid #29487d',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', color: '#fff', fontWeight: 700, opacity: 0.7 }}>×</button>
        <h3 style={{ marginTop: 0, marginBottom: 22, fontWeight: 800, fontSize: 24, letterSpacing: -1, color: '#FFD600', textAlign: 'center' }}>Pagos registrados hoy</h3>
        <div style={{ maxHeight: 340, overflowY: 'auto', borderRadius: 12, background: 'rgba(255,255,255,0.03)', boxShadow: '0 2px 8px #0002' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 8px', color: '#FFD600', fontWeight: 700, fontSize: 16, background: 'transparent' }}>Cliente</th>
                <th style={{ textAlign: 'right', padding: '10px 8px', color: '#FFD600', fontWeight: 700, fontSize: 16, background: 'transparent' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length === 0 ? (
                <tr><td colSpan={2} style={{ textAlign: 'center', color: '#bbb', padding: 18 }}>No hay pagos registrados hoy.</td></tr>
              ) : pagos.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '10px 8px', color: '#fff', fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 16 }}>{p.cliente}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', color: '#4efc8c', fontWeight: 800, minWidth: 80, fontSize: 16 }}>
                    ${p.monto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PagosHoyModal;
