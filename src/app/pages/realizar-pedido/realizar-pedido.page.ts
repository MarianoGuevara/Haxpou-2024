import { Component, inject, OnInit } from '@angular/core';
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
import { AuthService } from 'src/app/services/auth.service';
import { Cliente, UserDetails } from 'src/app/interfaces/app.interface';

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
        RouterLink,
    ],
})
export class RealizarPedidoPage {
    protected authService = inject(AuthService);
    constructor() {}

    protected castUserToClient(user: UserDetails) {
        return user as Cliente;
    }
}
