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
import {
    Cliente,
    Mesa,
    Pedido,
    UserDetails,
} from 'src/app/interfaces/app.interface';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import _default from 'emailjs-com';
import { Router, RouterLink } from '@angular/router';
import { SendPushService } from 'src/app/services/api-push.service';

@Component({
    selector: 'app-cliente-estado-pedido-encuesta',
    templateUrl: './cliente-estado-pedido-encuesta.page.html',
    styleUrls: ['./cliente-estado-pedido-encuesta.page.scss'],
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
export class ClienteEstadoPedidoEncuestaPage {
    protected authService = inject(AuthService);
    private alertController = inject(AlertController);
    db = inject(DatabaseService);
    spinner = inject(NgxSpinnerService);
    private router = inject(Router);
    private sendPushService = inject(SendPushService);

    clienteActual: Cliente | null = null;

    constructor() {
        effect(() => {
            this.clienteActual = this.authService.currentUserSig() as Cliente;
        });
    }

    protected castUserToClient(user: UserDetails) {
        return user as Cliente;
    }

    async verEstadoPedido() {
        this.spinner.show();

        const pedidoUser = await this.db.traerPedidoUsuario(
            this.clienteActual?.uid!
        );

        const pedidoReal = pedidoUser.docs[0].data() as Pedido;

        let estadoCasted = '';
        switch (pedidoReal.estado) {
            case 'pendiente':
                estadoCasted = 'pendiente de aprobación por parte de un mozo';
                break;
            default:
                estadoCasted = pedidoReal.estado;
                break;
        }
        this.showAlert('El estado de su pedido es: ', estadoCasted).then(() => {
            this.spinner.hide();
        });
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

    async pedirCuenta(): Promise<void> {
        this.spinner.show();

        const pedidoUser = await this.db.traerPedidoUsuario(
            this.clienteActual?.uid!
        );
        const pedidoReal = pedidoUser.docs[0].data() as Pedido;

        const newPedido: Pedido = {
            ...pedidoReal!,
            estado: 'cuenta solicitada',
        };
        await this.db.actualizarPedido(newPedido);

        const mesaSnapshot = await this.db.traerMesaByUid(pedidoReal.id_mesa);
        const mesa = mesaSnapshot.docs[0].data() as Mesa;

        await this.sendPushService.sendToRole(
            `Cuenta pedida en mesa ${mesa.numero}`,
            `El cliente de la mesa ${mesa.numero} solicitó la cuenta`,
            'mozo'
        );

        this.spinner.hide();

        this.router.navigateByUrl('/cuenta-pedida');
    }
}
