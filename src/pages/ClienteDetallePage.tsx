import ClientHeaderCard from '../components/ClientHeaderCard';
import BalanceCard from '../components/BalanceCard';
import PrimaryActionButton from '../components/PrimaryActionButton';
import '../styles/theme.css';

export default function ClienteDetallePage() {
  // Datos de ejemplo, reemplaza por datos reales
  const cliente = {
    name: 'Mariuxi Martínez',
    id: '0954681322',
    phone: '0994823848',
    balance: '$360.00',
    loan: '$300',
    installments: '6 / 12',
    delayDays: '45 días',
    address: 'Calle 14 y Av. la Garzota, Guayaquil',
  };

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: 32 }}>
      <div style={{ maxWidth: 430, margin: '0 auto', padding: '16px 0' }}>
        <ClientHeaderCard name={cliente.name} id={cliente.id} phone={cliente.phone} onMapTap={() => alert('Ver mapa')} />
        <BalanceCard balance={cliente.balance} loan={cliente.loan} installments={cliente.installments} delayDays={cliente.delayDays} />
        <PrimaryActionButton label="＋ Abonar" color="#22C55E" icon={<span>💵</span>} onPress={() => alert('Abonar')} />
        <PrimaryActionButton label="📅 Agendar Visita" color="#2563EB" icon={<span>📅</span>} onPress={() => alert('Agendar visita')} />
        <button style={{ width: '100%', height: 52, borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#111827', background: '#fff', border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12, boxShadow: '0 2px 12px #0001', cursor: 'pointer' }}>
          <span style={{ fontSize: 20 }}>💬</span> Enviar Mensaje
        </button>
        <button style={{ width: '100%', height: 52, borderRadius: 16, fontSize: 16, fontWeight: 600, color: '#111827', background: '#fff', border: '1.5px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12, boxShadow: '0 2px 12px #0001', cursor: 'pointer' }}>
          <span style={{ fontSize: 20 }}>📝</span> Nuevo Crédito
        </button>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#22C55E', fontWeight: 600, fontSize: 15 }}>
            <span style={{ fontSize: 20 }}>📍</span> Dirección
          </div>
          <div style={{ color: '#111827', fontSize: 15, marginTop: 6 }}>{cliente.address}</div>
        </div>
      </div>
    </div>
  );
}
