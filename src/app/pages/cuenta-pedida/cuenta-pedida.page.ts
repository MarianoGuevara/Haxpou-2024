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
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Pedido } from 'src/app/interfaces/app.interface';
import { Subscription } from 'rxjs';

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
        RouterLink,
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
    protected buttonDisabled = true;

    private suscripcion!: Subscription;

    constructor() {
        effect(() => {
            const currentUser = this.authService.currentUserSig();
            if (currentUser) {
                this.spinner.show();

                // Nos suscribimos a traerPedidoUsuario y actualizamos 'pedido' cuando haya cambios
                this.suscripcion = this.dbService
                    .traerPedidoUsuarioObservable(currentUser.uid!)
                    .subscribe({
                        next: (pedido) => {
                            console.log('llamado subscripcion pedido');

                            console.log(pedido);

                            this.pedido = pedido || null;
                            console.log(this.pedido);

                            this.suscripcion.unsubscribe();
                            this.spinner.hide();
                        },
                        error: (err) => {
                            console.error('Error al obtener el pedido:', err);
                            this.spinner.hide();
                        },
                    });
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
