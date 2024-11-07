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
} from '@angular/fire/firestore';
import { Producto } from '../interfaces/app.interface';
import { Observable } from 'rxjs';
import { CollectionsNames } from '../utils/firebase-names.enum';

@Injectable({
    providedIn: 'root',
})
export class ProductoService {
    constructor(private firestore: Firestore) {}

    agregarProducto(producto: Producto): void | null {}

    actualizarProducto(producto: Producto): void {
        const col = collection(this.firestore, CollectionsNames.PRODUCTOS);

        //Referencia hacia el documento de firebase
        const documento = doc(col, producto.uid);

        updateDoc(documento, { ...producto });
    }

    //Devolvemos un observable para que "escuche" los cambios
    //Observable -> tipo de dato que puede variar
    traerProductos(): Observable<Producto[]> {
        const col = collection(this.firestore, CollectionsNames.PRODUCTOS);

        const productos = query(col);

        //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro producto
        return collectionData(productos, { idField: 'uid' }) as Observable<
            Producto[]
        >;
    }
    //Luego para utilizarlo nos suscribimos al metodo asi mientras esta en ejecucion y se agrega un producto
    //este se va a actualizar

    async getProducto(uid: string) {
        const productoQuery = query(
            collection(this.firestore, CollectionsNames.PRODUCTOS),
            where('uid', '==', uid)
        );
        const productoDocs = await getDocs(productoQuery);
        return productoDocs;
    }

    async getProductoNombre(name: string) {
        const productoQuery = query(
            collection(this.firestore, CollectionsNames.PRODUCTOS),
            where('nombre', '==', name)
        );
        const productoDocs = await getDocs(productoQuery);
        return productoDocs;
    }
}
