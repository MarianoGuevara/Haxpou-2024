import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [IonApp, IonRouterOutlet, NgxSpinnerModule],
})
export class AppComponent {
    constructor() {}
}
