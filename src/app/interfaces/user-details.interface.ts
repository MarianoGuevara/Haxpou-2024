export interface UserDetails {
    uid?: string;
    correo: string;
    clave: string;
    nombre: string;
    apellido?: string;
    dni?: number;
    foto: string; // url a storage
    role: PerfilesType;
}

export interface Empleado extends UserDetails {
    cuil: number;
}

export interface Supervisor extends UserDetails {
    cuil: number;
}

export interface Cliente extends UserDetails {
    aprobado: EstadoCliente;
    situacion: SituacionCliente;
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

export type SituacionCliente = 'out' | 'enEspera' | 'mesaAsignado';
// out estado inicial... cuando scanea qr pasa a enEspera, despues cuando el maitre le asigna una mesa volvería a
// cambiar y así... que opinan

export type PerfilesType = JefeType | EmpleadoType | ClienteType;
