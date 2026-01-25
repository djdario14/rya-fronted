import React from 'react';

interface Prestamo {
  cliente: string;
  monto: number;
  forma_pago: string;
  cuotas: number;
  valor_cuota: number;
}

interface PrestamosHoyModalProps {
  open: boolean;
  prestamos: Prestamo[];
  onClose: () => void;
}

const PrestamosHoyModal: React.FC<PrestamosHoyModalProps> = ({ open, prestamos, onClose }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Préstamos del día</h2>
        <button className="close-btn" onClick={onClose}>×</button>
        <table className="prestamos-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Forma de pago</th>
              <th>Cuotas</th>
              <th>Valor cuota</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>No hay préstamos registrados hoy.</td></tr>
            ) : prestamos.map((p, i) => (
              <tr key={i}>
                <td>{p.cliente}</td>
                <td>${p.monto}</td>
                <td>{p.forma_pago}</td>
                <td>{p.cuotas}</td>
                <td>${p.valor_cuota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrestamosHoyModal;
