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
import { DatabaseService } from 'src/app/services/database.service';
import { CommonModule } from '@angular/common';
import {
    IonBackButton,
    IonButtons,
    AlertController,
    IonNote,
    IonFab,
    IonFabButton,
    IonInputPasswordToggle,
    IonInput,
} from '@ionic/angular/standalone';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Cliente } from 'src/app/interfaces/user-details.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-espera-cliente',
  templateUrl: './espera-cliente.page.html',
  styleUrls: ['./espera-cliente.page.scss'],
  standalone: true,
  imports: [
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	CommonModule,
	FormsModule,
	IonBackButton,
	IonButton,
	IonButtons,
	IonNote,
	IonFab,
	IonFabButton,
	IonInputPasswordToggle,
	ReactiveFormsModule,
	IonInput,
    RouterLink,
    QrInicioAppComponent
  ]
})
export class EsperaClientePage {
	db = inject(DatabaseService);
	authService = inject(AuthService);

	constructor() { }

	ngOnInit() {

	}

	async entrarEnListaEspera(cliente:any) {
		// await this.db.actualizarCliente();
	}

}
