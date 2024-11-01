import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    constructor() {}

    // usar asincronico; en .then salió todo bien
    async enviarCorreo(
        destinatarioNombre: string,
        direccionCorreo: string,
        asunto: string,
        cuerpo: string
    ): Promise<void> {
        const templateParams = {
            to_name: destinatarioNombre,
            from_name: 'Haxpou',
            message: cuerpo,
            subject: asunto,
            logo_url:
                'https://firebasestorage.googleapis.com/v0/b/haxpou-2024.appspot.com/o/logo%2Flogo.png?alt=media&token=5cb2c0b6-6e5f-4bb1-b9ff-5f28632ed207',
            to_email: direccionCorreo,
        };

        try {
            const response: EmailJSResponseStatus = await emailjs.send(
                'haxpou2024',
                'Haxpou2024-template',
                templateParams,
                'paTjMkufhSx00e3uw'
            );
            console.log(
                'Correo enviado exitosamente!',
                response.status,
                response.text
            );
        } catch (error) {
            console.error('Error al enviar el correo:', error);
        }
    }
}