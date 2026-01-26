import React, { useState } from "react";

type Cliente = {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  negocio: string;
  // Agrega otros campos si es necesario
};

interface EditClienteModalProps {
  cliente: Cliente;
  onClose: () => void;
  onSave: (data: Partial<Cliente>) => void;
}

export default function EditClienteModal({ cliente, onClose, onSave }: EditClienteModalProps) {
  const [form, setForm] = useState({
    nombre: cliente.nombre || '',
    cedula: cliente.cedula || '',
    telefono: cliente.telefono || '',
    direccion: cliente.direccion || '',
    negocio: cliente.negocio || ''
  });
  const [saving, setSaving] = useState(false);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0004', padding: 28, minWidth: 320, width: 340, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
        <h3 style={{ marginTop: 0, marginBottom: 18, fontWeight: 700, fontSize: 22 }}>Editar cliente</h3>
        <form onSubmit={async e => {
          e.preventDefault();
          setSaving(true);
          await onSave(form);
          setSaving(false);
        }}>
          <div style={{ marginBottom: 14 }}>
            <label>Nombre</label>
            <input type="text" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>Cédula</label>
            <input type="text" value={form.cedula} onChange={e => setForm(f => ({ ...f, cedula: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>Teléfono</label>
            <input type="text" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>Dirección</label>
            <input type="text" value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label>Negocio</label>
            <input type="text" value={form.negocio} onChange={e => setForm(f => ({ ...f, negocio: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <button type="submit" disabled={saving} style={{ width: '100%', background: 'linear-gradient(90deg, #4e7fa6 0%, #5fa37a 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 0', cursor: 'pointer', marginTop: 8 }}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
