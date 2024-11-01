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
import { Cliente } from 'src/app/interfaces/user-details.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailService } from 'src/app/services/email.service';

@Component({
    selector: 'app-clientes-pendientes',
    templateUrl: './clientes-pendientes.page.html',
    styleUrls: ['./clientes-pendientes.page.scss'],
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
    ],
})
export class ClientesPendientesPage implements OnInit {
    private emailService = inject(EmailService);

    clientes: Cliente[] = [];

    constructor(
        private db: DatabaseService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit() {
        this.spinner.show();
        try {
            this.db.traerClientesPendientes().subscribe((data) => {
                this.clientes = data;
                this.spinner.hide();
            });
        } catch (error) {
            console.error(error);
            this.spinner.hide();
        }
    }

    actualizarCliente(cliente: Cliente, estado: 'rechazado' | 'aprobado') {
        this.emailService.enviarCorreo(
            cliente.nombre,
            cliente.correo,
            'Estado de aprobación',
            `Hola ${cliente.nombre} ${
                cliente.apellido
            }, le informamos que luego de una revisión rigurosa por parte de nuestros encargados de administración, llegamos a la conclusión de que su cuenta ha sido ${
                cliente.aprobado === 'aprobado' ? 'aprobada' : 'rechazada'
            }.`
        );
        cliente.aprobado = estado;
        this.db.actualizarCliente(cliente);
    }
}
