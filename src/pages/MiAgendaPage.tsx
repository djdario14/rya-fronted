
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
    const weekDays: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const [selectedTab, setSelectedTab] = useState<'pendientes' | 'todas' | 'realizadas'>('pendientes');
  const [selectedDay, setSelectedDay] = useState<number>(2);


  // Estado para mes y año seleccionados
  // Obtener la fecha actual
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth()); // 0=enero
  const [year, setYear] = useState<number>(today.getFullYear());

  // Calcular el primer día de la semana del mes (0=lunes, 6=domingo)
  const jsFirstDay = new Date(year, month, 1).getDay(); // 0=domingo, 1=lunes...
  // Ajustar para que 0=lunes, 6=domingo
  const firstDayOfWeek = jsFirstDay === 0 ? 6 : jsFirstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Para mostrar días del mes anterior si el mes no empieza en lunes
  const prevMonthDays = [];
  if (firstDayOfWeek > 0) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push(prevMonthLastDay - i);
    }
  }
  const days = [
    ...prevMonthDays,
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const offset = 0; // Ya no se usa, grid lo alinea

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
          <button
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#2563eb' }}
            onClick={() => {
              if (month === 0) {
                setMonth(11); setYear(year - 1);
              } else {
                setMonth(month - 1);
              }
            }}
          >{'<'}</button>
          <span>
            {new Date(year, month).toLocaleString('es-EC', { month: 'long', year: 'numeric' }).replace(/^./, c => c.toUpperCase())}
          </span>
          <button
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#2563eb' }}
            onClick={() => {
              if (month === 11) {
                setMonth(0); setYear(year + 1);
              } else {
                setMonth(month + 1);
              }
            }}
          >{'>'}</button>
        </div>
        <div className={styles.calendarDays}>
          {weekDays.map((d: string, i: number) => <span key={i}>{d}</span>)}
        </div>
        <div className={styles.calendarGrid}>
          {days.map((d: number, i: number) => {
            const isPrevMonth = i < prevMonthDays.length;
            const isCurrentMonth = i >= prevMonthDays.length && i < prevMonthDays.length + daysInMonth;
            const dayNumber = d;
            const isToday =
              isCurrentMonth &&
              dayNumber === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            return (
              <div
                key={i + '-' + d}
                className={
                  styles.dayCell +
                  (isCurrentMonth && dayNumber === selectedDay ? ' ' + styles.selected : '') +
                  (isCurrentMonth && (dayNumber === 2 || dayNumber === 4) ? ' ' + styles.hasEvent : '') +
                  (isToday ? ' ' + styles.today : '')
                }
                style={{ color: isPrevMonth ? '#bbb' : undefined, fontWeight: isCurrentMonth ? 500 : 400 }}
                onClick={() => isCurrentMonth && setSelectedDay(dayNumber)}
              >
                {d}
              </div>
            );
          })}
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
