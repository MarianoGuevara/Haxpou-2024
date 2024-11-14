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
    selector: 'app-detalle-cuenta',
    templateUrl: './detalle-cuenta.page.html',
    styleUrls: ['./detalle-cuenta.page.scss'],
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
export class DetalleCuentaPage {
    private db = inject(DatabaseService);
    private spinner = inject(NgxSpinnerService);
    private authService = inject(AuthService);
    private productoService = inject(ProductoService);
	private interactionService = inject(InteractionService)
	private router = inject(Router)

    private pedidoToFirebase: Pedido | null = null;
    protected pedido: PedidoConProductos | null = null;

    constructor() {
        effect(async () => {
            if (this.authService.currentUserSig()) {
                this.spinner.show();

                const pedidoUser = await this.db.traerPedidoUsuario(
                    this.authService.currentUserSig()?.uid!
                );

                this.pedidoToFirebase = pedidoUser.docs[0].data() as Pedido;

                const productosPedido: Producto[] = [];

                this.pedidoToFirebase.item_menu.forEach(async (productName) => {
                    const productoQuery =
                        await this.productoService.getProductoNombre(
                            productName
                        );

                    productosPedido.push(
                        productoQuery.docs[0].data() as Producto
                    );
                });

                this.pedido = {
                    ...this.pedidoToFirebase,
                    item_menu: productosPedido as Producto[],
                };

                console.log(this.pedido);

                this.spinner.hide();
            }
        });
    }

    async onPagarClick() {
		this.spinner.show()

        const newPedido: Pedido = {
            ...this.pedidoToFirebase!,
			precio_total: this.pedido!.precio_total! + this.pedido?.propina!,
            estado: 'cuenta pagada a revision',
        };

		await this.db.actualizarPedido(newPedido)

		this.spinner.hide()

		this.interactionService.presentAlert('En revisión', 'Tu pago esta siendo revisado por un mozo').then(() => {
			this.router.navigateByUrl('/espera-cliente') // para chequear lo de que puede escanear mesa5
		})
    }
}
