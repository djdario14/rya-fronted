import React, { useState } from 'react';
import CreditoModal from '../components/CreditoModal';
import api from '../api/client';

export default function NuevoCreditoButton({ cliente, onCreditoRegistrado }: { cliente: { id: number, nombre: string }, onCreditoRegistrado: () => void }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/prestamos/', {
        cliente_id: cliente.id,
        valor: data.valor,
        interes: data.interes,
        cuotas: data.cuotas,
        valor_cuota: data.valorCuota,
        forma_pago: data.formaPago,
        fecha: data.fecha,
      });
      setShow(false);
      onCreditoRegistrado();
    } catch (e: any) {
      setError('No se pudo registrar el crédito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShow(true)} style={{ width: '100%', height: 52, borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#fff', background: '#22C55E', border: 'none', marginBottom: 12, cursor: 'pointer' }}>
        Registrar nuevo crédito
      </button>
      {show && (
        <CreditoModal
          clienteNombre={cliente.nombre}
          onClose={() => setShow(false)}
          onSubmit={handleSubmit}
        />
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </>
  );
}
