import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { QrInicioAppComponent } from '../../components/qr-inicio-app/qr-inicio-app.component';
import { Perfiles } from 'src/app/utils/perfiles.enum';
import { PerfilesType } from 'src/app/interfaces/user-details.interface';

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
        QrInicioAppComponent,
    ],
})
export class HomePage {
    protected authService = inject(AuthService);
    private router = inject(Router);

    protected readonly Perfiles = Perfiles;

    constructor() {}

    protected logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}
