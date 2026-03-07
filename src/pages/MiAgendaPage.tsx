
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RyaMenuIcon from '../components/RyaMenuIcon';
import styles from './MiAgendaPage.module.css';

// Mock data para la UI
const mockEvents = [
  {
    id: 1,
    hora: '9:00',
    nombre: 'Sandra San Raymundo',
    direccion: 'Ing. Enrique Victoria 101',
    telefono: '+5930864647864',
    nota: 'Recordar deuda pendiente',
    atraso: 47,
    atrasoTexto: '47 días de atraso',
    status: 'pendiente',
  },
  {
    id: 2,
    hora: '10:30',
    nombre: 'Javier',
    direccion: 'Calle Bolívar 536',
    telefono: '+593962515621',
    nota: 'Preguntar cuándo podrá abonar',
    atraso: 2,
    atrasoTexto: '2 días de atraso',
    status: 'pendiente',
  },
];

const MiAgendaPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'pendientes' | 'todas' | 'realizadas'>('pendientes');
  const [selectedDay, setSelectedDay] = useState<number>(2);

  // Mock calendario simple (solo para UI)
  const days = [29, 30, 1, 2, 3, 4, 5];
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const navigate = useNavigate();
  return (
    <div className={styles.agendaContainer}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Ir a inicio"
            onClick={() => navigate('/')}
          >
            <RyaMenuIcon size={32} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#29487d' }}>RYA COBRANZA</span>
        </div>
      </div>
      <div className={styles.title}>Mi Agenda</div>
      <div className={styles.calendarCard}>
        <div className={styles.monthSelector}>
          <button style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#2563eb' }}>{'<'}</button>
          <span>Mayo 2024</span>
          <button style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#2563eb' }}>{'>'}</button>
        </div>
        <div className={styles.calendarDays}>
          {weekDays.map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className={styles.calendarGrid}>
          {days.map((d, i) => (
            <div
              key={d}
              className={
                styles.dayCell +
                (d === selectedDay ? ' ' + styles.selected : '') +
                (d === 2 || d === 4 ? ' ' + styles.hasEvent : '')
              }
              onClick={() => setSelectedDay(d)}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.tabs}>
        <div
          className={styles.tab + (selectedTab === 'pendientes' ? ' ' + styles.selected : '')}
          onClick={() => setSelectedTab('pendientes')}
        >
          Pendientes <span className={styles.tab + ' ' + styles.badge}>5</span>
        </div>
        <div
          className={styles.tab + (selectedTab === 'todas' ? ' ' + styles.selected : '')}
          onClick={() => setSelectedTab('todas')}
        >
          Todas
        </div>
        <div
          className={styles.tab + (selectedTab === 'realizadas' ? ' ' + styles.selected : '')}
          onClick={() => setSelectedTab('realizadas')}
        >
          Realizadas
        </div>
      </div>
      {/* Lista de eventos/visitas */}
      {mockEvents.map(ev => (
        <div className={styles.eventCard} key={ev.id}>
          <div className={styles.eventHeader}>
            <span style={{ color: '#22c55e', fontWeight: 700 }}>{ev.hora} | Senha</span>
          </div>
          <div className={styles.eventTitle}>{ev.nombre}</div>
          <div className={styles.eventMeta}>
            <span role="img" aria-label="location">📍</span> {ev.direccion}
            <span className={styles.eventStatus}>
              <span role="img" aria-label="clock">⏰</span> {ev.atrasoTexto}
            </span>
          </div>
          <div className={styles.eventMeta} style={{ marginTop: 2, marginBottom: 2 }}>
            {ev.nota}
          </div>
          <div className={styles.eventMeta}>
            <span role="img" aria-label="phone">📱</span> {ev.telefono}
          </div>
          <div className={styles.eventActions}>
            <button className={styles.actionBtn} title="Llamar"><span role="img" aria-label="phone">📞</span></button>
            <button className={styles.actionBtn} title="WhatsApp"><span role="img" aria-label="whatsapp">🟢</span></button>
            <button className={styles.actionBtn} title="Mensaje"><span role="img" aria-label="sms">💬</span></button>
            <button className={styles.actionBtn} title="Ir"><span role="img" aria-label="go">➡️</span></button>
          </div>
        </div>
      ))}
      <button className={styles.addVisitBtn}>
        <span role="img" aria-label="calendar">📅</span> Agendar nueva visita
      </button>
    </div>
  );
};

export default MiAgendaPage;
