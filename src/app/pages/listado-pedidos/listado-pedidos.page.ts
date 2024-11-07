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
    AlertController,
} from '@ionic/angular/standalone';
import { Cliente, Mesa, Pedido } from 'src/app/interfaces/app.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SendPushService } from 'src/app/services/api-push.service';

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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListadoPedidosPage implements OnInit {
    pedidos: Pedido[] = [];
    spinner = inject(NgxSpinnerService);
    db = inject(DatabaseService);
    suscripcion: Subscription | null = null;
    alertController = inject(AlertController);
    arrayNombresPedidos: string[] = []; // para mostrar nombre de pedido "personalizado"
    sendPush = inject(SendPushService);
    constructor() {
        // const pedidoEjemplo: Pedido = {
        //     uid: '123456',
        //     id_cliente: 'M3Kze37AVUf5MXzulj3MYH4NUX42',
        //     id_mesa: 'F3Wm7L0RRsQsfhZDJKZO38hn9uQ2',
        //     precio_total: 1500,
        //     item_menu: ['hamburguesa', 'coca cola', 'fideos'],
        //     cantidad_item_menu: ['4', '8', '3'],
        //     estado_detalle: ['pendiente', 'pendiente', 'pendiente'],
        //     estado: 'pendiente',
        //     tiempo_estimado: 10,
        // };
        // this.db.agregarFalopaaaaaa(pedidoEjemplo, 'Pedidos');
    }

    ngOnInit() {
        this.spinner.show();
        try {
            this.suscripcion = this.db.traerPedidos().subscribe((data) => {
                // me trae los pendientes y listos para entregar
                this.pedidos = data;
                this.pedidos.forEach(async (pedido) => {
                    const mesa: Mesa = await this.traerMesaDeUnPedido(pedido);
                    this.arrayNombresPedidos.push(
                        "Pedido mesa '" + mesa.numero! + "'"
                    );
                });
                this.spinner.hide();
                this.suscripcion?.unsubscribe();
            });
        } catch (error) {
            console.error(error);
            this.spinner.hide();
        }
    }

    async traerMesaDeUnPedido(pedido: Pedido): Promise<Mesa> {
        const mesa = await this.db.traerMesaPedido(pedido.id_mesa);
        const mesaReal = mesa.docs[0].data() as Mesa;
        return mesaReal;
    }

    async actualizarPedido(pedido: Pedido) {
        this.spinner.show();

        const clientePedidoDb = await this.db.traerPedidoUsuario(
            pedido.id_cliente
        );
        const clientePedido = clientePedidoDb.docs[0].data() as Cliente;

        clientePedido.situacion = 'pedidoEnCurso'; // actualizo situacion de cliente
        pedido.estado = 'en preparecion';
        pedido.estado_detalle.forEach((elemento) => {
            elemento = 'en preparacion';
        });

        // PUSH
        this.sendPush.sendToRole(
            'Tienes bebidas nuevos pendientes para preparar',
            'Un mozo confirmó un nuevo pedido. Ve a tu lista de pendientes para ver qué puedes hacer',
            'bartender'
        );
        this.sendPush.sendToRole(
            'Tienes alimentos nuevos pendientes para preparar',
            'Un mozo confirmó un nuevo pedido. Ve a tu lista de pendientes para ver qué puedes hacer',
            'cocinero'
        );

        await this.db.actualizarCliente(clientePedido);
        this.db.actualizarPedido(pedido);

        this.spinner.hide();
    }

    async entregarPedido(p: Pedido) {}
}
