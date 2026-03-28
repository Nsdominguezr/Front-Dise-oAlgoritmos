export interface LoginRequest {
  username: string;
  password: string;
  rol_id: number;
  sede_id: number;
}

export interface Usuario {
  id: number;
  username: string;
  rol_id: number;
  sede_id: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    usuario?: Usuario;
  };
}
