import { Component, inject } from '@angular/core';
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
    IonInput,
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NgxSpinnerService } from 'ngx-spinner';
import { PhotoService } from 'src/app/services/photo.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/interfaces/user-details.interface';

@Component({
    selector: 'app-alta-producto',
    templateUrl: './alta-producto.page.html',
    styleUrls: ['./alta-producto.page.scss'],
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
        ReactiveFormsModule,
        IonInput,
    ],
})
export class AltaProductoPage {
    private fb = inject(FormBuilder);
    private alertController = inject(AlertController);
    private photoService = inject(PhotoService);
    private spinner = inject(NgxSpinnerService);
    private databaseService = inject(DatabaseService);

    protected productImages: string[] = new Array(3).fill(
        '/assets/DefaultUser.png'
    );
    protected loading = false;
    protected productForm: FormGroup;

    constructor() {
        this.productForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            tiempoElaboracion: ['', [Validators.required, Validators.min(1)]],
            precio: ['', [Validators.required, Validators.min(0.01)]],
        });
    }

    async onTakePhotoClick(index: number) {
        const image = await this.photoService.takePhoto();
        if (image) {
            this.productImages[index] = image;
        }
    }

    async addProduct() {
        this.spinner.show();

        // Intentamos subir las fotos y obtenemos los URLs resultantes (o null en caso de fallo)
        const imageUrls = await Promise.all(
            this.productImages.map((image) =>
                this.photoService.uploadPhoto(image)
            )
        );

        // Verificamos si hay algún null en los URLs de las imágenes
        const validImageUrls = imageUrls.filter(
            (url): url is string => url !== null
        );

        if (validImageUrls.length < this.productImages.length) {
            this.spinner.hide();
            this.showAlert('Error', 'Error al cargar una o más fotos');
            return;
        }

        // Creación del objeto Producto
        const newProduct: Producto = {
            nombre: this.productForm.get('nombre')?.value,
            descripcion: this.productForm.get('descripcion')?.value,
            tiempoElaboracion: this.productForm.get('tiempoElaboracion')?.value,
            precio: this.productForm.get('precio')?.value,
            fotos: validImageUrls,
            qr: 'poner qr link aca',
        };

        await this.databaseService.agregarFalopaaaaaa(newProduct, 'Productos');

        this.spinner.hide();
        this.productForm.reset();
        this.productImages.fill('/assets/default-image.png');
        this.showAlert('Producto añadido', '¡Producto añadido exitosamente!');
    }

    private async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['OK'],
        });
        await alert.present();
    }
}
