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
    completoEncuesta ?: boolean;
}

export type EstadoCliente = 'pendiente' | 'aprobado' | 'rechazado';

export type JefeType = 'dueno' | 'supervisor';

export type EmpleadoType = 'maitre' | 'mozo' | 'cocinero' | 'bartender';

export type ClienteType = 'clienteRegistrado' | 'clienteAnonimo';

export type SituacionCliente =
    | 'out'
    | 'enEspera'
    | 'mesaAsignado'
    | 'pedidoPendienteAprobacion'
    | 'pedidoEnCurso'
    | 'pedidoEntregado';
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
    sector: PedidoSector;
}

export interface Mesa {
    uid?: string;
    numero: number;
    qr: string;
    disponible: boolean;
    idCliente?: string;
}

import { Timestamp } from '@angular/fire/firestore';

interface MessageFromFirestore {
    userId: string;
    content: string;
    createdAt: Timestamp;
    numeroMesa: number;
}

interface Message {
    userId: string;
    content: string;
    createdAt: Date;
    numeroMesa: number;
}

export interface MesaMessageFromFirestore extends MessageFromFirestore {}

export interface MesaMessage extends Message {}

export interface MozoMessageFromFirestore extends MessageFromFirestore {
    nombreMozo: string;
}

export interface MozoMessage extends Message {
    nombreMozo: string;
}

export interface Encuesta {
    uid?: string;
    foto1?: string;
    foto2?: string;
    foto3?: string;
    fecha?: Date;
    atencion_cliente: number;
    comida: number;
    como_conocio: number[];
    opinion_general: string;
    limpieza: number;
    encuestado: string;
}

export interface Pedido {
    uid?: string;
    id_cliente: string;
    id_mesa: string;
    precio_total: number;
    item_menu_sector: PedidoSector[]; // paralelo segun sea barra o cocina
    item_menu: string[]; // serán array paralelos... X ej: ["hamburguesa", "coca cola", fideos] la pesona tiene 1 pedido de 4 hamburguesas, 8 coca colas, 3 fideos...
    cantidad_item_menu: number[]; // [4, 8, 3]
    estado_detalle: EstadoDetallePedido[]; // otro array paralelo... cuando las 4 hamburguesas esten listas, cambiara ese indice a listo. Cuando todos los indices sean listos recien ahi el pedido entero va a ser listo
    estado: EstadoPedido;
    tiempo_estimado: number; // minutos
    entregado: boolean; //verificamos si fue entregado o no
	cuentaEntregada: boolean
	propina?: number
}
// cuando confirma el mozo, cuando confirman TODAS las partes individuales del pedido

export type PedidoSector = 'barra' | 'cocina';
export type EstadoDetallePedido = 'pendiente' | 'en preparacion' | 'listo';
export type EstadoPedido =
    | 'pendiente' // cuando arranca
    | 'en preparecion' // cuando el mozo lo confirma
    | 'listo para entregar' // cuando los de la barra y cocina le ponen 'listo' a TODOS los componentes del pedido
    | 'entregado' //una vez que el pedido es entregado se abre la opcion de pedir la cuenta
    | 'cuenta solicitada'
    | 'cuenta pagada a revision'
    | 'cuenta pagada';



export interface PedidoConProductos{ // como deberia ser
    uid?: string;
    id_cliente: string;
    id_mesa: string;
    precio_total: number;
    item_menu_sector: PedidoSector[]; // paralelo segun sea barra o cocina
    item_menu: Producto[]; // serán array paralelos... X ej: ["hamburguesa", "coca cola", fideos] la pesona tiene 1 pedido de 4 hamburguesas, 8 coca colas, 3 fideos...
    cantidad_item_menu: number[]; // [4, 8, 3]
    estado_detalle: EstadoDetallePedido[]; // otro array paralelo... cuando las 4 hamburguesas esten listas, cambiara ese indice a listo. Cuando todos los indices sean listos recien ahi el pedido entero va a ser listo
    estado: EstadoPedido;
    tiempo_estimado: number; // minutos
    entregado: boolean; //verificamos si fue entregado o no
	cuentaEntregada: boolean
	propina?: number
}