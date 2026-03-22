import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RyaMenuIcon from '../components/RyaMenuIcon';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/client';
import { Cliente } from '../types/cliente';
// Fix default marker icon issue in Leaflet with Webpack
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const selectedIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  iconSize: [38, 38],
  className: 'selected-marker',
});

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente para abrir el popup del marcador seleccionado
const OpenPopup: React.FC<{lat: number, lng: number}> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15, { animate: true });
  }, [lat, lng, map]);
  return null;
};

// Componente para centrar y hacer zoom en la ubicación del usuario
const CenterOnUserLocation: React.FC<{lat: number, lng: number}> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 17, { animate: true });
  }, [lat, lng, map]);
  return null;
};

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
  const location = useLocation();
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


  // Si se recibe una dirección por location.state, usarla como centro
  let center: [number, number] = [-2.170998, -79.922359]; // Guayaquil por defecto
  if (location.state && (location.state as any).direccion) {
    const dir = (location.state as any).direccion;
    const parts = dir.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        center = [lat, lng];
      }
    }
  } else if (userLocation) {
    center = userLocation;
  } else if (clientesConUbicacion.length > 0) {
    center = [clientesConUbicacion[0].lat, clientesConUbicacion[0].lng];
  }

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
          {/* Centrar y hacer zoom en la ubicación del usuario al cargar */}
          {userLocation && <CenterOnUserLocation lat={userLocation[0]} lng={userLocation[1]} />}
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
          {clientesConUbicacion.map(cliente => {
            // ¿Es el cliente seleccionado?
            let isSelected = false;
            if (location.state && (location.state as any).direccion && (location.state as any).cliente_nombre) {
              const dir = (location.state as any).direccion;
              const nombre = (location.state as any).cliente_nombre;
              isSelected = cliente.direccion === dir && cliente.nombre === nombre;
            }
            return (
              <Marker
                key={cliente.id}
                position={[cliente.lat, cliente.lng]}
                icon={isSelected ? selectedIcon : DefaultIcon}
              >
                {isSelected && <OpenPopup lat={cliente.lat} lng={cliente.lng} />}
                <Popup autoPan={true} autoClose={!isSelected} closeOnClick={!isSelected} open={isSelected}>
                  <b>{cliente.nombre}</b><br/>
                  {cliente.negocio && <span>Negocio: {cliente.negocio}<br/></span>}
                  {cliente.telefono && <span>Tel: {cliente.telefono}</span>}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MiRutaPage;
