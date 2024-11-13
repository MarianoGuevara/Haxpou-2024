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
    IonRange,
} from '@ionic/angular/standalone';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import {
    Pedido,
    PedidoConProductos,
    Producto,
} from 'src/app/interfaces/app.interface';
import { ProductoService } from 'src/app/services/producto.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-propina',
    templateUrl: './propina.page.html',
    styleUrls: ['./propina.page.scss'],
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
        IonRange,
    ],
})
export class PropinaPage {
    private db = inject(DatabaseService);
    private spinner = inject(NgxSpinnerService);
    private authService = inject(AuthService);
    private interactionService = inject(InteractionService);
	private router = inject(Router)

    protected pedido: Pedido | null = null;

    protected porcentajePropina: number = 0;

    constructor() {
        effect(async () => {
            if (this.authService.currentUserSig()) {
                this.spinner.show();

                const pedidoUser = await this.db.traerPedidoUsuario(
                    this.authService.currentUserSig()?.uid!
                );

                this.pedido = pedidoUser.docs[0].data() as Pedido;

                console.log(this.pedido);

                this.spinner.hide();
            }
        });
    }

    async onConfirmClick() {
        this.spinner.show();
        console.log(
            this.pedido?.precio_total! * (this.porcentajePropina / 100)
        );
        const newPedido: Pedido = {
            ...this.pedido!,
            propina:
                this.pedido?.precio_total! * (this.porcentajePropina / 100),
        };

        await this.db.actualizarPedido(newPedido);

        this.spinner.hide();

        this.interactionService
            .presentAlert('Hecho', '¡Muchas gracias por dejar tu propina!')
            .then(() => {
				this.router.navigateByUrl('/cuenta-pedida')
			});
    }
}
