import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
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
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
    Cliente,
    Empleado,
    Supervisor,
    UserDetails,
} from 'src/app/interfaces/app.interface';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { PhotoService } from 'src/app/services/photo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { SendPushService } from 'src/app/services/api-push.service';

@Component({
    selector: 'app-alta-cliente',
    templateUrl: './alta-cliente.page.html',
    styleUrls: ['./alta-cliente.page.scss'],
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
export class AltaDSPage {
    private fb = inject(FormBuilder);
    private qrscannerService = inject(QrscannerService);
    private alertController = inject(AlertController);
    private photoService = inject(PhotoService);
    private spinner = inject(NgxSpinnerService);
    private authService = inject(AuthService);
    private sendPushService = inject(SendPushService);

    protected userImage = '/assets/DefaultUser.png';
    private content: string[] = [];
    protected loading = false;

    protected credentials: FormGroup;

    constructor() {
        this.credentials = this.fb.group({
            apellidos: ['', Validators.required],
            nombres: ['', Validators.required],
            dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
            correo: ['', [Validators.required, Validators.email]],
            clave1: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    async onScanClick() {
        const result = await this.qrscannerService.startScan();
        if (result === null) {
            this.showAlert('Error', 'No se ha escaneado el código de barras');
        } else {
            this.content = result.split('@');

            const nombres = this.content[2].split(' ');
            const apellidos = this.content[1].split(' ');

            if (nombres.length > 1) {
                this.nombres?.setValue(
                    `${
                        nombres[0].charAt(0) + nombres[0].slice(1).toLowerCase()
                    } ${
                        nombres[1].charAt(0) + nombres[1].slice(1).toLowerCase()
                    }`
                );
            } else {
                this.nombres?.setValue(
                    `${
                        nombres[0].charAt(0) + nombres[0].slice(1).toLowerCase()
                    }`
                );
            }
            if (apellidos.length > 1) {
                this.apellidos?.setValue(
                    `${
                        apellidos[0].charAt(0) +
                        apellidos[0].slice(1).toLowerCase()
                    } ${
                        apellidos[1].charAt(0) +
                        apellidos[1].slice(1).toLowerCase()
                    }`
                );
            } else {
                this.apellidos?.setValue(
                    `${
                        apellidos[0].charAt(0) +
                        apellidos[0].slice(1).toLowerCase()
                    }`
                );
            }

            this.dni?.setValue(this.content[4]);
        }
    }

    async onTakePhotoClick() {
        this.userImage = await this.photoService.takePhoto();
    }

    async addUser() {
        this.spinner.show();

        const url = await this.photoService.uploadPhoto(this.userImage);
        if (url === null) {
            this.spinner.hide();
            this.showAlert('Error', 'Ha ocurrido un error');
            return;
        }

        const newClient: Empleado = {
            nombre: this.nombres?.value,
            apellido: this.apellidos?.value,
            correo: this.correo?.value,
            dni: this.dni?.value,
            clave: this.clave1?.value,
            // aprobado: 'pendiente',
            cuil: 20225733446,
            // role: 'clienteRegistrado',
            role: 'dueno',
            foto: url,
            // situacion: 'out',
            // mesaAsignada: -1,
        };

        console.log(newClient);

        await this.authService.register(newClient);

        this.sendPushService.sendToRole(
            'Nuevo cliente',
            'Un nuevo cliente esta pendiente de aprobación',
            'supervisor'
        );

        this.spinner.hide();

        this.credentials.reset();
        this.userImage = '/assets/DefaultUser.png';
        this.showAlert(
            'Usuario añadido',
            '¡Usuario añadido a la base de datos con éxito!'
        );
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

    async tomarFoto(): Promise<void> {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
        });

        //validamos que haya sacado la foto
        if (image && image.dataUrl) {
        }
    }

    protected obtenerMensajeError(campo: string): string | null {
        const control = this.credentials.get(campo);

        if (control?.errors) {
            if (control.errors['required']) {
                return 'Este campo es obligatorio';
            } else if (control.errors['minlength']) {
                return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
            } else if (control.errors['maxlength']) {
                return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
            } else if (control.errors['pattern'] && campo === 'dni') {
                return 'Debe tener 8 dígitos exactos';
            } else if (control.errors['pattern'] && campo === 'cuil') {
                return 'Debe tener 11 dígitos exactos';
            } else if (control.errors['min']) {
                return `El valor mínimo es ${control.errors['min'].min}`;
            } else if (control.errors['max']) {
                return `El valor máximo es ${control.errors['max'].max}`;
            } else if (control.errors['email']) {
                return 'El correo no es válido';
            }
        }
        return null;
    }

    get apellidos() {
        return this.credentials.get('apellidos');
    }

    get nombres() {
        return this.credentials.get('nombres');
    }

    get dni() {
        return this.credentials.get('dni');
    }

    get correo() {
        return this.credentials.get('correo');
    }

    get clave1() {
        return this.credentials.get('clave1');
    }
}
