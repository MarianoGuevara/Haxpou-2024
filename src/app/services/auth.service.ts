import { inject, Injectable, signal } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CollectionsNames } from '../utils/firebase-names.enum';
import { UserDetails } from '../interfaces/user-details.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    firestore = inject(AngularFirestore);
    router = inject(Router);
    auth = inject(Auth);
    currentUserSig = signal<UserDetails | null | undefined>(undefined);

    constructor() {
        this.auth.onAuthStateChanged((authUser) => {
            // si hay un usuarios activo, recupero de firestore el perfil entero
            if (authUser) {
                this.firestore
                    .doc<UserDetails>(
                        `${CollectionsNames.USUARIOS}/` + authUser.uid
                    )
                    .get()
                    .subscribe((user) => {
                        this.currentUserSig.set(user.data() as UserDetails);
                    });
            } else {
                this.currentUserSig.set(null);
            }
        });
    }

    // Registro de usuarios, puede ser paciente, especialista o admin
    public async register(newUser: UserDetails) {
        const promise = createUserWithEmailAndPassword(
            this.auth,
            newUser.email,
            newUser.password
        ).then((res) => {
            const ref = this.firestore
                .collection(CollectionsNames.USUARIOS)
                .doc(res.user.uid);

            const completeUser: UserDetails = {
                ...newUser,
                uid: res.user.uid,
            };

            ref.set(completeUser);
            this.currentUserSig.set(completeUser);
        });
        return promise;
    }

    // Inicio de sesión
    // me retorna el usuario creado si salio todo bien, si hay errores, retorna null
    public async login(email: string, password: string) {
        try {
            const user = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Cierre de sesión
    logout() {
        return signOut(this.auth);
    }
}
