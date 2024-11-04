import { Component, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-realizar-pedido',
    templateUrl: './realizar-pedido.page.html',
    styleUrls: ['./realizar-pedido.page.scss'],
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
		RouterLink
    ],
})
export class RealizarPedidoPage {
    constructor() {}
}
