import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    AlertController,
} from '@ionic/angular/standalone';
import { Cliente, Mesa, Producto } from 'src/app/interfaces/app.interface';
import { ProductoService } from 'src/app/services/producto.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductCardComponent } from 'src/app/components/product-card/product-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/interfaces/app.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
    selector: 'app-listado-productos',
    templateUrl: './listado-productos.page.html',
    styleUrls: ['./listado-productos.page.scss'],
    standalone: true,
    imports: [
        IonButton,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        FormsModule,
        ProductCardComponent,
        IonBackButton,
        IonButtons,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListadoProductosPage implements OnInit {
    auth = inject(AuthService);
    productoService = inject(ProductoService);
    db = inject(DatabaseService);
    spinner = inject(NgxSpinnerService);
    alertController = inject(AlertController);
    router = inject(Router);
    productos: Producto[] = [];
    productosCantidad: number[] = [];
    precioTotal: number = 0;
    tiempoEstimado: number = 0;
    pedidoAlta: Pedido = {
        uid: '',
        id_cliente: '',
        id_mesa: '',
        precio_total: 0,
        item_menu_sector: [], // paralelo segun sea barra o cocina
        item_menu: [], // serán array paralelos... X ej: ["hamburguesa", "coca cola", fideos] la pesona tiene 1 pedido de 4 hamburguesas, 8 coca colas, 3 fideos...
        cantidad_item_menu: [], // [4, 8, 3]
        estado_detalle: [], // ["en preparacion", "listo", "listo"]
        estado: 'pendiente',
        tiempo_estimado: 0, // minutos
    };
    calculando: boolean = false;

    constructor() {}

    async ngOnInit() {
        this.spinner.show();
        this.productoService.traerProductos().subscribe((productos) => {
            this.productos = productos;
            for (let i = 0; i < this.productos.length; i++) {
                this.productosCantidad.push(0);
            }
            this.spinner.hide();
        });
    }

    async AgregarCantidad(p: Producto, index: number) {
        this.calculando = true;
        this.spinner.show();
        this.productosCantidad[index] = this.productosCantidad[index] + 1;

        let indiceEncontrado: number = this.IndiceIgualdadEnPedidoLocal(p);

        if (indiceEncontrado == -1) {
            this.pedidoAlta.item_menu.push(p.nombre);
            this.pedidoAlta.cantidad_item_menu.push(
                this.productosCantidad[index]
            );
            this.pedidoAlta.item_menu_sector.push(p.sector);
            this.pedidoAlta.estado_detalle.push('pendiente');
        } else {
            this.pedidoAlta.cantidad_item_menu[indiceEncontrado]++;
        }
        await this.DefinirPrecioPedido();
        console.log(this.pedidoAlta);
        this.spinner.hide();
        this.calculando = false;
    }

    async EliminarCantidad(p: Producto, index: number) {
        this.calculando = true;
        this.spinner.show();
        if (this.productosCantidad[index] != 0) {
            this.productosCantidad[index] = this.productosCantidad[index] - 1;

            let indiceEncontrado: number = this.IndiceIgualdadEnPedidoLocal(p);
            console.log(this.pedidoAlta);

            if (indiceEncontrado == -1) {
            } else {
                if (
                    this.pedidoAlta.cantidad_item_menu[indiceEncontrado] - 1 ==
                    0
                ) {
                    this.pedidoAlta.item_menu.splice(indiceEncontrado, 1);
                    this.pedidoAlta.cantidad_item_menu.splice(
                        indiceEncontrado,
                        1
                    );

                    this.pedidoAlta.item_menu_sector.splice(
                        indiceEncontrado,
                        1
                    );
                    this.pedidoAlta.estado_detalle.splice(indiceEncontrado, 1);
                } else {
                    this.pedidoAlta.cantidad_item_menu[indiceEncontrado]--;
                }
                await this.DefinirPrecioPedido();
            }
        }
        console.log(this.pedidoAlta);
        this.spinner.hide();
        this.calculando = false;
    }

    async DefinirPrecioPedido() {
        this.precioTotal = 0;
        this.tiempoEstimado = 0;

        let flag = true;
        let tiempoMasAlto = 0;
        let tiempoActual = 0;

        for (let i = 0; i < this.pedidoAlta.item_menu.length; i++) {
            // console.log(this.pedidoAlta.item_menu[i]);

            const productoDb = await this.productoService.getProductoNombre(
                this.pedidoAlta.item_menu[i]
            );
            const productoReal = productoDb.docs[0].data();

            this.precioTotal +=
                productoReal['precio'] * this.pedidoAlta.cantidad_item_menu[i];

            tiempoActual =
                productoReal['tiempoElaboracion'] *
                this.pedidoAlta.cantidad_item_menu[i];
            if (flag || tiempoActual >= tiempoMasAlto) {
                flag = false;
                tiempoMasAlto = tiempoActual;
            }
        }
        this.tiempoEstimado = tiempoMasAlto;
    }

    IndiceIgualdadEnPedidoLocal(p: Producto) {
        let indiceEncontrado = -1;
        for (let i = 0; i < this.pedidoAlta.item_menu.length + 1; i++) {
            if (p.nombre == this.pedidoAlta.item_menu[i]) {
                indiceEncontrado = i;
                break;
            }
        }
        return indiceEncontrado;
    }

    async AltaPedido() {
        this.spinner.show();

        // para hardcodear cuando no puedo hacer apk...
        // const mesClienteDb = await this.db.traerClienteDeUnaMesa(
        //     'M3Kze37AVUf5MXzulj3MYH4NUX42'
        // );
        // const mesaCliente = mesClienteDb.docs[0].data() as Mesa;

        const cliente = this.auth.currentUserSig() as Cliente;

        const mesClienteDb = await this.db.traerClienteDeUnaMesa(cliente.uid!);
        const mesaCliente = mesClienteDb.docs[0].data() as Mesa;

        console.log(this.pedidoAlta);

        // this.pedidoAlta.id_cliente = 'M3Kze37AVUf5MXzulj3MYH4NUX42';
        // this.pedidoAlta.id_mesa = mesaCliente.uid!;

        this.pedidoAlta.id_cliente = cliente.uid!;
        this.pedidoAlta.id_mesa = mesaCliente.uid!;
        this.pedidoAlta.precio_total = this.precioTotal;
        this.pedidoAlta.tiempo_estimado = this.tiempoEstimado;
        this.pedidoAlta.estado = 'pendiente';

        const rta = await this.db.AltaPedido(this.pedidoAlta);

        cliente.situacion = 'pedidoPendienteAprobacion';
        const rta2 = await this.db.actualizarCliente(cliente);

        this.showAlert(
            'PERFECTO',
            'El pedido fue realizado correctamente. Debe esperar la confirmación del mozo'
        ).then(() => {
            this.router.navigate(['/espera-cliente']);
        });
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
