import React, { useState } from 'react';

type Cliente = {
  id: number;
  nombre: string;
  saldo?: number;
  atraso?: number;
  cuota?: number;
  cedula?: string;
  direccion?: string;
  negocio?: string;
  telefono?: string;
  prestamo?: number;
  cuotasPagadas?: number;
  cuotasTotal?: number;
};

const countryCodes = [
  { code: '+1', name: 'Estados Unidos', iso: 'US' },
  { code: '+52', name: 'México', iso: 'MX' },
  { code: '+593', name: 'Ecuador', iso: 'EC' },
  { code: '+57', name: 'Colombia', iso: 'CO' },
  { code: '+54', name: 'Argentina', iso: 'AR' },
  { code: '+34', name: 'España', iso: 'ES' },
  { code: '+51', name: 'Perú', iso: 'PE' },
  { code: '+56', name: 'Chile', iso: 'CL' },
  { code: '+55', name: 'Brasil', iso: 'BR' },
  { code: '+591', name: 'Bolivia', iso: 'BO' },
  { code: '+502', name: 'Guatemala', iso: 'GT' },
];

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [countryCode, setCountryCode] = useState('+593');

  return (
    <div className="mobile-page">
      <h2>Clientes</h2>
      {/* Aquí puedes reconstruir el contenido y lógica de la página */}
    </div>
  );
}

export default ClientesPage;
