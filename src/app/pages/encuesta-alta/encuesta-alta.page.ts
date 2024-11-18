import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonBackButton,
    IonButtons,
    AlertController,
    IonNote,
    IonFab,
    IonFabButton,
    IonInputPasswordToggle,
    IonInput,
    IonRange,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonSelectOption,
    IonSelect,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
    Cliente,
    Encuesta,
    Pedido,
    UserDetails,
} from 'src/app/interfaces/app.interface';
import { DatabaseService } from 'src/app/services/database.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-encuesta-alta',
    templateUrl: './encuesta-alta.page.html',
    styleUrls: ['./encuesta-alta.page.scss'],
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
        IonRange,
        IonRadioGroup,
        IonRadio,
        IonItem,
        IonLabel,
        IonCheckbox,
        IonSelectOption,
        IonSelect,
    ],
})
export class EncuestaAltaPage implements OnInit {
    selectedOption!: string;
    isRecomendacion: boolean | null = null;
    isRedes: boolean | null = null;
    isPublicidad: boolean | null = null;
    isOtro: boolean | null = null;
    opinion: string | null = null;
    comida: number | null = null;
    satisfecho: number = 0;

    protected authService = inject(AuthService);
    private alertController = inject(AlertController);
    private router = inject(Router);
    db = inject(DatabaseService);
    spinner = inject(NgxSpinnerService);
    clienteActual: Cliente | null = null;

    constructor() {}

    ngOnInit() {
        this.clienteActual = this.authService.currentUserSig() as Cliente;
    }

    aniadirEncuesta(): void {
        if (
            !(
                this.selectedOption == null ||
                this.opinion == null ||
                this.comida == null
            )
        ) {
            if (
                this.isOtro ||
                this.isPublicidad ||
                this.isRecomendacion ||
                this.isRedes
            ) {
                this.spinner.show();
                var comoConocio = [];

                if (this.isRecomendacion) {
                    comoConocio.push(0);
                }

                if (this.isRedes) {
                    comoConocio.push(1);
                }

                if (this.isPublicidad) {
                    comoConocio.push(2);
                }

                if (this.isOtro) {
                    comoConocio.push(3);
                }

                var encuesta: Encuesta = {
                    fecha: new Date(),
                    atencion_cliente: this.satisfecho,
                    comida: this.comida!,
                    como_conocio: comoConocio,
                    opinion_general: this.opinion!,
                    limpieza: parseInt(this.selectedOption),
                    encuestado: this.clienteActual?.nombre!,
                };

                this.db.agregarEncuesta(encuesta);
                this.clienteActual!.completoEncuesta = true;

                this.db.actualizarCliente(this.clienteActual!);
                this.spinner.hide();
                this.showAlert(
                    'Encuesta añadida',
                    '¡Encuesta añadida a la base de datos con éxito!',
                    'cliente-estado-pedido-encuesta'
                );
            } else {
                this.showAlert(
                    'Error',
                    'Datos incompletos, por favor complete el formulario'
                );
            }
        } else {
            this.showAlert(
                'Error',
                'Datos incompletos, por favor complete el formulario'
            );
        }
    }

    private async showAlert(header: string, message: string, ruta?: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [
                {
                    text: 'Vale',
                    handler: () => {
                        if (ruta) {
                            this.router.navigateByUrl(`/${ruta}`);
                        }
                    },
                },
            ],
            cssClass: 'custom-alert-class',
        });
        await alert.present();
    }
}
