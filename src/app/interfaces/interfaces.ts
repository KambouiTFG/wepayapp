export interface User {
    nombre?: string;
    email?: string;
    creado?: number;
    cambioNombre?: number;
    avatar?: string;
    salas?: string[];
}

export interface Sala {
    nombre?: string;
    creado?: number;
    img?: string;
    code?: string;
    open?: boolean;
    owner?: string;
    admins?: string[];
    productos?: string[];
    participantes?: string[];
    uid?: string;
}
