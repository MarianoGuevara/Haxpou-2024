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
import { Perfiles } from 'src/app/interfaces/user-details.interface';

@Component({
    selector: 'app-auth-form',
    standalone: true,
    templateUrl: './auth-form.component.html',
    styleUrls: ['./auth-form.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonButton,
        IonInput,
        IonLabel,
        IonItem,
        IonCard,
        IonContent,
        IonNote,
        IonInputPasswordToggle,
    ],
})
export class AuthFormComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    // Por ahí reemplazarlo con un modal propio vvvv <============
    private alertController = inject(AlertController);

    protected credentials: FormGroup;

    constructor() {
        this.credentials = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    get email() {
        return this.credentials.get('email');
    }

    get password() {
        return this.credentials.get('password');
    }

    public async login() {
        const user = await this.authService.login(
            this.email?.value,
            this.password?.value
        );

        if (user) {
            console.log('¡Inicio de sesión exitoso!');
            this.router.navigateByUrl('/home', { replaceUrl: true });
        } else {
            this.showAlert(
                'Error de Inicio de Sesión',
                '¡Por favor, inténtalo de nuevo!'
            );
        }
    }

    /**
     * Devuelve un mensaje de error personalizado basado en las validaciones de un campo de un formulario reactivo específico.
     *
     * @param {string} campo - El nombre del campo en el formulario reactivo que se está validando.
     *
     * @returns {string | null} - Un mensaje de error si existen errores de validación en el campo, o `null` si no hay errores.
     *
     * Esta función accede al formulario
     * y verifica si existen errores de validación en dicho campo. Según el tipo de error encontrado (`required`, `minlength`, `maxlength`,
     * `pattern`, `min`, `max`, `email`), se retorna un mensaje de error descriptivo para el usuario. Si no hay errores, devuelve `null`.
     */
    protected obtenerMensajeError(campo: string): string | null {
        const control = this.credentials.get(campo);

        if (control?.errors) {
            if (control.errors['required']) {
                return 'Este campo es obligatorio';
            } else if (control.errors['minlength']) {
                return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
            } else if (control.errors['maxlength']) {
                return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
            } else if (control.errors['pattern']) {
                return 'El formato no es válido';
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

    private async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['Vale'],
            cssClass: 'custom-alert-class',
        });
        await alert.present();
    }

    public fillInGuest(guest: Perfiles) {
        if (guest === 'dueno') {
            this.credentials.setValue({
                email: 'guest1@guest.com',
                password: 'guest1',
            });
        } else if (guest === 'supervisor') {
            this.credentials.setValue({
                email: 'guest2@guest.com',
                password: 'guest2',
            });
        }
        // seguir...
    }
}
