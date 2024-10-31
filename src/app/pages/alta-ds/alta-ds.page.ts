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
import { UserDetails } from 'src/app/interfaces/user-details.interface';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
    selector: 'app-alta-ds',
    templateUrl: './alta-ds.page.html',
    styleUrls: ['./alta-ds.page.scss'],
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

    protected userImage = '/assets/DefaultUser.png';
    private content: string[] = [];
    protected loading = false;

    protected credentials: FormGroup;

    constructor() {
        this.loading = false;
        this.credentials = this.fb.group({
            apellidos: ['', Validators.required],
            nombres: ['', Validators.required],
            dni: [
                '',
                [
                    Validators.required,
                    Validators.min(10000000),
                    Validators.max(99999999),
                ],
            ],
            cuil: [
                '',
                [
                    Validators.required,
                    Validators.min(10000000000),
                    Validators.max(99999999999),
                ],
            ],
            correo: ['', [Validators.required, Validators.email]],
            clave1: ['', Validators.required],
        });
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

    get cuil() {
        return this.credentials.get('cuil');
    }

    get correo() {
        return this.credentials.get('correo');
    }

    get clave1() {
        return this.credentials.get('clave1');
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
        this.loading = true;

        // const url = await this.photoService.uploadPhoto(this.userImage);
        // if (url === null) {
        //     this.loading = false;
        //     this.showAlert('Error', 'Ha ocurrido un error');
        //     return;
        // }

        // const newAppUser: UserDetails = {
        //     imageUrl: url,
        //     nombres: this.nombres?.value,
        //     apellidos: this.apellidos?.value,
        //     correo: this.correo?.value,
        //     dni: this.dni?.value,
        //     clave: this.clave1?.value,
        // };

        // console.log(newAppUser);

        // await this.appUserService.addAppUser(newAppUser);

        this.loading = false;

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
}
