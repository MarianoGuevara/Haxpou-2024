import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
} from '@ionic/angular/standalone';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Cliente, Mesa, SituacionCliente } from 'src/app/interfaces/app.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailService } from 'src/app/services/email.service';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-maitre-lista-espera',
    templateUrl: './maitre-lista-espera.page.html',
    styleUrls: ['./maitre-lista-espera.page.scss'],
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
        RouterModule,
    ],
})
export class MaitreListaEsperaPage implements OnInit {
    // emailService = inject(EmailService);
    spinner = inject(NgxSpinnerService);
    db = inject(DatabaseService);
    clientesLista: Cliente[] = [];
    mesas : Mesa[] = [];

    procesoAsignarMesa : boolean = false;//Si es true cargamos el componente de las mesas para asignar
    constructor(private router: Router) {}

    ngOnInit() {
        this.spinner.show();
        try {
            this.db.traerClientesEspera().subscribe((data) => {
                this.clientesLista = data;
            });

            this.db.traerMesas().subscribe((data) => {
                this.mesas = data;
                this.spinner.hide();
              })
        } catch (error) {
            console.error(error);
            this.spinner.hide();
        }
    }

    actualizarCliente(cliente: Cliente, situacion: SituacionCliente) {
        cliente.situacion = situacion;
        this.procesoAsignarMesa = true;
    }

    asignarMesa(mesa : Mesa)
    {
  
    }
}
