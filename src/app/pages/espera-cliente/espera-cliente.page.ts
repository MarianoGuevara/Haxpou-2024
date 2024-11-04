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
import { Cliente, Mesa, UserDetails } from 'src/app/interfaces/app.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailService } from 'src/app/services/email.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';

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
        QrInicioAppComponent,
    ],
})
export class EsperaClientePage {
    db = inject(DatabaseService);
    authService = inject(AuthService);
	alertController = inject(AlertController);
	qr = inject(QrscannerService);
	spinner = inject(NgxSpinnerService);
	router = inject(Router);

	cliente : UserDetails | null | undefined;

	qrMesaSeleccionada : string | null = null;

	mesas : Mesa[] = [];

    constructor() {
		this.cliente = this.authService.currentUserSig()
	}

    // ngOnInit() {}

    async entrarEnListaEspera() {
		const cliente: Cliente = this.authService.currentUserSig() as Cliente;

		if (cliente.role == "clienteAnonimo" || cliente.role == 'clienteRegistrado')
		{
			switch (cliente.situacion)	
			{
				case "out":
					cliente.situacion = 'enEspera';
					await this.db.actualizarCliente(cliente);
					this.showAlert("Exito",  cliente.nombre + ", usted ha ingresado en la lista de espera");
					break
				case 'enEspera':
					this.showAlert("Fracaso",  cliente.nombre + ", usted ya había ingresado en la lista de espera antes, no puede hacerlo de nuevo");
					break;
				case 'mesaAsignado':
					this.showAlert("Fracaso",  cliente.nombre + ", usted ya tiene una mesa asignada, no puede entrar en la lista de espera");
					break;
			}
		}
    }

	async entrarEncuestasPrevias() {
		const cliente: Cliente = this.authService.currentUserSig() as Cliente;
		console.log(cliente);

		if (cliente.role == "clienteAnonimo" || cliente.role == 'clienteRegistrado')
		{
			switch (cliente.situacion)	
			{
				case 'mesaAsignado':
				case "out":
					this.showAlert("Fracaso",  cliente.nombre + ", debe ingresar a la lista de espera antes de acceder a las encuestas");
					break;
				case 'enEspera':
					this.router.navigate(["/encuestas-previas"]);
					break;
			}
		}
	}

	async tomarMesa() {
		const cliente: Cliente = this.authService.currentUserSig() as Cliente;

		if (cliente.role == "clienteAnonimo" || cliente.role == 'clienteRegistrado')
		{
			switch (cliente.situacion)	
			{
				case 'mesaAsignado':
					await this.escanearMesa();
					break;
				case "out":
					this.showAlert("Fracaso",  cliente.nombre + ", debe ingresar a la lista de espera antes de asignarte una mesa");
					break;
				case 'enEspera':
					this.showAlert("Fracaso",  cliente.nombre + ", un 'maitre' debe asignarte una mesa antes de que puedas asignarla a tu usuario");
					break;
			}
		}
	}

	async escanearMesa() : Promise<void>
	{
		var numeroMesa = await this.qr.startScan();
		
		var resp = await this.db.traerMesa(numeroMesa!.charAt(4));

		const mesa = resp.docs[0].data() as Mesa;

		if(mesa.idCliente !== this.cliente?.uid)
		{
			this.showAlert('Mesa no correspondiente',`Tu mesa asignada es la numero ${mesa.numero}`);
		}
		else
		{
			
		}
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
