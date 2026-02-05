import React, { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';

interface AgendarVisitaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (fecha: string, nota: string) => void;
  clienteNombre: string;
}

const AgendarVisitaModal: React.FC<AgendarVisitaModalProps> = ({ open, onClose, onSave, clienteNombre }) => {
  const [fecha, setFecha] = useState<Date | null>(null);
  const [nota, setNota] = useState("");

  if (!open) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0008", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, minWidth: 320, maxWidth: 400, boxShadow: "0 4px 24px #0002", position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        <h3 style={{ margin: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Agendar visita</h3>
        <div style={{ marginBottom: 14, fontWeight: 500 }}>Cliente: <span style={{ color: '#2563EB' }}>{clienteNombre}</span></div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontWeight: 500 }}>Fecha y hora:</label><br />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={fecha ? dayjs(fecha) : null}
              onChange={value => setFecha(value ? value.toDate() : null)}
              minDateTime={dayjs()}
              ampm={false}
              slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mt: 1 } } }}
              format="DD/MM/YYYY HH:mm"
              label="Selecciona fecha y hora"
              disablePast
            />
          </LocalizationProvider>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500 }}>Nota <span style={{color:'#e53935'}}>*</span>:</label><br />
          <textarea value={nota} onChange={e => setNota(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd", fontSize: 16, minHeight: 60 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={() => {
            if (fecha && nota) {
              // Convertir la fecha local a UTC antes de enviar
              const fechaUtc = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString();
              onSave(fechaUtc, nota);
            }
          }} style={{ background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 15, cursor: "pointer" }} disabled={!fecha || !nota}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default AgendarVisitaModal;
