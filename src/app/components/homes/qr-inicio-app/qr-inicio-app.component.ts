import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonCard,
    IonContent,
    IonNote,
    IonInputPasswordToggle,
    AlertController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { SendPushService } from 'src/app/services/api-push.service';

@Component({
    selector: 'app-qr-inicio-app',
    standalone: true,
    templateUrl: './qr-inicio-app.component.html',
    styleUrls: ['./qr-inicio-app.component.scss'],
    imports: [
        CommonModule,
        IonButton,
        IonInput,
        IonLabel,
        IonItem,
        IonCard,
        IonContent,
        IonNote,
        IonInputPasswordToggle,
    ],
})
export class QrInicioAppComponent {
    qrScannService = inject(QrscannerService);
    alertController = inject(AlertController);
    sendPush = inject(SendPushService);
    router = inject(Router);
    authServie = inject(AuthService);

    constructor() {}

    // ngOnInit() {}

    async scanearQrInicioApp() {
        // this.router.navigate(['/espera-cliente']); // <-
        const rta = await this.qrScannService.startScan();
        if (rta == 'ClienteListaDeEsperaMaitre') {
            this.router.navigate(['/espera-cliente']);
            this.sendPush.sendToRole(
                'Cliente en lista de espera',
                'El cliente "' +
                    this.authServie.currentUserSig()?.nombre +
                    '" ingresó en la lista de espera.',
                'maitre'
            );
        } else {
            this.showAlert(
                'QR inválido',
                'El QR leido no es el correcto para ingresar al local'
            );
        }
    }

    private async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['Vale'],
            cssClass: 'custom-alert-class',
        });
        await alert.present();
    }
}
