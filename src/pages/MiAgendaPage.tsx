
import React, { useState, useEffect } from 'react';
import LocationPinFilled from '../assets/LocationPinFilled.svg';
import WhatsappIcon from '../assets/WhatsappIcon.svg';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import RyaMenuIcon from '../components/RyaMenuIcon';
import styles from './MiAgendaPage.module.css';


// Definición única y ordenada:

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#2563eb"/>
    <path d="M17.707 16.293l-2.387-2.387a1 1 0 0 0-1.414 0l-.793.793a8.014 8.014 0 0 1-3.535-3.535l.793-.793a1 1 0 0 0 0-1.414L7.707 6.293a1 1 0 0 0-1.414 0l-.586.586c-.781.781-.781 2.047 0 2.828 2.34 2.34 5.14 5.14 7.48 7.48.781.781 2.047.781 2.828 0l.586-.586a1 1 0 0 0 0-1.414z" fill="#fff"/>
  </svg>
);

const MiAgendaPage: React.FC = () => {
  // Estado para recordatorios
  const [recordatorios, setRecordatorios] = useState<any[]>([]);
  const [loadingRecordatorios, setLoadingRecordatorios] = useState(true);

  // Función para actualizar el estado de leído del recordatorio
  const marcarLeido = async (r: any, valor: number) => {
    try {
      await api.put(`/recordatorios/${r.id}`, {
        ...r,
        leido: valor
      });
      // Refrescar recordatorios
      const res = await api.get('/recordatorios/');
      setRecordatorios(Array.isArray(res.data) ? res.data : []);
    } catch {}
  };

  useEffect(() => {
    setLoadingRecordatorios(true);
    api.get('/recordatorios/')
      .then(res => {
        console.log('Recordatorios data:', res.data); // <-- Debug log
        setRecordatorios(Array.isArray(res.data) ? res.data : []);
        setLoadingRecordatorios(false);
      })
      .catch(() => {
        setRecordatorios([]);
        setLoadingRecordatorios(false);
      });
  }, []);
  const weekDays: string[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const [selectedTab, setSelectedTab] = useState<'pendientes' | 'todas' | 'realizadas'>('pendientes');

  // Obtener la fecha actual
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());


  // Estado para mes y año seleccionados
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
  // Filtrar recordatorios según el tab
  const ahora = new Date();
  // Filtrar recordatorios por día seleccionado
  const recordatoriosDelDia = recordatorios.filter((r: any) => {
    const fecha = new Date(r.fecha);
    return (
      fecha.getDate() === selectedDay &&
      fecha.getMonth() === month &&
      fecha.getFullYear() === year
    );
  });

  // Filtrar por tab
  const pendientes = recordatoriosDelDia.filter((r: any) => {
    const fecha = new Date(r.fecha);
    return (!r.leido || r.leido === 0) && fecha <= ahora;
  });
  const recordatoriosFiltrados = selectedTab === 'pendientes' ? pendientes : recordatoriosDelDia;

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
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayNumber = i + 1;
            const isToday =
              dayNumber === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            // Calcular columna de inicio para el primer día
            const gridColumn = i === 0 ? (firstDayOfWeek + 1) : undefined;
            // Verificar si hay recordatorios para este día
            const tieneRecordatorio = recordatorios.some((r: any) => {
              const fecha = new Date(r.fecha);
              return (
                fecha.getDate() === dayNumber &&
                fecha.getMonth() === month &&
                fecha.getFullYear() === year
              );
            });
            return (
              <div
                key={dayNumber}
                className={
                  styles.dayCell +
                  (dayNumber === selectedDay ? ' ' + styles.selected : '') +
                  (tieneRecordatorio ? ' ' + styles.hasEvent : '') +
                  (isToday ? ' ' + styles.today : '')
                }
                style={gridColumn ? { gridColumnStart: gridColumn } : undefined}
                onClick={() => setSelectedDay(dayNumber)}
              >
                {dayNumber}
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
          Pendientes <span className={styles.tab + ' ' + styles.badge}>{pendientes.length}</span>
        </div>
        <div
          className={styles.tab + (selectedTab === 'todas' ? ' ' + styles.selected : '')}
          onClick={() => setSelectedTab('todas')}
        >
          Todas
        </div>
        {/* Pestaña 'Realizadas' eliminada */}
      </div>
      {/* Lista de recordatorios */}
      {loadingRecordatorios ? (
        <div style={{ textAlign: 'center', color: '#888', margin: 24 }}>Cargando recordatorios...</div>
      ) : recordatoriosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', margin: 24 }}>No hay recordatorios</div>
      ) : (
        recordatoriosFiltrados.map((r, i) => {
          // Fecha y hora
          const fechaUtc = typeof r.fecha === 'string' && r.fecha.endsWith('Z')
            ? new Date(r.fecha)
            : new Date(r.fecha + 'Z');
          const hora = fechaUtc.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
          // Estado (ejemplo: 'Senha', puedes ajustar según tu lógica)
          const estado = r.estado || '';
          // Badge de atraso
          let atrasoBadge = null;
          if (typeof r.atraso === 'number' && r.atraso > 0) {
            atrasoBadge = (
              <span style={{ color: '#b77b00', fontWeight: 600, fontSize: 14, background: '#fff7e6', borderRadius: 8, padding: '2px 10px', marginLeft: 10 }}>
                <span role="img" aria-label="reloj">⏰</span> {r.atraso} días de atraso
              </span>
            );
          }
          // Dirección
          const direccion = r.direccion || r.direccion_cliente || '';
          // Teléfono
          const telefono = r.telefono || r.telefono_cliente || '';
          // Botones de acción
            // Mostrar el botón de ubicación y, si hay teléfono, el botón de WhatsApp
            const acciones = direccion ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => navigate('/gps', { state: { direccion, cliente_nombre: r.cliente_nombre } })}
                    style={{ background: '#e3f2fd', border: 'none', borderRadius: 8, padding: '8px', fontWeight: 600, fontSize: 15, cursor: 'pointer', color: '#d72660', display: 'inline-flex', alignItems: 'center' }}
                    title="Ubicación"
                  >
                    <img src={LocationPinFilled} alt="Ubicación" style={{ width: 24, height: 24, display: 'block' }} />
                  </button>
                {telefono && (
                  <>
                    <a href={`https://wa.me/${telefono.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ background: '#e8f5e9', border: 'none', borderRadius: 8, padding: '8px', fontWeight: 600, fontSize: 15, cursor: 'pointer', color: '#25d366', display: 'inline-flex', alignItems: 'center' }} title="WhatsApp">
                      <img src={WhatsappIcon} alt="WhatsApp" style={{ width: 24, height: 24, display: 'block' }} />
                    </a>
                    <a href={`tel:${telefono.replace(/[^\d+]/g, '')}`} style={{ background: '#e3f2fd', border: 'none', borderRadius: 8, padding: '8px', fontWeight: 600, fontSize: 15, cursor: 'pointer', color: '#2563eb', display: 'inline-flex', alignItems: 'center' }} title="Llamar">
                      <PhoneIcon />
                    </a>
                  </>
                )}
              </div>
            ) : null;
          return (
            <div className={styles.eventCard} key={r.id || i}>
              <div className={styles.eventHeader}>
                <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 18 }}>{hora}</span>
                {estado && <span style={{ color: '#22c55e', fontWeight: 700, marginLeft: 8 }}>{estado}</span>}
                {atrasoBadge}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className={styles.eventTitle} style={{ fontWeight: 700, fontSize: 18 }}>{r.cliente_nombre || '-'}</div>
                {(!r.leido || r.leido === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginLeft: 10 }}>
                    <button
                      style={{ background: '#e8f5e9', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43a047' }}
                      onClick={() => marcarLeido(r, 1)}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 16.5L4.5 11.5L6 10L9.5 13.5L18 5L19.5 6.5L9.5 16.5Z" fill="#43a047"/>
                      </svg>
                    </button>
                    <button
                      style={{ background: '#ffebee', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e53935' }}
                      onClick={() => marcarLeido(r, 2)}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6L18 18M6 18L18 6" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {r.nota && (
                <div style={{ color: '#2563EB', margin: '8px 0 2px 0', fontWeight: 500 }}>{r.nota}</div>
              )}
              {/* Botones de acción (ubicación, WhatsApp, llamada) */}
              {acciones}
            </div>
          );
        })
      )}
      <button className={styles.addVisitBtn}>
        <span role="img" aria-label="calendar">📅</span> Agendar nueva visita
      </button>
    </div>
  );
};

export default MiAgendaPage;
