import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import api from '../api/client';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es as esEC } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'es': esEC,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

import { Event as RBCEvent } from 'react-big-calendar';
const AgendaPage: React.FC = () => {
  const [events, setEvents] = React.useState<RBCEvent[]>([]);
  const [recordatorios, setRecordatorios] = React.useState<any[]>([]);
    // Cargar recordatorios al montar
    React.useEffect(() => {
      api.get('/recordatorios/')
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : [];
          setRecordatorios(data);
        })
        .catch(() => setRecordatorios([]));
    }, []);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState<RBCEvent | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  // Al hacer click en un evento, abrir modal para eliminar
  const handleSelectEvent = (event: RBCEvent) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e !== selectedEvent));
      setShowDeleteModal(false);
      setSelectedEvent(null);
    }
  };

  // Al hacer click en una fecha, abrir modal para agregar evento
  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    if (selectedDate && newTitle.trim()) {
      setEvents([...events, {
        title: newTitle,
        start: selectedDate,
        end: selectedDate,
        allDay: true
      }]);
      setShowModal(false);
      setNewTitle('');
      setSelectedDate(null);
    }
  };

  return (
    <div style={{ padding: 24, background: '#f7f8fa', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 24, color: '#29487d', fontWeight: 700, fontSize: 28 }}>Mi Agenda</h2>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 8px 32px #2563EB22',
        padding: 32,
        maxWidth: 900,
        margin: '0 auto',
        fontFamily: 'Inter, Arial, sans-serif',
      }}>
        <style>{`
          .rbc-toolbar button {
            background: #f5f6fa;
            color: #2563EB;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            padding: 8px 18px;
            margin: 0 4px;
            transition: background 0.2s, color 0.2s;
          }
          .rbc-toolbar button:hover {
            background: #2563EB;
            color: #fff;
          }
          .rbc-toolbar label {
            font-size: 20px;
            font-weight: 700;
            color: #29487d;
          }
          .rbc-month-row {
            border-radius: 12px;
            overflow: hidden;
          }
          .rbc-event {
            background: linear-gradient(90deg, #2563EB 60%, #22C55E 100%);
            color: #fff;
            border-radius: 10px;
            font-weight: 600;
            box-shadow: 0 2px 8px #2563EB22;
            border: none;
            padding: 4px 8px;
            transition: background 0.2s;
          }
          .rbc-event:hover {
            background: linear-gradient(90deg, #22C55E 60%, #2563EB 100%);
          }
          .rbc-selected {
            background: #22C55E !important;
            color: #fff !important;
          }
          .rbc-agenda-table th, .rbc-agenda-table td {
            font-size: 16px;
            padding: 8px 12px;
          }
        `}</style>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{ height: 600, background: '#fff', borderRadius: 20 }}
          culture="es"
          messages={{
            next: 'Sig',
            previous: 'Ant',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango.'
          }}
          eventPropGetter={(event) => ({
            style: {
              background: 'linear-gradient(90deg, #2563EB 60%, #22C55E 100%)',
              color: '#fff',
              borderRadius: 10,
              border: 'none',
              fontWeight: 600,
              boxShadow: '0 2px 8px #2563EB22',
              padding: '4px 8px',
              fontSize: 16,
            }
          })}
          dayPropGetter={(date) => {
            const recs = recordatorios.filter(r => {
              const recDate = new Date(r.fecha);
              return (
                recDate.getFullYear() === date.getFullYear() &&
                recDate.getMonth() === date.getMonth() &&
                recDate.getDate() === date.getDate()
              );
            });
            if (recs.length > 0) {
              let bg = '#fffbe6';
              if (recs.some(r => r.leido === 1)) bg = '#e8f5e9';
              if (recs.some(r => r.leido === 2)) bg = '#ffebee';
              return {
                style: {
                  background: bg,
                  border: '2px solid #2563EB',
                  position: 'relative',
                }
              };
            }
            return {};
          }}
          components={{
            dateCellWrapper: (props) => {
              const date = props.value;
              const recs = recordatorios.filter(r => {
                const recDate = new Date(r.fecha);
                return (
                  recDate.getFullYear() === date.getFullYear() &&
                  recDate.getMonth() === date.getMonth() &&
                  recDate.getDate() === date.getDate()
                );
              });
              let icon = null;
              // Solo un ícono por celda
              if (recs.length > 0) {
                if (recs.some(r => r.leido === 1)) {
                  icon = (
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M9.5 16.5L4.5 11.5L6 10L9.5 13.5L18 5L19.5 6.5L9.5 16.5Z" fill="#43a047"/>
                      </svg>
                    </span>
                  );
                } else if (recs.some(r => r.leido === 2)) {
                  icon = (
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M6 18L18 6" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  );
                } else {
                  icon = (
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C13.1 2 14 2.9 14 4V5.18C16.4 6.4 18 8.97 18 12V17L20 19V20H4V19L6 17V12C6 8.97 7.6 6.4 10 5.18V4C10 2.9 10.9 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" fill="#FFC107"/>
                      </svg>
                    </span>
                  );
                }
              }
              return (
                <div style={{ position: 'relative' }}>
                  {props.children}
                  {icon}
                </div>
              );
            }
          }}
        />
      </div>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320, boxShadow: '0 4px 24px #0002', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            <h3 style={{ marginBottom: 18 }}>Agregar evento</h3>
            <div style={{ marginBottom: 12 }}>
              <strong>Fecha:</strong> {selectedDate?.toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Título del evento"
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, marginBottom: 18 }}
            />
            <button onClick={handleAddEvent} style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaPage;
