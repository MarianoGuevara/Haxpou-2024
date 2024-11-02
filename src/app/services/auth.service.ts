import { inject, Injectable, signal, OnInit } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CollectionsNames } from '../utils/firebase-names.enum';
import {
    Cliente,
    Empleado,
    Supervisor,
    UserDetails,
} from '../interfaces/user-details.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, Observable } from 'rxjs';
import { collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private firestore = inject(AngularFirestore);
    private auth = inject(Auth);
    private spinner = inject(NgxSpinnerService);
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

    // por ahi ni hace falta esta funcion, pero por las dudas la dejo -- Fran
    getAllUsers(): Observable<(Cliente | Empleado | Supervisor)[]> {
        return this.firestore
            .collection<UserDetails>(CollectionsNames.USUARIOS)
            .valueChanges()
            .pipe(
                map((users) =>
                    users.map((user) => {
                        return this.castUser(user);
                    })
                )
            );
    }

    private castUser(user: UserDetails): Cliente | Empleado | Supervisor {
        let userCasted: Cliente | Empleado | Supervisor | null = null;
        if (
            (user as Empleado).tipo &&
            ((user as Empleado).tipo === 'bartender' ||
                (user as Empleado).tipo === 'cocinero' ||
                (user as Empleado).tipo === 'maitre' ||
                (user as Empleado).tipo === 'mozo')
        ) {
            userCasted = user as Empleado;
        } else if (
            (user as Supervisor).perfil &&
            ((user as Supervisor).perfil === 'dueno' ||
                (user as Supervisor).perfil === 'supervisor')
        ) {
            userCasted = user as Supervisor;
        } else if (
            (user as Cliente).tipo &&
            ((user as Cliente).tipo === 'clienteRegistrado' ||
                (user as Cliente).tipo === 'clienteAnonimo')
        ) {
            userCasted = user as Cliente;
        }

        return userCasted!;
    }

    // Registro de usuarios, puede ser paciente, especialista o admin
    public async register(newUser: UserDetails) {
        const res = await createUserWithEmailAndPassword(
            this.auth,
            newUser.correo,
            newUser.clave
        );
        const ref = this.firestore
            .collection(CollectionsNames.USUARIOS)
            .doc(res.user.uid);

        const completeUser: UserDetails = {
            ...newUser,
            uid: res.user.uid,
        };

        ref.set(completeUser);
        this.currentUserSig.set(completeUser);
    }

    // Inicio de sesión
    // me retorna el usuario creado si salio todo bien, si hay errores, retorna null
    public async login(email: string, password: string) {
        this.spinner.show();
        try {
            const userCredentials = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            this.currentUserSig.set(undefined);
            await this.updateUserSignal(userCredentials.user);

            console.log(this.currentUserSig());

            this.spinner.hide();
            return userCredentials;
        } catch (error) {
            console.error(error);
            this.spinner.hide();
            return null;
        }
    }

    private async updateUserSignal(authUser: User) {
        const user = await this.getUserFromFirestore(authUser).toPromise();
        const userDetails = user!.data() as UserDetails;

        this.currentUserSig.set(userDetails);
    }

    private getUserFromFirestore(authUser: User) {
        return this.firestore
            .doc<UserDetails>(`${CollectionsNames.USUARIOS}/` + authUser.uid)
            .get();
    }

    // Cierre de sesión
    logout() {
        return signOut(this.auth);
    }
}
