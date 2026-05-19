export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  activo: boolean;
}

export interface ProductoRequest {
  nombre: string;
  precio: number;
  categoria?: string;
}