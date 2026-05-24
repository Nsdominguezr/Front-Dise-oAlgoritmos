export interface Mesa {
  id: number;
  sede_id: number;
  numero_mesa: string;
  estado: 'LIBRE' | 'OCUPADA';
}

export interface Pedido {
  id: number;
  mesa_id: number;
  usuario_id: number;
  estado: 'ABIERTO' | 'PENDIENTE_PAGO' | 'PAGADO';
  total: number;
  fecha_creacion: string;
}

export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  producto_nombre?: string;
}

export interface AbrirPedidoRequest {
  mesa_id: number;
  usuario_id: number;
}

export interface AgregarItemRequest {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  sede_id: number;
}

export interface PedidoResponse {
  mensaje: string;
  pedido_id?: number;
  nuevo_total?: number;
}