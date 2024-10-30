export interface UserDetails {
    uid: string;
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    dni: number;
    cuil: number;
    foto: string; // url a storage
    perfil: 'dueno' | 'supervisor';
}

export type Perfiles =
    | 'dueno'
    | 'supervisor'
    | 'maitre'
    | 'mozo'
    | 'cocinero'
    | 'bartender'
    | 'clienteRegistrado'
    | 'clienteAnonimo';
