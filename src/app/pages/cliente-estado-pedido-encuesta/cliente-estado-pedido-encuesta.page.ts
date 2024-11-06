import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Cliente, UserDetails } from 'src/app/interfaces/app.interface';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
        RouterLink,
    ],
})
export class ClienteEstadoPedidoEncuestaPage {
    protected authService = inject(AuthService);
    private alertController = inject(AlertController);
    db = inject(DatabaseService);
    spinner = inject(NgxSpinnerService);

    constructor() {}

    protected castUserToClient(user: UserDetails) {
        return user as Cliente;
    }

    verEstadoPedido() {
        this.spinner.show();

        const pedidoUser = this.db.traerPedidoUsuario(
            this.authService.currentUserSig()?.uid!
        );
        console.log(pedidoUser);
        // aca una vez q rutee todo ok testear mejor
        this.showAlert('El estado de su pedido es: ', '');
        this.spinner.hide();
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
