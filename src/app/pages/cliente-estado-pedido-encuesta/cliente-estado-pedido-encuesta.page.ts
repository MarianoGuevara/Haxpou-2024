import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonBackButton,
    AlertController,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Cliente, Pedido, UserDetails } from 'src/app/interfaces/app.interface';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import _default from 'emailjs-com';

@Component({
    selector: 'app-cliente-estado-pedido-encuesta',
    templateUrl: './cliente-estado-pedido-encuesta.page.html',
    styleUrls: ['./cliente-estado-pedido-encuesta.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        FormsModule,
        IonButton,
        IonButtons,
        IonBackButton,
        RouterModule,
        ReactiveFormsModule
    ],
})
export class ClienteEstadoPedidoEncuestaPage {
    protected authService = inject(AuthService);
    private alertController = inject(AlertController);
    db = inject(DatabaseService);
    spinner = inject(NgxSpinnerService);
    clienteActual: Cliente | null = null;

    ngOnInit(): void {
        this.clienteActual = this.authService.currentUserSig() as Cliente;
    }
    constructor() {
        this.clienteActual = this.authService.currentUserSig() as Cliente;
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

    async pedirCuenta() : Promise<void>
    {
        const pedidoDoc = await this.db.traerPedidoUsuario(this.clienteActual?.uid!);
        const pedido = pedidoDoc.docs[0].data() as Pedido;
    
        //a continuacion chadcopati procede a cambiar el estado del pedido
    }
}
