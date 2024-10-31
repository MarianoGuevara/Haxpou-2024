export interface UserDetails {
    uid?: string;
    email: string;
    password: string;
    nombre: string;
    apellido?: string;
    dni?: number;
    foto: string; // url a storage
}

export interface Empleado extends UserDetails {
    cuil: number;
    tipo: EmpleadoType;
}

export interface Supervisor extends UserDetails {
    cuil: number;
    perfil: JefeType;
}

export interface Cliente extends UserDetails {
    tipo: ClienteType;
    aprobado: EstadoCliente;
}

export interface Producto {
    uid?: string;
    nombre: string;
    descripcion: string;
    tiempoElaboracion: number;
    precio: number;
    fotos: string[];
    qr: string;
}

export type EstadoCliente = 'pendiente' | 'aprobado' | 'rechazado';

export type JefeType = 'dueno' | 'supervisor';

export type EmpleadoType = 'maitre' | 'mozo' | 'cocinero' | 'bartender';

export type ClienteType = 'clienteRegistrado' | 'clienteAnonimo';

export type PerfilesType = JefeType | EmpleadoType | ClienteType;
