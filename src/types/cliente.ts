// Tipos para clientes
export interface Cliente {
  id: number;
  nombre: string;
  creado_en: string;
  cedula?: string;
  direccion?: string;
  negocio?: string;
  telefono?: string;
}
