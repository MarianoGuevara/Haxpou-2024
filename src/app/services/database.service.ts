import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
    Firestore,
    collection,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    collectionData,
    doc,
    deleteDoc,
    where,
    query,
    QuerySnapshot,
    setDoc,
} from '@angular/fire/firestore';
import {
    Cliente,
    Mesa,
    UserDetails,
    Encuesta,
    Pedido,
} from '../interfaces/app.interface';
import { Observable } from 'rxjs';
import { CollectionsNames } from '../utils/firebase-names.enum';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    constructor(private firestore: Firestore) {}

    agregarCliente(cliente: Cliente): void | null {
        const clientesCol = collection(
            this.firestore,
            CollectionsNames.USUARIOS
        );
        doc(clientesCol);
    }

    actualizarCliente(cliente: Cliente): void {
        const col = collection(this.firestore, CollectionsNames.USUARIOS);

        //Referencia hacia el documento de firebase
        const documento = doc(col, cliente.uid);

        updateDoc(documento, { ...cliente });
    }

    actualizarMesa(mesa: Mesa): void {
        const col = collection(this.firestore, CollectionsNames.MESAS);

        //Referencia hacia el documento de firebase
        const documento = doc(col, mesa.uid);

        updateDoc(documento, { ...mesa });
    }

    //Devolvemos un observable para que "escuche" los cambios
    //Observable -> tipo de dato que puede variar
    traerClientesPendientes(): Observable<Cliente[]> {
        const col = collection(this.firestore, CollectionsNames.USUARIOS);

        const clientes = query(col, where('aprobado', '==', 'pendiente'));

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
        return collectionData(clientes, { idField: 'uid' }) as Observable<
            Cliente[]
        >;
    }
    //Luego para utilizarlo nos suscribimos al metodo asi mientras esta en ejecucion y se agrega un cliente
    //este se va a actualizar

    async getCliente(correo: string, clave: string) {
        const clienteQuery = query(
            collection(this.firestore, CollectionsNames.USUARIOS),
            where('correo', '==', correo),
            where('clave', '==', clave)
        );
        const clienteDocs = await getDocs(clienteQuery);
        return clienteDocs;
    }

    async traerUsuario(uid: string) {
        const usuarioQuery = query(
            collection(this.firestore, CollectionsNames.USUARIOS),
            where('uid', '==', uid)
        );
        const usuario = await getDocs(usuarioQuery);
        return usuario;
    }

    async traerClienteDeUnaMesa(uid: string) {
        const usuarioQuery = query(
            collection(this.firestore, CollectionsNames.MESAS),
            where('idCliente', '==', uid)
        );
        const usuario = await getDocs(usuarioQuery);
        return usuario;
    }

    traerClientesEspera(): Observable<Cliente[]> {
        const col = collection(this.firestore, CollectionsNames.USUARIOS);

        const clientes = query(col, where('situacion', '==', 'enEspera'));

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
        return collectionData(clientes, { idField: 'uid' }) as Observable<
            Cliente[]
        >;
    }

    async traerMesa(numero: string): Promise<QuerySnapshot> {
        const col = collection(this.firestore, CollectionsNames.MESAS);

        const mesasQuery = query(col, where('numero', '==', numero));

        const mesaDocs = await getDocs(mesasQuery);

        return mesaDocs;
    }

    traerMesas(): Observable<Mesa[]> {
        const col = collection(this.firestore, CollectionsNames.MESAS);

        const mesas = query(col);

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
        return collectionData(mesas, { idField: 'uid' }) as Observable<Mesa[]>;
    }

    // Funcion para agregar cualquier falopa harcodeada en firestore mas facil que hacerlo a mano
    public agregarFalopaaaaaa(data: any, path: string) {
        const coleccion = collection(this.firestore, path);

        addDoc(coleccion, data);
    }

    updateUserWithTokenForPushNotifications(
        usuario: UserDetails,
        token: string
    ): void {
        const col = collection(this.firestore, CollectionsNames.USUARIOS);

        //Referencia hacia el documento de firebase
        const documento = doc(col, usuario.uid);

        // seteo el token para identificar al usuario para mandar push notifications
        updateDoc(documento, { ...usuario, token });
    }

    traerEncuestas(): Observable<Encuesta[]> {
        const col = collection(this.firestore, CollectionsNames.ENCUESTAS);
        const encuestas = query(col);
        console.log(encuestas);
        return collectionData(encuestas, { idField: 'uid' }) as Observable<
            Encuesta[]
        >;
    }

    traerPedidos(): Observable<Pedido[]> {
        const col = collection(this.firestore, CollectionsNames.PEDIDOS);

        const pedidos = query(
            col,
            where('estado', 'in', ['pendiente', 'listo para entregar'])
        );

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
        return collectionData(pedidos, { idField: 'uid' }) as Observable<
            Pedido[]
        >;
    }

    traerPedidosConfirmados(): Observable<Pedido[]> {
        const col = collection(this.firestore, CollectionsNames.PEDIDOS);

        const pedidos = query(col, where('estado', '==', 'en preparecion'));

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
        return collectionData(pedidos, { idField: 'uid' }) as Observable<
            Pedido[]
        >;
    }

    actualizarPedido(pedido: Pedido): void {
        const col = collection(this.firestore, CollectionsNames.PEDIDOS);

        const documento = doc(col, pedido.uid);

        updateDoc(documento, { ...pedido });
    }

    async traerMesaPedido(idMesa: string) {
        const usuarioQuery = query(
            collection(this.firestore, CollectionsNames.MESAS),
            where('uid', '==', idMesa)
        );
        const usuario = await getDocs(usuarioQuery);
        return usuario;
    }

    async traerPedidoUsuario(idUsuario: string) {
        const usuarioQuery = query(
            collection(this.firestore, CollectionsNames.PEDIDOS),
            where('id_cliente', '==', idUsuario)

            // cuenta pagada -> el ultimo estado del pedido.
            // como puede haber 1 pedido x estadia del usuario, cuando este finalize x mas q tenga el
            // id del usuario como esta en estado totalmente finalizado no me lo va a traer,
            // solo me va a traer el pedido no terminado
        );
        const usuario = await getDocs(usuarioQuery);
        return usuario;
    }

    async AltaPedido(pedido: Pedido) {
        const col = collection(this.firestore, CollectionsNames.PEDIDOS);
        const documentoNuevo = doc(col);
        const id = documentoNuevo.id;

        pedido.uid = id;

        setDoc(documentoNuevo, pedido);
    }
}
