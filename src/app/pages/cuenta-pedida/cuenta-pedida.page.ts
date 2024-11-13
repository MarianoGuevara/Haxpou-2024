import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    IonBackButton,
    AlertController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pedido } from 'src/app/interfaces/app.interface';

@Component({
    selector: 'app-cuenta-pedida',
    templateUrl: './cuenta-pedida.page.html',
    styleUrls: ['./cuenta-pedida.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonHeader,
        IonToolbar,
        CommonModule,
        FormsModule,
        IonButton,
        IonButtons,
        IonBackButton,
    ],
})
export class CuentaPedidaPage {
    protected authService = inject(AuthService);
    private qrScannService = inject(QrscannerService);
    private alertController = inject(AlertController);
    private router = inject(Router);
    private dbService = inject(DatabaseService);
    private spinner = inject(NgxSpinnerService);

    protected pedido: Pedido | null = null;

    constructor() {
        effect(async () => {
            if (this.authService.currentUserSig()) {
                this.spinner.show();

                const pedidoUser = await this.dbService.traerPedidoUsuario(
                    this.authService.currentUserSig()?.uid!
                );

                this.pedido = pedidoUser.docs[0].data() as Pedido;

                console.log(this.pedido);

                this.spinner.hide();
            }
        });
    }

    async scanearQrPropina() {
        // this.router.navigateByUrl('/propina');

        const rta = await this.qrScannService.startScan();
        if (rta == 'propina') {
            this.router.navigateByUrl('/propina');
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
