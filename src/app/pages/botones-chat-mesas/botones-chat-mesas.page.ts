import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-botones-chat-mesas',
    templateUrl: './botones-chat-mesas.page.html',
    styleUrls: ['./botones-chat-mesas.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        FormsModule,
        IonButtons,
        IonButton,
        IonBackButton,
		RouterLink
    ],
})
export class BotonesChatMesasPage {
    constructor() {}
}
