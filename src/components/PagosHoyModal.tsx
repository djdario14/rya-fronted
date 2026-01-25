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
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 3000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 28, minWidth: 320, width: 360, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        <h3 style={{ marginTop: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Pagos registrados hoy</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 6, color: '#222', fontWeight: 700, minWidth: 120 }}>Cliente</th>
              <th style={{ textAlign: 'right', padding: 6, color: '#222', fontWeight: 700, minWidth: 80 }}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length === 0 ? (
              <tr><td colSpan={2} style={{ textAlign: 'center', color: '#888', padding: 16 }}>No hay pagos registrados hoy.</td></tr>
            ) : pagos.map((p, i) => (
              <tr key={i}>
                <td style={{ padding: 6, color: '#222', fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.cliente}</td>
                <td style={{ padding: 6, textAlign: 'right', color: '#219653', fontWeight: 700, minWidth: 80 }}>
                  ${p.monto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PagosHoyModal;
