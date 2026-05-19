export interface Inventario {
  id: number;
  sede_id: number;
  producto_id: number;
  cantidad: number;
  producto_nombre?: string;
  movimientos?: MovimientoInventario[];
}

export interface MovimientoInventario {
  id: number;
  inventario_id: number;
  usuario_id: number;
  tipo_movimiento: 'INGRESO' | 'MERMA';
  cantidad: number;
  fecha: string;
  observacion: string;
}

export interface MovimientoRequest {
  sede_id: number;
  producto_id: number;
  tipo_movimiento: 'INGRESO' | 'MERMA';
  cantidad: number;
  observacion?: string;
}