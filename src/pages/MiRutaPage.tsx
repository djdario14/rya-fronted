import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RyaMenuIcon from '../components/RyaMenuIcon';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/client';
import { Cliente } from '../types/cliente';

// Fix default marker icon issue in Leaflet with Webpack
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Icono de flecha para la ubicación del usuario
const arrowIcon = L.divIcon({
  html: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="16,2 30,30 16,24 2,30" fill="#1976d2" stroke="#fff" stroke-width="2"/></svg>` ,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 28],
  popupAnchor: [0, -28],
});

const MiRutaPage: React.FC = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  // Obtener ubicación del usuario al cargar la página
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          // Si el usuario no da permiso, no pasa nada
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    api.get<Cliente[]>('/clientes').then(res => {
      setClientes(res.data);
    });
  }, []);

  // Filtrar clientes con dirección válida y parsear lat/lng
  const clientesConUbicacion = clientes
    .map(c => {
      if (!c.direccion) return null;
      const parts = c.direccion.split(',');
      if (parts.length !== 2) return null;
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (isNaN(lat) || isNaN(lng)) return null;
      return { ...c, lat, lng };
    })
    .filter(Boolean) as (Cliente & { lat: number; lng: number })[];


  // Centrar el mapa en la ubicación del usuario si está disponible,
  // si no, en el primer cliente, y si no, en Guayaquil
  const center = userLocation
    ? userLocation
    : clientesConUbicacion.length > 0
      ? [clientesConUbicacion[0].lat, clientesConUbicacion[0].lng]
      : [-2.170998, -79.922359];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f5f6fa' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '18px 0 0 0', width: '100%' }}>
        <div style={{ width: 64, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 8 }}
            aria-label="Volver"
          >
            <RyaMenuIcon size={48} />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center', margin: 0, fontSize: 32, fontWeight: 700 }}>Mi Ruta</h2>
        </div>
        <div style={{ width: 64 }}></div>
      </div>
      <div style={{ width: '100%', height: '90vh', borderRadius: 12, boxShadow: '0 2px 16px #0001', margin: '0 auto', overflow: 'hidden' }}>
        <MapContainer center={center as [number, number]} zoom={13} style={{ width: '100%', height: '100%' }}>
          {/* Marcador de la ubicación del usuario como flecha */}
          {userLocation && (
            <Marker position={userLocation} icon={arrowIcon}>
              <Popup>Tu ubicación actual</Popup>
            </Marker>
          )}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {clientesConUbicacion.map(cliente => (
            <Marker key={cliente.id} position={[cliente.lat, cliente.lng]}>
              <Popup>
                <b>{cliente.nombre}</b><br/>
                {cliente.negocio && <span>Negocio: {cliente.negocio}<br/></span>}
                {cliente.telefono && <span>Tel: {cliente.telefono}</span>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MiRutaPage;
