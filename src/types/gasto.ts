// Tipos para gastos
export interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  clienteId?: number;
}
