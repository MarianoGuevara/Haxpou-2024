import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';

@Component({
    selector: 'app-mozo-home',
    templateUrl: './mozo-home.component.html',
    styleUrls: ['./mozo-home.component.scss'],
    standalone: true,
    imports: [IonButton, RouterLink],
})
export class MozoHomeComponent {
    constructor() {}
}
