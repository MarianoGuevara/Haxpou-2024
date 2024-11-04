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
} from '@ionic/angular/standalone';
import { Producto } from 'src/app/interfaces/app.interface';
import { ProductoService } from 'src/app/services/producto.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductCardComponent } from 'src/app/components/product-card/product-card.component';

@Component({
    selector: 'app-listado-productos',
    templateUrl: './listado-productos.page.html',
    styleUrls: ['./listado-productos.page.scss'],
    standalone: true,
    imports: [
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
})
export class ListadoProductosPage implements OnInit {
    private productoService = inject(ProductoService);
    private spinner = inject(NgxSpinnerService);

    protected productos: Producto[] = [];

    constructor() {}

    async ngOnInit() {
        this.spinner.show();
        this.productoService.traerProductos().subscribe((productos) => {
            this.productos = productos;
            this.spinner.hide();
        });
    }
}
