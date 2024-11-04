import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';

@Component({
    selector: 'app-supervisor-home',
    templateUrl: './supervisor-home.component.html',
    styleUrls: ['./supervisor-home.component.scss'],
    standalone: true,
    imports: [IonButton, RouterLink],
})
export class SupervisorHomeComponent {
    constructor() {}
}
