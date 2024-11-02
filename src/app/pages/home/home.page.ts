import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { QrInicioAppComponent } from "../../components/qr-inicio-app/qr-inicio-app.component";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    RouterLink,
    QrInicioAppComponent
],
})
export class HomePage {
    private authService = inject(AuthService);
    private router = inject(Router);

    constructor() {}

    protected logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}
