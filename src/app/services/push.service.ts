import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
    ActionPerformed,
    PushNotifications,
    PushNotificationSchema,
    Token,
} from '@capacitor/push-notifications';
import { InteractionService } from './interaction.service';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { Mesa, Pedido, UserDetails } from '../interfaces/app.interface';
import { AuthService } from './auth.service';

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
    providedIn: 'root',
})
export class PushService {
    private interactionService: InteractionService = inject(InteractionService);
    private dbService = inject(DatabaseService);
    private authService = inject(AuthService);
    private enable: boolean = false;

    constructor(private route: Router) {}

    init() {
        if (Capacitor.isNativePlatform()) {
            console.log('Initializing NotificationsPushService');
            PushNotifications.requestPermissions().then((result) => {
                if (result.receive === 'granted') {
                    // Register with Apple / Google to receive push via APNS/FCM
                    PushNotifications.register();
                } else {
                    // Show some error
                    this.interactionService.presentAlert(
                        'Error',
                        'Debes habilitar las notificaciones'
                    );
                }
            });
            this.addListener();
        }
    }

    private addListener() {
        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration', (token: Token) => {
            // alert('Push registration success, token: ' + token.value);
            // this.interactionService.presentAlert('Importante', `Registro exitoso, el token es: ${token.value}`);
            this.saveToken(token.value);
            this.enable = true;
        });

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError', (error: any) => {
            // alert('Error on registration: ' + JSON.stringify(error));
            this.interactionService.presentAlert('Error', `Registro fallido`);
        });

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener(
            'pushNotificationReceived',
            (notification: PushNotificationSchema) => {
                // alert('Push received: ' + JSON.stringify(notification));
                // this.interactionService.presentAlert(
                //     'Notificación',
                //     `${JSON.stringify(notification)}`
                // );
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification: ActionPerformed) => {
                // alert('Push action performed: ' + JSON.stringify(notification));
                // this.interactionService.presentAlert('Notificación en segundo plano', `${JSON.stringify(notification)}`)

                // if (notification?.notification?.data?.enlace) {
                //     this.route.navigateByUrl(
                //         notification.notification.data.enlace
                //     );
                // }

                if (this.authService.currentUserSig()?.role === 'mozo') {
                    this.interactionService
                        .presentAlert(
                            notification.notification.title!,
                            notification.notification.body!,
                            '',
                            'Entregar cuenta'
                        )
                        .then(async () => {
                            // hacer el qr valido
                            const tituloNotificacion =
                                notification.notification.title!;
                            const numeroMesa =
                                tituloNotificacion[
                                    tituloNotificacion.length - 1
                                ];
                            console.log(numeroMesa);

                            const mesaSnapshot = await this.dbService.traerMesa(
                                numeroMesa
                            );
                            const mesa = mesaSnapshot.docs[0].data() as Mesa;

                            const pedidoSnapshot =
                                await this.dbService.traerMesaPedido(mesa.uid!);
                            const pedido =
                                pedidoSnapshot.docs[0].data() as Pedido;

                            const newPedido: Pedido = {
                                ...pedido,
                                cuentaEntregada: true,
                            };

                            this.dbService.actualizarPedido(newPedido);
                        });
                }
            }
        );
    }

    public async saveToken(token: string) {
        console.log('saveToken -> ', token);

        const currentUser = this.authService.currentUserSig() as UserDetails;
        console.log('Usuario -> ', currentUser);

        try {
            await this.dbService.updateUserWithTokenForPushNotifications(
                currentUser,
                token
            );
        } catch (error) {
            this.interactionService.presentAlert('Error', error as string);
        }

        // const data = await this.localStorageService.getData(path);
        // console.log('get token saved -> ', data);
        // if (data) {
        //   if (data.token == token) {
        //     console.log('el token es el mismo');
        //     return;
        //   }
        // }
        // const updateDoc = {
        //   token,
        // };
        // await this.firestoreService.updateDocument(
        //   `${Models.Auth.PathUsers}/${this.user.uid}`,
        //   updateDoc
        // );
        // console.log('saved token éxito');
        // await this.localStorageService.setData(path, updateDoc);
    }

    async deleteToken() {
        console.log('deleteToken');
        // try {
        //   if (this.enable) {
        //     // del local storage
        //     const path = 'Token';
        //     await this.localStorageService.deleteData(path);
        //     // de firestore
        //     const updateDoc: any = {
        //       token: null,
        //     };
        //     await this.firestoreService.updateDocument(
        //       `${Models.Auth.PathUsers}/${this.user.uid}`,
        //       updateDoc
        //     );
        //   }
        // } catch (error) {
        //   console.log('no se pudo borrar el token de notificaciones del usuario');
        // no se pudo borrar el token de notificaciones del usuario
        // }
    }
}
