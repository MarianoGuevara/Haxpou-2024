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
import { PerfilesType } from 'src/app/interfaces/app.interface';
import { PushService } from 'src/app/services/push.service';

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
    private pushService = inject(PushService);

    protected readonly Perfiles = Perfiles;

    constructor() {
		this.pushService.init()
	}

	ngOnInit(): void {
		console.log("HOME -> ", this.authService.currentUserSig());
	}

    protected logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }
}
