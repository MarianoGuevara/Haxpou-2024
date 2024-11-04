export interface UserDetails {
    uid?: string;
    correo: string;
    clave: string;
    nombre: string;
    apellido?: string;
    dni?: number;
    foto: string; // url a storage
    role: PerfilesType;
    token?: string; // para las push notifications (identifica al celular al cual mandarlas)
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
    mesaAsignada: number;
}

export type EstadoCliente = 'pendiente' | 'aprobado' | 'rechazado';

export type JefeType = 'dueno' | 'supervisor';

export type EmpleadoType = 'maitre' | 'mozo' | 'cocinero' | 'bartender';

export type ClienteType = 'clienteRegistrado' | 'clienteAnonimo';

export type SituacionCliente = 'out' | 'enEspera' | 'mesaAsignado';
// out estado inicial... cuando scanea qr pasa a enEspera, despues cuando el maitre le asigna una mesa volvería a
// cambiar y así... que opinan

export type PerfilesType = JefeType | EmpleadoType | ClienteType;

export interface Producto {
    uid?: string;
    nombre: string;
    descripcion: string;
    tiempoElaboracion: number; // en minutos
    precio: number;
    fotos: string[];
    qr: string;
}

export interface Mesa {
    uid?: string;
    numero: number;
    qr: string;
    disponible: boolean;
    idCliente?: string;
}

import { Timestamp } from '@angular/fire/firestore';

export interface MesaMessageFromFirestore {
    content: string;
    createdAt: Timestamp;
    numeroMesa: number;
}

export interface MesaMessage {
    content: string;
    createdAt: Date;
    numeroMesa: number;
}

export interface MozoMessageFromFirestore {
    content: string;
    createdAt: Timestamp;
    nombreMozo: string;
    numeroMesa: number;
}

export interface MozoMessage {
    content: string;
    createdAt: Date;
    nombreMozo: string;
    numeroMesa: number;
}
