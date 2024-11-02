import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonCard,
    IonContent,
    IonNote,
    IonInputPasswordToggle,
    AlertController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { QrscannerService } from 'src/app/services/qrscanner.service';

@Component({
  selector: 'app-qr-inicio-app',
  standalone: true,
  templateUrl: './qr-inicio-app.component.html',
  styleUrls: ['./qr-inicio-app.component.scss'],
  imports: [
	CommonModule,
	IonButton,
	IonInput,
	IonLabel,
	IonItem,
	IonCard,
	IonContent,
	IonNote,
	IonInputPasswordToggle,
  ]
})
export class QrInicioAppComponent {
	qrScannService = inject(QrscannerService);
    alertController = inject(AlertController);
	router = inject(Router);
	authServie = inject(AuthService);

	constructor() { }

	ngOnInit() {}

	async scanearQrInicioApp(){
		console.log(this.authServie.currentUserSig());
		this.router.navigate(["/espera-cliente"]);
		// const rta = await this.qrScannService.startScan();

		// if (rta == "ClienteListaDeEsperaMaitre") {
		// 	// this.showAlert("Habilitado", "Usted entró al local. Será redirigido al sector ")
		// 	this.router.navigate(["/espera-cliente"]);
		// }
		// else {
		// 	this.showAlert("QR inválido", "El QR leido no es el correcto para ingresar al local");
		// }
	}

	private async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['Vale'],
            cssClass: 'custom-alert-class',
        });
        await alert.present();
    }
}
