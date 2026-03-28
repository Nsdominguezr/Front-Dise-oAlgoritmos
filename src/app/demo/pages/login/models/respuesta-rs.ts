export interface RespuestaGeneral<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
}

export interface RespuestaLogin extends RespuestaGeneral<{
    token: string;
    usuario: {
        id: number;
        username: string;
        rol_id: number;
        sede_id: number;
    };
}> {}

export interface RespuestaUsuarios extends RespuestaGeneral<Array<{
    id: number;
    username: string;
    rol_id: number;
    sede_id: number;
}>> {}
