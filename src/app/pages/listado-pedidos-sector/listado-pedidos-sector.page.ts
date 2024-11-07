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
import { Mesa, Pedido } from 'src/app/interfaces/app.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseService } from 'src/app/services/database.service';
import { Subscription } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SendPushService } from 'src/app/services/api-push.service';

interface Detalle {
    item: string;
    cantidad: number;
    index_real: number; // index array paralelo
    index_real_pedido: number; // index array local de todos los pedidos
    estado: string;
}

@Component({
    selector: 'app-listado-pedidos-sector',
    templateUrl: './listado-pedidos-sector.page.html',
    styleUrls: ['./listado-pedidos-sector.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        FormsModule,
        IonButtons,
        IonBackButton,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListadoPedidosSectorPage implements OnInit {
    pedidos: Pedido[] = [];
    spinner = inject(NgxSpinnerService);
    db = inject(DatabaseService);
    suscripcion: Subscription | null = null;
    detallesActuales: Detalle[] = [];
    auth = inject(AuthService);
    sendPush = inject(SendPushService);

    constructor() {}

    ngOnInit() {
        this.spinner.show();
        try {
            this.suscripcion = this.db.traerPedidosConfirmados().subscribe((data) => {
                this.pedidos = data;
                console.log(this.pedidos);
                for (let i = 0; i < this.pedidos.length; i++) {
                    for (let j = 0; j < this.pedidos[i].item_menu.length; j++) {
                        if (
                            this.pedidos[i].item_menu_sector[j] == 'cocina' &&
                            this.auth.currentUserSig()?.role == 'cocinero'
                        ) {
                            this.detallesActuales.push({
                                item: this.pedidos[i].item_menu[j],
                                cantidad: this.pedidos[i].cantidad_item_menu[j],
                                index_real: j,
                                estado: this.pedidos[i].estado_detalle[j],
                                index_real_pedido: i,
                            });
                        } else if (
                            this.pedidos[i].item_menu_sector[j] == 'barra' &&
                            this.auth.currentUserSig()?.role == 'bartender'
                        ) {
                            this.detallesActuales.push({
                                item: this.pedidos[i].item_menu[j],
                                cantidad: this.pedidos[i].cantidad_item_menu[j],
                                index_real: j,
                                estado: this.pedidos[i].estado_detalle[j],
                                index_real_pedido: i,
                            });
                        }
                    }
                }

                this.spinner.hide();
                this.suscripcion?.unsubscribe();
            });
        } catch (error) {
            console.error(error);
            this.spinner.hide();
        }
    }

    actualizarDetallePedido(detallePedido: Detalle) {
        console.log(detallePedido.index_real_pedido);
        console.log(detallePedido.index_real);
        const pedidoSeleccionado =
            this.pedidos[detallePedido.index_real_pedido];
        console.log(pedidoSeleccionado);

        detallePedido.estado = 'listo'; // lo saco de pantalla

        pedidoSeleccionado.estado_detalle[detallePedido.index_real] = 'listo'; // marco en el pedido real el indice como listo

        let listoTodo: boolean = true;
        for (let i = 0; i < pedidoSeleccionado.estado_detalle.length; i++) {
            if (pedidoSeleccionado.estado_detalle[i] != 'listo') {
                listoTodo = false;
                break;
            }
        }

        if (listoTodo) {
            this.sendPush.sendToRole(
                'Tienes un nuevo pedido listo para entregar',
                'Un nuevo pedido está listo completamente para su entrega.',
                'mozo'
            );
            pedidoSeleccionado.estado = 'listo para entregar'; // si todos los indices son listos, lo pongo para listo para entregar... el cliente tendra q confirmar recepcion para q se ponga como entregado
        }

        this.db.actualizarPedido(pedidoSeleccionado);
    }
}
