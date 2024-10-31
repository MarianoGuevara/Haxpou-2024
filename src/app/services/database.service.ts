import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection,addDoc,getDoc,getDocs,updateDoc, collectionData, doc, deleteDoc, where, query } from '@angular/fire/firestore';
import { Cliente } from '../interfaces/user-details.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: Firestore) { }


  agregarCliente(cliente : Cliente) : void | null
  {
    const clientesCol = collection(this.firestore,'Usuarios');

  }


  aprobarCliente(cliente : Cliente) : void
  {
    const col = collection(this.firestore, 'Usuarios');

    //Referencia hacia el documento de firebase
    const documento = doc(col,cliente.uid);

    updateDoc(documento,{...cliente});
  }


  //Devolvemos un observable para que "escuche" los cambios
  //Observable -> tipo de dato que puede variar
  traerClientesPendientes() : Observable<Cliente[]>
  {
    const col = collection(this.firestore,'Usuarios');

    const clientes = query(col, where('aprobado','==',false));

    //idField es el id del documento generado automaticamente por firebase, que sera el atributo de nuestro cliente
    return collectionData(clientes, { idField: 'uid' }) as Observable<Cliente[]>
  }
  //Luego para utilizarlo nos suscribimos al metodo asi mientras esta en ejecucion y se agrega un cliente
  //este se va a actualizar
}
