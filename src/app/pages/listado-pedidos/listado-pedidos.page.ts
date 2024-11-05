import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
} from '@ionic/angular/standalone';
import { Pedido } from 'src/app/interfaces/app.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-listado-pedidos',
    templateUrl: './listado-pedidos.page.html',
    styleUrls: ['./listado-pedidos.page.scss'],
    standalone: true,
    imports: [
        IonBackButton,
        IonButtons,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        FormsModule,
    ],
})
export class ListadoPedidosPage implements OnInit {
    pedidos: Pedido[] = [];
    spinner = inject(NgxSpinnerService);
    db = inject(DatabaseService);
    suscripcion: Subscription | null = null;

    constructor() {
        const pedidoEjemplo: Pedido = {
            uid: '123456',
            id_cliente: 'M3Kze37AVUf5MXzulj3MYH4NUX42',
            id_mesa: 'F3Wm7L0RRsQsfhZDJKZO38hn9uQ2',
            precio_total: 1500,
            item_menu: ['hamburguesa', 'coca cola', 'fideos'],
            cantidad_item_menu: ['4', '8', '3'],
            estado_detalle: ['pendiente', 'pendiente', 'pendiente'],
            estado: 'pendiente',
            tiempo_estimado: 10,
        };
        this.db.agregarFalopaaaaaa(pedidoEjemplo, 'Pedidos');
    }

    ngOnInit() {
        this.spinner.show();
        try {
            this.suscripcion = this.db.traerPedidos().subscribe((data) => {
                this.pedidos = data;
                this.spinner.hide();
                this.suscripcion?.unsubscribe();
            });
        } catch (error) {
            console.error(error);
            this.spinner.hide();
        }
    }

    actualizarPedido(pedido: Pedido) {
        pedido.estado = 'en preparecion';
        pedido.estado_detalle.forEach((elemento) => {
            elemento = 'en preparacion';
        });

        this.db.actualizarPedido(pedido);
    }

    verDetallePedido(pedido: Pedido) {}
}
