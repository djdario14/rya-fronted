import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useParams, useNavigate } from 'react-router-dom';

interface ClienteDetalle {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  saldo: number;
  prestamo: number;
  cuotasPagadas: number;
  cuotasTotal: number;
  atraso: number;
  lat?: number;
  lng?: number;
}
            {/* Botón Volver flotante */}
            <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 18, left: 18, background: '#29487d', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 17, padding: '7px 22px', boxShadow: '0 2px 8px #29487d22', zIndex: 2 }}>
              ← Volver
            </button>
            useEffect(() => {
              async function fetchCliente() {
                setLoading(true);
                try {
                  // Obtener datos básicos del cliente
                  const res = await api.get(`/clientes/${id}`);
                  const data = res.data as ClienteDetalle;
                  // Obtener saldo y detalles reales
                  const resSaldo = await api.get(`/clientes/${id}/saldo`);
                  const saldoData = resSaldo.data as any;
                  setCliente({
                    id: data.id,
                    nombre: data.nombre,
                    cedula: data.cedula,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    saldo: saldoData.saldo ?? 0,
                    prestamo: saldoData.prestamo ?? 0,
                    cuotasPagadas: saldoData.cuotasPagadas ?? 0,
                    cuotasTotal: saldoData.cuotasTotal ?? 30,
                    atraso: saldoData.atraso ?? 0,
                    lat: data.direccion?.split(',')[0] ? Number(data.direccion?.split(',')[0]) : undefined,
                    lng: data.direccion?.split(',')[1] ? Number(data.direccion?.split(',')[1]) : undefined,
                  });
                } catch (error) {
                  // Manejo de error si es necesario
                } finally {
                  setLoading(false);
                }
              }
              fetchCliente();
            }, [id]);
                    if (cliente?.telefono) {
                      const numero = cliente.telefono.replace(/[^\d+]/g, '');
                      window.open(`https://wa.me/${numero}`, '_blank');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.22-1.63A12.13 12.13 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.69.97.99-3.59-.23-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" fill="#25D366"/></svg>
                  <span style={{ color: '#25D366', fontWeight: 700 }}>Enviar mensaje</span>
                </button>
                <button style={{ background: '#29487d', color: '#fff', border: 'none', borderRadius: 10, padding: '15px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 0, boxShadow: '0 1px 4px #29487d11', width: '100%' }}>EDITAR CLIENTE</button>
              </div>
            </div>
            <div style={{ height: 32 }} />
          </div>
                  {pagos.map((pago: any) => (
                    <li key={pago.id} style={{ marginBottom: 8, fontSize: 16, color: '#29487d', background: '#f7f8fa', borderRadius: 7, padding: '7px 12px', display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid #e0e0e0' }}>
                      {pago.motivo_no_pago ? (
                        <span style={{ color: '#e74c3c', fontWeight: 600 }}>Motivo: {pago.motivo_no_pago}</span>
                      ) : (
                        <span>Monto: <b>${pago.monto}</b> | Fecha: {pago.fecha}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 200, marginTop: 10 }}>
            <button style={{ background: '#fff', color: '#29487d', border: '1px solid #29487d', borderRadius: 10, padding: '15px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 0, boxShadow: '0 1px 4px #29487d11' }}>Historial crediticio</button>
            <button style={{ background: '#fff', color: '#29487d', border: '1px solid #29487d', borderRadius: 10, padding: '15px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 0, boxShadow: '0 1px 4px #29487d11' }}>Agendar visita</button>
            <button style={{ background: '#fff', color: '#29487d', border: '1px solid #29487d', borderRadius: 10, padding: '15px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 0, boxShadow: '0 1px 4px #29487d11', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              onClick={() => {
                if (cliente?.telefono) {
                  const numero = cliente.telefono.replace(/[^\d+]/g, '');
                  window.open(`https://wa.me/${numero}`, '_blank');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20.52 3.48A12.07 12.07 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.22-1.63A12.13 12.13 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.69.97.99-3.59-.23-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.36-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.7-.7 1.94-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" fill="#25D366"/></svg>
              Enviar mensaje
            </button>
            <button style={{ background: '#29487d', color: '#fff', border: 'none', borderRadius: 10, padding: '15px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', marginBottom: 0, boxShadow: '0 1px 4px #29487d11' }}>EDITAR CLIENTE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleClientePage;
