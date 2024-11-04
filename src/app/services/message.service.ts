import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
// import {
//     Firestore,
//     collection,
//     addDoc,
//     getDoc,
//     getDocs,
//     updateDoc,
//     collectionData,
//     doc,
//     deleteDoc,
//     where,
//     query,
//     setDoc,
// } from '@angular/fire/firestore';
import {
    UserDetails,
    Mesa,
    MesaMessage,
    MesaMessageFromFirestore,
    MozoMessage,
    MozoMessageFromFirestore,
} from '../interfaces/app.interface';
import { map, Observable } from 'rxjs';
import { CollectionsNames } from '../utils/firebase-names.enum';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private firestore = inject(AngularFirestore);

    constructor() {}

    sendMessage(message: MesaMessageFromFirestore | MozoMessageFromFirestore) {
        this.firestore
            .collection(CollectionsNames.MESA_MESSAGES + message.numeroMesa)
            .add(message);
    }

    //Devolvemos un observable para que "escuche" los cambios
    //Observable -> tipo de dato que puede variar
    getMensajesMesa(numeroMesa: number) {
        return this.firestore
            .collection(CollectionsNames.MESA_MESSAGES + numeroMesa)
            .get()
            .pipe(
                map((messagesFromDB) => {
                    const messages = messagesFromDB.docs.map((message) => {
                        const messageObj = message.data() as
                            | MesaMessageFromFirestore
                            | MozoMessageFromFirestore;
                        return {
                            ...messageObj,
                            createdAt: messageObj.createdAt.toDate(),
                        } as MesaMessage | MozoMessage;
                    });

                    return messages.sort(
                        (m, m2) =>
                            m.createdAt.getTime() - m2.createdAt.getTime()
                    );
                })
            );
    }

    isMozoMessage(message: MesaMessage | MozoMessage): boolean {
        return (message as MozoMessage).nombreMozo !== undefined;
    }
}
