export interface PedidoCaja {
  pedido_id: number;
  numero_mesa: string;
  total: number;
  fecha: string;
}

export interface CheckoutRequest {
  medio_pago: 'EFECTIVO' | 'TC' | 'TD';
}

export interface CheckoutResponse {
  mensaje: string;
}

export interface PedidoCajaDetalle {
  id: number;
  mesa_id: number;
  estado: string;
  total: number;
  fecha_creacion: string;
  detalles: DetalleCaja[];
}

export interface DetalleCaja {
  id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}