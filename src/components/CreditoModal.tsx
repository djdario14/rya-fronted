import React, { useState } from "react";
import { useTimezoneOffset } from '../context/TimezoneContext';

const formasPago = [
  { label: "Diario", cuotas: 30 },
  { label: "Semanal", cuotas: 4 },
  { label: "Quincenal", cuotas: 2 },
  { label: "Mensual", cuotas: 1 }
];

interface CreditoModalProps {
  clienteNombre: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreditoModal: React.FC<CreditoModalProps> = ({ clienteNombre, onClose, onSubmit }) => {
  const [valor, setValor] = useState<number | "">(0);
  const [interes, setInteres] = useState<number | "">(20);
  const [formaPago, setFormaPago] = useState(formasPago[0].label);
  // Fecha editable, solo YYYY-MM-DD
  const offset = useTimezoneOffset();
  const [fecha, setFecha] = useState(() => {
    const d = new Date();
    // offset en milisegundos
    const tzOffsetMs = offset * 60000;
    const localISODate = new Date(d.getTime() + tzOffsetMs).toISOString().slice(0, 10);
    return localISODate;
  });

  const cuotas = formasPago.find(f => f.label === formaPago)?.cuotas || 1;
  const total = typeof valor === "number" && typeof interes === "number" ? valor + (valor * interes / 100) : 0;
  const valorCuota = typeof total === "number" && cuotas ? total / cuotas : 0;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#0008",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px #0004",
        padding: 24,
        minWidth: 260,
        width: 320,
        maxWidth: "95vw",
        position: "relative"
      }}>
        <h3 style={{ marginTop: 0, marginBottom: 24, fontWeight: 700, fontSize: 24 }}>Registrar Crédito para {clienteNombre}</h3>
        <form onSubmit={e => {
          e.preventDefault();
          onSubmit({ valor, interes, total, cuotas, valorCuota, formaPago, fecha });
        }}>
          <div style={{ marginBottom: 16 }}>
            <label>Valor del préstamo</label>
            <input
              type="number"
              required
              min={1}
              value={valor === "" ? "" : valor}
              onChange={e => {
                const v = e.target.value;
                setValor(v === "" ? "" : Number(v));
              }}
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Interés (%)</label>
            <input
              type="number"
              required
              min={0}
              value={interes === "" ? "" : interes}
              onChange={e => {
                const v = e.target.value;
                setInteres(v === "" ? "" : Number(v));
              }}
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Total a pagar</label>
            <input type="number" value={isNaN(total) ? "" : total} readOnly style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", background: "#f7f7f7" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Forma de pago</label>
            <select value={formaPago} onChange={e => setFormaPago(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}>
              {formasPago.map(f => (
                <option key={f.label} value={f.label}>{f.label}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Número de cuotas</label>
            <input type="number" value={isNaN(cuotas) ? "" : cuotas} readOnly style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", background: "#f7f7f7" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Valor de la cuota</label>
            <input type="number" value={isNaN(valorCuota) ? "" : valorCuota} readOnly style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", background: "#f7f7f7" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Fecha del crédito</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
                      {/* Mostrar fecha seleccionada en formato local si existe */}
                      {fecha && (
                        <div style={{ marginTop: 8, color: '#2563EB', fontWeight: 500 }}>
                          {new Date(fecha).toLocaleString('es-EC', {
                            timeZone: 'America/Guayaquil',
                            year: '2-digit',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })} <span style={{ color: '#888', fontSize: 14 }}>(Hora local)</span>
                        </div>
                      )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" onClick={onClose} style={{ background: "#eee", color: "#333", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Cancelar</button>
            <button type="submit" style={{ background: "#219653", color: "#fff", border: "none", borderRadius: 10, padding: "10px 32px", fontWeight: 600, fontSize: 17, cursor: "pointer" }}>Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditoModal;
