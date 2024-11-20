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
import { RouterModule } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

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
        IonToolbar,
        CommonModule,
        RouterModule,
        FormsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListadoPedidosPage implements OnInit {
    pedidos: Pedido[] = [];
    spinner = inject(NgxSpinnerService);
    db = inject(DatabaseService);
    alertController = inject(AlertController);
    sendPush = inject(SendPushService);
    private interactionService = inject(InteractionService);

    suscripcion: Subscription | null = null;
    arrayNombresPedidos: string[] = []; // para mostrar nombre de pedido "personalizado"

    ngOnInit() {
        this.spinner.show();
        try {
            this.suscripcion = this.db
                .traerPedidos()
                .subscribe(async (data) => {
                    // me trae los pendientes y listos para entregar
                    console.log(data);
                    this.pedidos = data.filter(
                        (p) =>
                            p.entregado === false ||
                            p.estado === 'cuenta pagada a revision' ||
                            (p.estado === 'cuenta solicitada' &&
                                p.cuentaEntregada === false)
                    ); // si el pedido ya esta entregado no lo traemos
                    for (let i = 0; i < this.pedidos.length; i++) {
                        //console.log('PEDIDO -> ', this.pedidos[i]);

                        const mesa = await this.db.traerMesaPedido(
                            this.pedidos[i].id_mesa
                        );
                        const mesaReal = mesa.docs[0].data() as Mesa;

                        this.arrayNombresPedidos.push(
                            "Pedido mesa '" + mesaReal.numero! + "'"
                        );
                    }

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

    async actualizarPedido(pedido: Pedido, index: number) {
        console.log(pedido);
        this.spinner.show();

        this.pedidos.splice(index, 1);

        const clientePedidoDb = await this.db.traerUsuario(pedido.id_cliente);
        const clientePedido = clientePedidoDb.docs[0].data() as Cliente;
        console.log(clientePedido);

        clientePedido.situacion = 'pedidoEnCurso'; // actualizo situacion de cliente
        pedido.estado = 'en preparecion';
        for (let i = 0; i < pedido.estado_detalle.length; i++) {
            pedido.estado_detalle[i] = 'en preparacion';
        }

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

        this.db.actualizarCliente(clientePedido);
        this.db.actualizarPedido(pedido);

        this.spinner.hide();
    }

    async entregarPedido(p: Pedido, index: number) {
        this.spinner.show();
        this.pedidos.splice(index, 1);

        const clientePedidoDb = await this.db.traerUsuario(p.id_cliente);
        const clientePedido = clientePedidoDb.docs[0].data() as Cliente;

        clientePedido.situacion = 'pedidoEntregado';
        p.entregado = true;
        p.estado = 'entregado';

        this.db.actualizarCliente(clientePedido);
        this.db.actualizarPedido(p);

        this.spinner.hide();
    }

    async entregarCuenta(pedido: Pedido, index: number) {
        this.spinner.show();
        this.pedidos.splice(index, 1);

        pedido.cuentaEntregada = true;

        await this.db.actualizarPedido(pedido);

        this.spinner.hide();

        this.interactionService.presentAlert(
            'Cuenta entregada',
            'Se entregó la cuenta solicitada exitosamente'
        );
    }

    async confirmarPago(pedido: Pedido, index: number) {
        this.spinner.show();
        this.pedidos.splice(index, 1);

        pedido.estado = 'cuenta pagada';

        await this.db.actualizarPedido(pedido);

        const clientePedidoDb = await this.db.traerUsuario(pedido.id_cliente);
        const clientePedido = clientePedidoDb.docs[0].data() as Cliente;

        clientePedido.situacion = 'out';
        clientePedido.completoEncuesta = false;
        clientePedido.mesaAsignada = -1;

        const mesaPedidoDb = await this.db.traerMesaByUid(pedido.id_mesa);
        const mesaPedido = mesaPedidoDb.docs[0].data() as Mesa;

        mesaPedido.idCliente = 'libre';
        mesaPedido.disponible = true;

        await this.db.actualizarCliente(clientePedido);
        await this.db.actualizarMesa(mesaPedido);

        this.spinner.hide();

        this.interactionService.presentAlert(
            'Mesa liberada',
            'Se liberó la mesa al confirmarse el pago'
        );
    }
}
