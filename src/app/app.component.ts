import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NgxSpinnerModule } from 'ngx-spinner';
import { register } from 'swiper/element/bundle';

// para lo de swiper de deslizar las imagenes de los productos
register();

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [IonApp, IonRouterOutlet, NgxSpinnerModule],
})
export class AppComponent {
    constructor() {}
}
