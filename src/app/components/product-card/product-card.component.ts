import { Component, Input, OnInit, Output } from '@angular/core';
import { Producto } from 'src/app/interfaces/app.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductCardComponent {
    @Input() producto: Producto | null = null;

    // product card se convierte en el pedido actual.

    constructor() {}
}
